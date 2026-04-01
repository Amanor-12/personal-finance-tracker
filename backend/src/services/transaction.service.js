const pool = require('../config/db');
const AppError = require('../utils/AppError');

const transactionSelectSql = `
  SELECT
    t.id,
    t.category_id,
    c.name AS category_name,
    c.type AS category_type,
    t.type,
    t.amount,
    t.description,
    t.transaction_date,
    t.created_at,
    t.updated_at
  FROM transactions t
  INNER JOIN categories c
    ON c.id = t.category_id
    AND c.user_id = t.user_id
  WHERE t.user_id = $1
`;

const serializeTransaction = (record) => ({
  ...record,
  amount: Number(record.amount),
});

const getOwnedCategory = async (db, userId, categoryId) => {
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

  return result.rows[0];
};

const getTransactions = async (userId) => {
  const result = await pool.query(
    `
      ${transactionSelectSql}
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `,
    [userId]
  );

  return result.rows.map(serializeTransaction);
};

const getTransactionById = async (userId, transactionId, db = pool) => {
  const result = await db.query(
    `
      ${transactionSelectSql}
      AND t.id = $2
    `,
    [userId, transactionId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Transaction not found.', 404);
  }

  return serializeTransaction(result.rows[0]);
};

const createTransaction = async (userId, payload) => {
  const client = await pool.connect();

  try {
    const category = await getOwnedCategory(client, userId, payload.category_id);

    if (category.type !== payload.type) {
      throw new AppError('Transaction type must match the selected category type.', 400);
    }

    const result = await client.query(
      `
        INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      [
        userId,
        payload.category_id,
        payload.type,
        payload.amount,
        payload.description || '',
        payload.transaction_date,
      ]
    );

    return getTransactionById(userId, result.rows[0].id, client);
  } finally {
    client.release();
  }
};

const updateTransaction = async (userId, transactionId, payload) => {
  const client = await pool.connect();

  try {
    await getTransactionById(userId, transactionId, client);
    const category = await getOwnedCategory(client, userId, payload.category_id);

    if (category.type !== payload.type) {
      throw new AppError('Transaction type must match the selected category type.', 400);
    }

    await client.query(
      `
        UPDATE transactions
        SET
          category_id = $1,
          type = $2,
          amount = $3,
          description = $4,
          transaction_date = $5
        WHERE id = $6 AND user_id = $7
      `,
      [
        payload.category_id,
        payload.type,
        payload.amount,
        payload.description || '',
        payload.transaction_date,
        transactionId,
        userId,
      ]
    );

    return getTransactionById(userId, transactionId, client);
  } finally {
    client.release();
  }
};

const deleteTransaction = async (userId, transactionId) => {
  const result = await pool.query(
    `
      DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `,
    [transactionId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Transaction not found.', 404);
  }
};

module.exports = {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
};
