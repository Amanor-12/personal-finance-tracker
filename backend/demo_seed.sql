BEGIN;

-- Demo account for presentations
-- Email: demo@flowledger.com
-- Password: DemoPass123!

INSERT INTO users (name, email, password_hash)
VALUES (
  'Demo User',
  'demo@flowledger.com',
  '$2b$12$QtW5E4XerEg/46j0EWww/.xhnK9Wwg/N5Xm.U5qj.F6.TdA.mpfge'
)
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

DELETE FROM budgets
WHERE user_id = (SELECT id FROM users WHERE email = 'demo@flowledger.com');

DELETE FROM transactions
WHERE user_id = (SELECT id FROM users WHERE email = 'demo@flowledger.com');

DELETE FROM categories
WHERE user_id = (SELECT id FROM users WHERE email = 'demo@flowledger.com');

INSERT INTO categories (user_id, name, type)
VALUES
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Salary', 'income'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Freelance', 'income'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Investments', 'income'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Housing', 'expense'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Food', 'expense'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Transport', 'expense'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Lifestyle', 'expense'),
  ((SELECT id FROM users WHERE email = 'demo@flowledger.com'), 'Utilities', 'expense');

INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date)
VALUES
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6200,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Freelance' AND c.type = 'income'),
    'income',
    1450,
    'Client retainer',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '7 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1800,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    690,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '10 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Transport' AND c.type = 'expense'),
    'expense',
    245,
    'Transit and rideshare',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '13 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Lifestyle' AND c.type = 'expense'),
    'expense',
    540,
    'Shopping and personal spend',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '17 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Utilities' AND c.type = 'expense'),
    'expense',
    225,
    'Utilities bundle',
    (date_trunc('month', CURRENT_DATE) + INTERVAL '20 day')::date
  ),

  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6180,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Investments' AND c.type = 'income'),
    'income',
    320,
    'Dividend payout',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '8 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1800,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    610,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '12 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Lifestyle' AND c.type = 'expense'),
    'expense',
    430,
    'Lifestyle spend',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' + INTERVAL '18 day')::date
  ),

  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6125,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Freelance' AND c.type = 'income'),
    'income',
    980,
    'Project milestone',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '15 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1790,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    560,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '9 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Transport' AND c.type = 'expense'),
    'expense',
    225,
    'Transit and fuel',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '13 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Utilities' AND c.type = 'expense'),
    'expense',
    210,
    'Utilities bundle',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '2 month' + INTERVAL '22 day')::date
  ),

  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6080,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '3 month' + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Investments' AND c.type = 'income'),
    'income',
    280,
    'Dividend payout',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '3 month' + INTERVAL '19 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1780,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '3 month' + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    600,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '3 month' + INTERVAL '11 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Lifestyle' AND c.type = 'expense'),
    'expense',
    360,
    'Subscriptions and leisure',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '3 month' + INTERVAL '17 day')::date
  ),

  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6050,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '4 month' + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Freelance' AND c.type = 'income'),
    'income',
    1250,
    'Consulting invoice',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '4 month' + INTERVAL '14 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1765,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '4 month' + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    550,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '4 month' + INTERVAL '10 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Transport' AND c.type = 'expense'),
    'expense',
    210,
    'Transit and fuel',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '4 month' + INTERVAL '16 day')::date
  ),

  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Salary' AND c.type = 'income'),
    'income',
    6000,
    'Monthly salary',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 month' + INTERVAL '0 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Investments' AND c.type = 'income'),
    'income',
    250,
    'Dividend payout',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 month' + INTERVAL '11 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    'expense',
    1750,
    'Rent payment',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 month' + INTERVAL '1 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    'expense',
    520,
    'Groceries and dining',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 month' + INTERVAL '8 day')::date
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Utilities' AND c.type = 'expense'),
    'expense',
    205,
    'Utilities bundle',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 month' + INTERVAL '20 day')::date
  );

INSERT INTO budgets (user_id, category_id, amount_limit, month, year)
VALUES
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Housing' AND c.type = 'expense'),
    1900,
    EXTRACT(MONTH FROM CURRENT_DATE)::int,
    EXTRACT(YEAR FROM CURRENT_DATE)::int
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Food' AND c.type = 'expense'),
    850,
    EXTRACT(MONTH FROM CURRENT_DATE)::int,
    EXTRACT(YEAR FROM CURRENT_DATE)::int
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Transport' AND c.type = 'expense'),
    320,
    EXTRACT(MONTH FROM CURRENT_DATE)::int,
    EXTRACT(YEAR FROM CURRENT_DATE)::int
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Lifestyle' AND c.type = 'expense'),
    500,
    EXTRACT(MONTH FROM CURRENT_DATE)::int,
    EXTRACT(YEAR FROM CURRENT_DATE)::int
  ),
  (
    (SELECT id FROM users WHERE email = 'demo@flowledger.com'),
    (SELECT c.id FROM categories c INNER JOIN users u ON u.id = c.user_id WHERE u.email = 'demo@flowledger.com' AND c.name = 'Utilities' AND c.type = 'expense'),
    260,
    EXTRACT(MONTH FROM CURRENT_DATE)::int,
    EXTRACT(YEAR FROM CURRENT_DATE)::int
  );

COMMIT;
