const bcrypt = require('bcrypt');

const pool = require('../config/db');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const starterCategories = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Housing', type: 'expense' },
  { name: 'Groceries', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Savings', type: 'expense' },
];

const publicUserFields = `
  id,
  name,
  email,
  created_at,
  updated_at
`;

const registerUser = async ({ name, email, password }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rowCount > 0) {
      throw new AppError('An account with that email already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING ${publicUserFields}
      `,
      [name, email, passwordHash]
    );

    const user = userResult.rows[0];

    for (const category of starterCategories) {
      await client.query(
        `
          INSERT INTO categories (user_id, name, type)
          VALUES ($1, $2, $3)
        `,
        [user.id, category.name, category.type]
      );
    }

    await client.query('COMMIT');

    return {
      user,
      token: signToken(user),
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token: signToken(user),
  };
};

const getCurrentUser = async (userId) => {
  const result = await pool.query(
    `
      SELECT ${publicUserFields}
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('User account could not be found.', 404);
  }

  return result.rows[0];
};

const listUsers = async () => {
  const result = await pool.query(
    `
      SELECT ${publicUserFields}
      FROM users
      ORDER BY created_at DESC
    `
  );

  return result.rows;
};

module.exports = {
  getCurrentUser,
  listUsers,
  registerUser,
  loginUser,
};
