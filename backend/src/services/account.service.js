const pool = require('../config/db');
const AppError = require('../utils/AppError');

let schemaReady = false;

const accountSelectSql = `
  SELECT
    a.id,
    a.user_id,
    a.name,
    a.account_type,
    a.institution_name,
    a.masked_identifier,
    a.opening_balance,
    a.current_balance,
    a.currency,
    a.notes,
    a.status,
    a.is_primary,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.user_id = $1
`;

const ensureAccountsTable = async () => {
  if (schemaReady) {
    return;
  }

  await pool.query(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(80) NOT NULL,
      account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'other')),
      institution_name VARCHAR(120) NULL,
      masked_identifier VARCHAR(20) NULL,
      opening_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
      current_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
      currency CHAR(3) NOT NULL DEFAULT 'USD',
      notes VARCHAR(255) NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
      is_primary BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS accounts_one_primary_per_user
    ON accounts (user_id)
    WHERE is_primary = TRUE AND status = 'active'
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS accounts_id_user_id_unique
    ON accounts (id, user_id)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_accounts_user_status
    ON accounts (user_id, status, created_at DESC)
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'accounts_set_updated_at'
      ) THEN
        CREATE TRIGGER accounts_set_updated_at
        BEFORE UPDATE ON accounts
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
      END IF;
    END
    $$;
  `);

  schemaReady = true;
};

const serializeAccount = (record) => ({
  ...record,
  current_balance: Number(record.current_balance),
  opening_balance: Number(record.opening_balance),
});

const getAccountCount = async (db, userId) => {
  const result = await db.query(
    `
      SELECT COUNT(*)::int AS total
      FROM accounts
      WHERE user_id = $1 AND status = 'active'
    `,
    [userId]
  );

  return result.rows[0].total;
};

const normalizeAccountPayload = (payload) => ({
  account_type: payload.account_type,
  currency: (payload.currency || 'USD').trim().toUpperCase(),
  current_balance:
    payload.current_balance === undefined || payload.current_balance === null
      ? Number(payload.opening_balance || 0)
      : Number(payload.current_balance),
  institution_name: payload.institution_name?.trim() || null,
  masked_identifier: payload.masked_identifier?.trim() || null,
  name: payload.name.trim(),
  notes: payload.notes?.trim() || '',
  opening_balance: Number(payload.opening_balance || 0),
});

const getAccounts = async (userId) => {
  await ensureAccountsTable();

  const result = await pool.query(
    `
      ${accountSelectSql}
      ORDER BY
        CASE WHEN a.status = 'active' THEN 0 ELSE 1 END,
        a.is_primary DESC,
        a.created_at DESC,
        a.id DESC
    `,
    [userId]
  );

  return result.rows.map(serializeAccount);
};

const getAccountById = async (userId, accountId, db = pool) => {
  await ensureAccountsTable();

  const result = await db.query(
    `
      ${accountSelectSql}
      AND a.id = $2
    `,
    [userId, accountId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Account not found.', 404);
  }

  return serializeAccount(result.rows[0]);
};

const createAccount = async (userId, payload) => {
  await ensureAccountsTable();
  const client = await pool.connect();
  const account = normalizeAccountPayload(payload);

  try {
    await client.query('BEGIN');

    const activeCount = await getAccountCount(client, userId);
    const isPrimary = payload.is_primary === true || activeCount === 0;

    if (isPrimary) {
      await client.query(
        `
          UPDATE accounts
          SET is_primary = FALSE
          WHERE user_id = $1
        `,
        [userId]
      );
    }

    const result = await client.query(
      `
        INSERT INTO accounts (
          user_id,
          name,
          account_type,
          institution_name,
          masked_identifier,
          opening_balance,
          current_balance,
          currency,
          notes,
          is_primary
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
      [
        userId,
        account.name,
        account.account_type,
        account.institution_name,
        account.masked_identifier,
        account.opening_balance,
        account.current_balance,
        account.currency,
        account.notes,
        isPrimary,
      ]
    );

    await client.query('COMMIT');
    return getAccountById(userId, result.rows[0].id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateAccount = async (userId, accountId, payload) => {
  await ensureAccountsTable();
  const client = await pool.connect();
  const account = normalizeAccountPayload(payload);

  try {
    await client.query('BEGIN');
    await getAccountById(userId, accountId, client);

    if (payload.is_primary === true) {
      await client.query(
        `
          UPDATE accounts
          SET is_primary = FALSE
          WHERE user_id = $1
        `,
        [userId]
      );
    }

    await client.query(
      `
        UPDATE accounts
        SET
          name = $1,
          account_type = $2,
          institution_name = $3,
          masked_identifier = $4,
          opening_balance = $5,
          current_balance = $6,
          currency = $7,
          notes = $8,
          is_primary = CASE WHEN $9 = TRUE THEN TRUE ELSE is_primary END
        WHERE id = $10 AND user_id = $11
      `,
      [
        account.name,
        account.account_type,
        account.institution_name,
        account.masked_identifier,
        account.opening_balance,
        account.current_balance,
        account.currency,
        account.notes,
        payload.is_primary === true,
        accountId,
        userId,
      ]
    );

    await client.query('COMMIT');
    return getAccountById(userId, accountId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const setPrimaryAccount = async (userId, accountId) => {
  await ensureAccountsTable();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const account = await getAccountById(userId, accountId, client);

    if (account.status !== 'active') {
      throw new AppError('Archived accounts cannot be primary.', 400);
    }

    await client.query('UPDATE accounts SET is_primary = FALSE WHERE user_id = $1', [userId]);
    await client.query('UPDATE accounts SET is_primary = TRUE WHERE id = $1 AND user_id = $2', [
      accountId,
      userId,
    ]);
    await client.query('COMMIT');

    return getAccountById(userId, accountId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const archiveAccount = async (userId, accountId) => {
  await ensureAccountsTable();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const account = await getAccountById(userId, accountId, client);

    await client.query(
      `
        UPDATE accounts
        SET status = 'archived', is_primary = FALSE
        WHERE id = $1 AND user_id = $2
      `,
      [accountId, userId]
    );

    if (account.is_primary) {
      await client.query(
        `
          UPDATE accounts
          SET is_primary = TRUE
          WHERE id = (
            SELECT id
            FROM accounts
            WHERE user_id = $1 AND status = 'active'
            ORDER BY created_at DESC, id DESC
            LIMIT 1
          )
        `,
        [userId]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  archiveAccount,
  createAccount,
  ensureAccountsTable,
  getAccountById,
  getAccounts,
  setPrimaryAccount,
  updateAccount,
};
