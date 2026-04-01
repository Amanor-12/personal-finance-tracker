require('dotenv').config();

const bcrypt = require('bcrypt');

const pool = require('../config/db');

const DEMO_USER = {
  email: 'demo@flowledger.com',
  name: 'Demo User',
  password: 'DemoPass123!',
};

const DEMO_CATEGORIES = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investments', type: 'income' },
  { name: 'Housing', type: 'expense' },
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Lifestyle', type: 'expense' },
  { name: 'Utilities', type: 'expense' },
];

const formatDate = (date) => date.toISOString().split('T')[0];

const monthDate = (monthOffset, day) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  date.setMonth(date.getMonth() + monthOffset);
  date.setDate(day);
  return formatDate(date);
};

const buildTransactions = (categoryIds) => [
  { categoryId: categoryIds.Salary, type: 'income', amount: 6200, description: 'Monthly salary', transactionDate: monthDate(0, 1) },
  { categoryId: categoryIds.Freelance, type: 'income', amount: 1450, description: 'Client retainer', transactionDate: monthDate(0, 8) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1800, description: 'Rent payment', transactionDate: monthDate(0, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 690, description: 'Groceries and dining', transactionDate: monthDate(0, 11) },
  { categoryId: categoryIds.Transport, type: 'expense', amount: 245, description: 'Transit and rideshare', transactionDate: monthDate(0, 14) },
  { categoryId: categoryIds.Lifestyle, type: 'expense', amount: 540, description: 'Shopping and personal spend', transactionDate: monthDate(0, 18) },
  { categoryId: categoryIds.Utilities, type: 'expense', amount: 225, description: 'Utilities bundle', transactionDate: monthDate(0, 21) },

  { categoryId: categoryIds.Salary, type: 'income', amount: 6180, description: 'Monthly salary', transactionDate: monthDate(-1, 1) },
  { categoryId: categoryIds.Investments, type: 'income', amount: 320, description: 'Dividend payout', transactionDate: monthDate(-1, 9) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1800, description: 'Rent payment', transactionDate: monthDate(-1, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 610, description: 'Groceries and dining', transactionDate: monthDate(-1, 13) },
  { categoryId: categoryIds.Lifestyle, type: 'expense', amount: 430, description: 'Lifestyle spend', transactionDate: monthDate(-1, 19) },

  { categoryId: categoryIds.Salary, type: 'income', amount: 6125, description: 'Monthly salary', transactionDate: monthDate(-2, 1) },
  { categoryId: categoryIds.Freelance, type: 'income', amount: 980, description: 'Project milestone', transactionDate: monthDate(-2, 16) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1790, description: 'Rent payment', transactionDate: monthDate(-2, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 560, description: 'Groceries and dining', transactionDate: monthDate(-2, 10) },
  { categoryId: categoryIds.Transport, type: 'expense', amount: 225, description: 'Transit and fuel', transactionDate: monthDate(-2, 14) },
  { categoryId: categoryIds.Utilities, type: 'expense', amount: 210, description: 'Utilities bundle', transactionDate: monthDate(-2, 23) },

  { categoryId: categoryIds.Salary, type: 'income', amount: 6080, description: 'Monthly salary', transactionDate: monthDate(-3, 1) },
  { categoryId: categoryIds.Investments, type: 'income', amount: 280, description: 'Dividend payout', transactionDate: monthDate(-3, 20) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1780, description: 'Rent payment', transactionDate: monthDate(-3, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 600, description: 'Groceries and dining', transactionDate: monthDate(-3, 12) },
  { categoryId: categoryIds.Lifestyle, type: 'expense', amount: 360, description: 'Subscriptions and leisure', transactionDate: monthDate(-3, 18) },

  { categoryId: categoryIds.Salary, type: 'income', amount: 6050, description: 'Monthly salary', transactionDate: monthDate(-4, 1) },
  { categoryId: categoryIds.Freelance, type: 'income', amount: 1250, description: 'Consulting invoice', transactionDate: monthDate(-4, 15) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1765, description: 'Rent payment', transactionDate: monthDate(-4, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 550, description: 'Groceries and dining', transactionDate: monthDate(-4, 11) },
  { categoryId: categoryIds.Transport, type: 'expense', amount: 210, description: 'Transit and fuel', transactionDate: monthDate(-4, 17) },

  { categoryId: categoryIds.Salary, type: 'income', amount: 6000, description: 'Monthly salary', transactionDate: monthDate(-5, 1) },
  { categoryId: categoryIds.Investments, type: 'income', amount: 250, description: 'Dividend payout', transactionDate: monthDate(-5, 12) },
  { categoryId: categoryIds.Housing, type: 'expense', amount: 1750, description: 'Rent payment', transactionDate: monthDate(-5, 2) },
  { categoryId: categoryIds.Food, type: 'expense', amount: 520, description: 'Groceries and dining', transactionDate: monthDate(-5, 9) },
  { categoryId: categoryIds.Utilities, type: 'expense', amount: 205, description: 'Utilities bundle', transactionDate: monthDate(-5, 21) },
];

const buildBudgets = (categoryIds) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return [
    { categoryId: categoryIds.Housing, amountLimit: 1900, month, year },
    { categoryId: categoryIds.Food, amountLimit: 850, month, year },
    { categoryId: categoryIds.Transport, amountLimit: 320, month, year },
    { categoryId: categoryIds.Lifestyle, amountLimit: 500, month, year },
    { categoryId: categoryIds.Utilities, amountLimit: 260, month, year },
  ];
};

async function seedDemoData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
    const userResult = await client.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          updated_at = NOW()
        RETURNING id
      `,
      [DEMO_USER.name, DEMO_USER.email, passwordHash]
    );

    const userId = userResult.rows[0].id;

    for (const category of DEMO_CATEGORIES) {
      await client.query(
        `
          INSERT INTO categories (user_id, name, type)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, name, type)
          DO UPDATE SET updated_at = NOW()
        `,
        [userId, category.name, category.type]
      );
    }

    const categoriesResult = await client.query(
      `
        SELECT id, name, type
        FROM categories
        WHERE user_id = $1
      `,
      [userId]
    );

    const categoryIds = categoriesResult.rows.reduce((result, row) => {
      result[row.name] = row.id;
      return result;
    }, {});

    await client.query('DELETE FROM budgets WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM transactions WHERE user_id = $1', [userId]);

    const demoTransactions = buildTransactions(categoryIds);

    for (const transaction of demoTransactions) {
      await client.query(
        `
          INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          userId,
          transaction.categoryId,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.transactionDate,
        ]
      );
    }

    const demoBudgets = buildBudgets(categoryIds);

    for (const budget of demoBudgets) {
      await client.query(
        `
          INSERT INTO budgets (user_id, category_id, amount_limit, month, year)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [userId, budget.categoryId, budget.amountLimit, budget.month, budget.year]
      );
    }

    await client.query('COMMIT');

    console.log(`Seeded demo data for ${DEMO_USER.email}`);
    console.log(`Categories: ${DEMO_CATEGORIES.length}`);
    console.log(`Transactions: ${demoTransactions.length}`);
    console.log(`Budgets: ${demoBudgets.length}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemoData().catch((error) => {
  console.error('Failed to seed demo data.');
  console.error(error);
  process.exit(1);
});
