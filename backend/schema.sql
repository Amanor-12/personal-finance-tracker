DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS recurring_payments CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS set_updated_at();

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT categories_user_name_type_key UNIQUE (user_id, name, type),
  CONSTRAINT categories_id_user_id_unique UNIQUE (id, user_id)
);

CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'other')),
  institution_name VARCHAR(120) NULL,
  masked_identifier VARCHAR(20) NULL,
  opening_balance NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (opening_balance >= 0),
  current_balance NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_balance >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  notes VARCHAR(255) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT accounts_id_user_id_unique UNIQUE (id, user_id),
  CONSTRAINT accounts_currency_check CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL,
  account_id BIGINT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) NOT NULL DEFAULT '',
  notes VARCHAR(500) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded', 'pending', 'excluded')),
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT transactions_category_owner_fkey
    FOREIGN KEY (category_id, user_id)
    REFERENCES categories (id, user_id)
    ON DELETE RESTRICT,
  CONSTRAINT transactions_account_owner_fkey
    FOREIGN KEY (account_id, user_id)
    REFERENCES accounts (id, user_id)
    ON DELETE RESTRICT
);

CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL,
  amount_limit NUMERIC(12, 2) NOT NULL CHECK (amount_limit > 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT budgets_user_category_period_key UNIQUE (user_id, category_id, month, year),
  CONSTRAINT budgets_category_owner_fkey
    FOREIGN KEY (category_id, user_id)
    REFERENCES categories (id, user_id)
    ON DELETE RESTRICT
);

CREATE TABLE cards (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(60) NOT NULL,
  holder_name VARCHAR(120) NOT NULL,
  brand VARCHAR(40) NOT NULL,
  last4 CHAR(4) NOT NULL,
  expiry CHAR(5) NOT NULL,
  theme VARCHAR(20) NOT NULL DEFAULT 'indigo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cards_last4_digits CHECK (last4 ~ '^[0-9]{4}$'),
  CONSTRAINT cards_expiry_format CHECK (expiry ~ '^(0[1-9]|1[0-2])/[0-9]{2}$'),
  CONSTRAINT cards_theme_check CHECK (theme IN ('indigo', 'emerald', 'sunset'))
);

CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(80) NOT NULL,
  goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN ('save', 'payoff')),
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recurring_payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL,
  account_id BIGINT NULL,
  name VARCHAR(120) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  billing_frequency VARCHAR(20) NOT NULL CHECK (billing_frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'custom')),
  next_payment_date DATE NOT NULL,
  notes VARCHAR(500) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT recurring_payments_category_owner_fkey
    FOREIGN KEY (category_id, user_id)
    REFERENCES categories (id, user_id)
    ON DELETE RESTRICT,
  CONSTRAINT recurring_payments_account_owner_fkey
    FOREIGN KEY (account_id, user_id)
    REFERENCES accounts (id, user_id)
    ON DELETE RESTRICT
);

CREATE INDEX idx_categories_user_type ON categories (user_id, type);
CREATE INDEX idx_transactions_user_date ON transactions (user_id, transaction_date DESC);
CREATE INDEX idx_transactions_user_category ON transactions (user_id, category_id);
CREATE INDEX idx_transactions_user_account ON transactions (user_id, account_id);
CREATE INDEX idx_budgets_user_period ON budgets (user_id, year DESC, month DESC);
CREATE INDEX idx_cards_user_created ON cards (user_id, created_at DESC);
CREATE INDEX idx_accounts_user_status ON accounts (user_id, status, created_at DESC);
CREATE UNIQUE INDEX accounts_one_primary_per_user
ON accounts (user_id)
WHERE is_primary = TRUE AND status = 'active';
CREATE INDEX idx_goals_user_target_date ON goals (user_id, target_date ASC NULLS LAST, created_at DESC);
CREATE INDEX idx_recurring_user_status_date ON recurring_payments (user_id, status, next_payment_date ASC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER transactions_set_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER budgets_set_updated_at
BEFORE UPDATE ON budgets
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cards_set_updated_at
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER accounts_set_updated_at
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER goals_set_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER recurring_payments_set_updated_at
BEFORE UPDATE ON recurring_payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
