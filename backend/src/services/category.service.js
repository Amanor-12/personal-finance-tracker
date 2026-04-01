const pool = require('../config/db');
const AppError = require('../utils/AppError');

const categoryOverviewSql = `
  SELECT
    c.id,
    c.name,
    c.type,
    c.created_at,
    c.updated_at,
    COALESCE(tx.transaction_count, 0)::int AS transaction_count,
    COALESCE(bu.budget_count, 0)::int AS budget_count
  FROM categories c
  LEFT JOIN (
    SELECT category_id, COUNT(*)::int AS transaction_count
    FROM transactions
    WHERE user_id = $1
    GROUP BY category_id
  ) tx ON tx.category_id = c.id
  LEFT JOIN (
    SELECT category_id, COUNT(*)::int AS budget_count
    FROM budgets
    WHERE user_id = $1
    GROUP BY category_id
  ) bu ON bu.category_id = c.id
  WHERE c.user_id = $1
`;

const getCategories = async (userId) => {
  const result = await pool.query(
    `
      ${categoryOverviewSql}
      ORDER BY CASE WHEN c.type = 'income' THEN 0 ELSE 1 END, c.name ASC
    `,
    [userId]
  );

  return result.rows;
};

const getCategoryById = async (userId, categoryId, db = pool) => {
  const result = await db.query(
    `
      ${categoryOverviewSql}
      AND c.id = $2
    `,
    [userId, categoryId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Category not found.', 404);
  }

  return result.rows[0];
};

const createCategory = async (userId, { name, type }) => {
  const result = await pool.query(
    `
      INSERT INTO categories (user_id, name, type)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [userId, name, type]
  );

  return getCategoryById(userId, result.rows[0].id);
};

const updateCategory = async (userId, categoryId, { name, type }) => {
  const currentCategory = await getCategoryById(userId, categoryId);
  const hasDependencies =
    currentCategory.transaction_count > 0 || currentCategory.budget_count > 0;

  if (currentCategory.type !== type && hasDependencies) {
    throw new AppError(
      'This category is already linked to transactions or budgets, so its type cannot be changed.',
      409
    );
  }

  await pool.query(
    `
      UPDATE categories
      SET name = $1, type = $2
      WHERE id = $3 AND user_id = $4
    `,
    [name, type, categoryId, userId]
  );

  return getCategoryById(userId, categoryId);
};

const deleteCategory = async (userId, categoryId) => {
  const category = await getCategoryById(userId, categoryId);

  if (category.transaction_count > 0 || category.budget_count > 0) {
    throw new AppError(
      'Delete or reassign linked transactions and budgets before removing this category.',
      409,
      {
        transactionCount: category.transaction_count,
        budgetCount: category.budget_count,
      }
    );
  }

  await pool.query(
    `
      DELETE FROM categories
      WHERE id = $1 AND user_id = $2
    `,
    [categoryId, userId]
  );
};

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};
