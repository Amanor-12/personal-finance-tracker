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
  {
    amount: 6200,
    categoryId: categoryIds.Salary,
    description: 'Monthly salary',
    transactionDate: monthDate(0, 1),
    type: 'income',
  },
  {
    amount: 1450,
    categoryId: categoryIds.Freelance,
    description: 'Client retainer',
    transactionDate: monthDate(0, 8),
    type: 'income',
  },
  {
    amount: 1800,
    categoryId: categoryIds.Housing,
    description: 'Rent payment',
    transactionDate: monthDate(0, 2),
    type: 'expense',
  },
  {
    amount: 690,
    categoryId: categoryIds.Food,
    description: 'Groceries and dining',
    transactionDate: monthDate(0, 11),
    type: 'expense',
  },
  {
    amount: 245,
    categoryId: categoryIds.Transport,
    description: 'Transit and rideshare',
    transactionDate: monthDate(0, 14),
    type: 'expense',
  },
  {
    amount: 540,
    categoryId: categoryIds.Lifestyle,
    description: 'Shopping and personal spend',
    transactionDate: monthDate(0, 18),
    type: 'expense',
  },
  {
    amount: 225,
    categoryId: categoryIds.Utilities,
    description: 'Utilities bundle',
    transactionDate: monthDate(0, 21),
    type: 'expense',
  },
  {
    amount: 6180,
    categoryId: categoryIds.Salary,
    description: 'Monthly salary',
    transactionDate: monthDate(-1, 1),
    type: 'income',
  },
  {
    amount: 320,
    categoryId: categoryIds.Investments,
    description: 'Dividend payout',
    transactionDate: monthDate(-1, 9),
    type: 'income',
  },
  {
    amount: 1800,
    categoryId: categoryIds.Housing,
    description: 'Rent payment',
    transactionDate: monthDate(-1, 2),
    type: 'expense',
  },
  {
    amount: 610,
    categoryId: categoryIds.Food,
    description: 'Groceries and dining',
    transactionDate: monthDate(-1, 13),
    type: 'expense',
  },
  {
    amount: 430,
    categoryId: categoryIds.Lifestyle,
    description: 'Lifestyle spend',
    transactionDate: monthDate(-1, 19),
    type: 'expense',
  },
  {
    amount: 6125,
    categoryId: categoryIds.Salary,
    description: 'Monthly salary',
    transactionDate: monthDate(-2, 1),
    type: 'income',
  },
  {
    amount: 980,
    categoryId: categoryIds.Freelance,
    description: 'Project milestone',
    transactionDate: monthDate(-2, 16),
    type: 'income',
  },
  {
    amount: 1790,
    categoryId: categoryIds.Housing,
    description: 'Rent payment',
    transactionDate: monthDate(-2, 2),
    type: 'expense',
  },
  {
    amount: 560,
    categoryId: categoryIds.Food,
    description: 'Groceries and dining',
    transactionDate: monthDate(-2, 10),
    type: 'expense',
  },
  {
    amount: 225,
    categoryId: categoryIds.Transport,
    description: 'Transit and fuel',
    transactionDate: monthDate(-2, 14),
    type: 'expense',
  },
  {
    amount: 210,
    categoryId: categoryIds.Utilities,
    description: 'Utilities bundle',
    transactionDate: monthDate(-2, 23),
    type: 'expense',
  },
];

const buildBudgets = (categoryIds) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return [
    { amountLimit: 1900, categoryId: categoryIds.Housing, month, year },
    { amountLimit: 850, categoryId: categoryIds.Food, month, year },
    { amountLimit: 320, categoryId: categoryIds.Transport, month, year },
    { amountLimit: 500, categoryId: categoryIds.Lifestyle, month, year },
    { amountLimit: 260, categoryId: categoryIds.Utilities, month, year },
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
        SELECT id, name
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
