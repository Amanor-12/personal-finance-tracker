const pool = require('../config/db');
const AppError = require('../utils/AppError');

const cardSelectSql = `
  SELECT
    id,
    user_id,
    nickname,
    holder_name,
    brand,
    last4,
    expiry,
    theme,
    created_at,
    updated_at
  FROM cards
  WHERE user_id = $1
`;

const getCards = async (userId) => {
  const result = await pool.query(
    `
      ${cardSelectSql}
      ORDER BY created_at DESC, id DESC
    `,
    [userId]
  );

  return result.rows;
};

const getCardById = async (userId, cardId, db = pool) => {
  const result = await db.query(
    `
      ${cardSelectSql}
      AND id = $2
    `,
    [userId, cardId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Card not found.', 404);
  }

  return result.rows[0];
};

const createCard = async (userId, payload) => {
  const result = await pool.query(
    `
      INSERT INTO cards (user_id, nickname, holder_name, brand, last4, expiry, theme)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
    [userId, payload.nickname, payload.holder_name, payload.brand, payload.last4, payload.expiry, payload.theme || 'indigo']
  );

  return getCardById(userId, result.rows[0].id);
};

const deleteCard = async (userId, cardId) => {
  const result = await pool.query(
    `
      DELETE FROM cards
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `,
    [cardId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Card not found.', 404);
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
};
