const pool = require('../config/db');
const AppError = require('../utils/AppError');

const goalSelectSql = `
  SELECT
    g.id,
    g.title,
    g.goal_type,
    g.target_amount,
    g.current_amount,
    g.target_date,
    g.created_at,
    g.updated_at
  FROM goals g
  WHERE g.user_id = $1
`;

const serializeGoal = (record) => {
  const targetAmount = Number(record.target_amount);
  const currentAmount = Number(record.current_amount);
  const remainingAmount = targetAmount - currentAmount;
  const progress = targetAmount > 0 ? Number((currentAmount / targetAmount).toFixed(4)) : 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysRemaining = null;

  if (record.target_date) {
    const targetDate = new Date(record.target_date);
    targetDate.setHours(0, 0, 0, 0);
    daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000);
  }

  let status = 'Starting';

  if (currentAmount >= targetAmount) {
    status = 'Completed';
  } else if (daysRemaining !== null && daysRemaining < 0) {
    status = 'Behind';
  } else if (progress >= 0.66) {
    status = 'On track';
  } else if (progress >= 0.33) {
    status = 'Building';
  }

  return {
    ...record,
    target_amount: targetAmount,
    current_amount: currentAmount,
    remaining_amount: remainingAmount,
    progress,
    days_remaining: daysRemaining,
    status,
  };
};

const getGoals = async (userId) => {
  const result = await pool.query(
    `
      ${goalSelectSql}
      ORDER BY
        CASE WHEN g.target_date IS NULL THEN 1 ELSE 0 END,
        g.target_date ASC NULLS LAST,
        g.created_at DESC
    `,
    [userId]
  );

  return result.rows.map(serializeGoal);
};

const getGoalById = async (userId, goalId, db = pool) => {
  const result = await db.query(
    `
      ${goalSelectSql}
      AND g.id = $2
    `,
    [userId, goalId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Goal not found.', 404);
  }

  return serializeGoal(result.rows[0]);
};

const createGoal = async (userId, payload) => {
  const result = await pool.query(
    `
      INSERT INTO goals (user_id, title, goal_type, target_amount, current_amount, target_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [
      userId,
      payload.title,
      payload.goal_type,
      payload.target_amount,
      payload.current_amount,
      payload.target_date || null,
    ]
  );

  return getGoalById(userId, result.rows[0].id);
};

const updateGoal = async (userId, goalId, payload) => {
  await getGoalById(userId, goalId);

  await pool.query(
    `
      UPDATE goals
      SET
        title = $1,
        goal_type = $2,
        target_amount = $3,
        current_amount = $4,
        target_date = $5
      WHERE id = $6 AND user_id = $7
    `,
    [
      payload.title,
      payload.goal_type,
      payload.target_amount,
      payload.current_amount,
      payload.target_date || null,
      goalId,
      userId,
    ]
  );

  return getGoalById(userId, goalId);
};

const deleteGoal = async (userId, goalId) => {
  const result = await pool.query(
    `
      DELETE FROM goals
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `,
    [goalId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Goal not found.', 404);
  }
};

module.exports = {
  createGoal,
  deleteGoal,
  getGoalById,
  getGoals,
  updateGoal,
};
