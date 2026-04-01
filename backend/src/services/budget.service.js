const pool = require('../config/db');
const AppError = require('../utils/AppError');

const budgetSelectSql = `
  SELECT
    b.id,
    b.category_id,
    c.name AS category_name,
    c.type AS category_type,
    b.amount_limit,
    b.month,
    b.year,
    b.created_at,
    b.updated_at,
    COALESCE(spend.spent_amount, 0) AS spent_amount
  FROM budgets b
  INNER JOIN categories c
    ON c.id = b.category_id
    AND c.user_id = b.user_id
  LEFT JOIN LATERAL (
    SELECT SUM(t.amount) AS spent_amount
    FROM transactions t
    WHERE
      t.user_id = b.user_id
      AND t.category_id = b.category_id
      AND t.type = 'expense'
      AND EXTRACT(MONTH FROM t.transaction_date)::int = b.month
      AND EXTRACT(YEAR FROM t.transaction_date)::int = b.year
  ) spend ON TRUE
  WHERE b.user_id = $1
`;

const serializeBudget = (record) => {
  const amountLimit = Number(record.amount_limit);
  const spentAmount = Number(record.spent_amount);
  const remainingAmount = amountLimit - spentAmount;

  return {
    ...record,
    amount_limit: amountLimit,
    spent_amount: spentAmount,
    remaining_amount: remainingAmount,
    utilization: amountLimit > 0 ? Number((spentAmount / amountLimit).toFixed(4)) : 0,
    status:
      spentAmount > amountLimit
        ? 'Over budget'
        : spentAmount === amountLimit
          ? 'At limit'
          : spentAmount === 0
            ? 'Not started'
            : 'On track',
  };
};

const getExpenseCategory = async (db, userId, categoryId) => {
  const result = await db.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE id = $1 AND user_id = $2
    `,
    [categoryId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Selected category was not found.', 404);
  }

  if (result.rows[0].type !== 'expense') {
    throw new AppError('Budgets can only be created for expense categories.', 400);
  }

  return result.rows[0];
};

const ensureUniqueBudget = async (db, userId, categoryId, month, year, excludeBudgetId = null) => {
  const params = [userId, categoryId, month, year];
  let sql = `
    SELECT id
    FROM budgets
    WHERE user_id = $1 AND category_id = $2 AND month = $3 AND year = $4
  `;

  if (excludeBudgetId) {
    params.push(excludeBudgetId);
    sql += ' AND id <> $5';
  }

  const result = await db.query(sql, params);

  if (result.rowCount > 0) {
    throw new AppError('A budget already exists for that category and period.', 409);
  }
};

const getBudgets = async (userId) => {
  const result = await pool.query(
    `
      ${budgetSelectSql}
      ORDER BY b.year DESC, b.month DESC, c.name ASC
    `,
    [userId]
  );

  return result.rows.map(serializeBudget);
};

const getBudgetById = async (userId, budgetId, db = pool) => {
  const result = await db.query(
    `
      ${budgetSelectSql}
      AND b.id = $2
    `,
    [userId, budgetId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Budget not found.', 404);
  }

  return serializeBudget(result.rows[0]);
};

const createBudget = async (userId, payload) => {
  const client = await pool.connect();

  try {
    await getExpenseCategory(client, userId, payload.category_id);
    await ensureUniqueBudget(client, userId, payload.category_id, payload.month, payload.year);

    const result = await client.query(
      `
        INSERT INTO budgets (user_id, category_id, amount_limit, month, year)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [userId, payload.category_id, payload.amount_limit, payload.month, payload.year]
    );

    return getBudgetById(userId, result.rows[0].id, client);
  } finally {
    client.release();
  }
};

const updateBudget = async (userId, budgetId, payload) => {
  const client = await pool.connect();

  try {
    await getBudgetById(userId, budgetId, client);
    await getExpenseCategory(client, userId, payload.category_id);
    await ensureUniqueBudget(client, userId, payload.category_id, payload.month, payload.year, budgetId);

    await client.query(
      `
        UPDATE budgets
        SET
          category_id = $1,
          amount_limit = $2,
          month = $3,
          year = $4
        WHERE id = $5 AND user_id = $6
      `,
      [payload.category_id, payload.amount_limit, payload.month, payload.year, budgetId, userId]
    );

    return getBudgetById(userId, budgetId, client);
  } finally {
    client.release();
  }
};

const deleteBudget = async (userId, budgetId) => {
  const result = await pool.query(
    `
      DELETE FROM budgets
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `,
    [budgetId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Budget not found.', 404);
  }
};

module.exports = {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
};
