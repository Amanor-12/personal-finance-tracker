const pool = require('../config/db');

const toNumber = (value) => Number(value || 0);

const getSummary = async (userId) => {
  const [totalsResult, expenseBreakdownResult, incomeBreakdownResult, budgetOverviewResult, monthlyTrendResult, recentTransactionsResult] =
    await Promise.all([
      pool.query(
        `
          SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses
          FROM transactions
          WHERE user_id = $1
        `,
        [userId]
      ),
      pool.query(
        `
          SELECT
            c.id AS category_id,
            c.name,
            COALESCE(SUM(t.amount), 0) AS total_amount
          FROM categories c
          LEFT JOIN transactions t
            ON t.category_id = c.id
            AND t.user_id = c.user_id
            AND t.type = 'expense'
          WHERE c.user_id = $1 AND c.type = 'expense'
          GROUP BY c.id, c.name
          HAVING COALESCE(SUM(t.amount), 0) > 0
          ORDER BY total_amount DESC, c.name ASC
        `,
        [userId]
      ),
      pool.query(
        `
          SELECT
            c.id AS category_id,
            c.name,
            COALESCE(SUM(t.amount), 0) AS total_amount
          FROM categories c
          LEFT JOIN transactions t
            ON t.category_id = c.id
            AND t.user_id = c.user_id
            AND t.type = 'income'
          WHERE c.user_id = $1 AND c.type = 'income'
          GROUP BY c.id, c.name
          HAVING COALESCE(SUM(t.amount), 0) > 0
          ORDER BY total_amount DESC, c.name ASC
        `,
        [userId]
      ),
      pool.query(
        `
          SELECT
            b.id,
            b.category_id,
            c.name AS category_name,
            b.amount_limit,
            COALESCE(SUM(t.amount), 0) AS spent_amount
          FROM budgets b
          INNER JOIN categories c
            ON c.id = b.category_id
            AND c.user_id = b.user_id
          LEFT JOIN transactions t
            ON t.user_id = b.user_id
            AND t.category_id = b.category_id
            AND t.type = 'expense'
            AND EXTRACT(MONTH FROM t.transaction_date)::int = b.month
            AND EXTRACT(YEAR FROM t.transaction_date)::int = b.year
          WHERE
            b.user_id = $1
            AND b.month = EXTRACT(MONTH FROM CURRENT_DATE)::int
            AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)::int
          GROUP BY b.id, b.category_id, c.name, b.amount_limit
          ORDER BY (COALESCE(SUM(t.amount), 0) / NULLIF(b.amount_limit, 0)) DESC, c.name ASC
        `,
        [userId]
      ),
      pool.query(
        `
          SELECT
            TO_CHAR(months.month_start, 'Mon') AS label,
            TO_CHAR(months.month_start, 'YYYY-MM') AS month_key,
            COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS expenses
          FROM generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
            date_trunc('month', CURRENT_DATE),
            INTERVAL '1 month'
          ) AS months(month_start)
          LEFT JOIN transactions t
            ON t.user_id = $1
            AND date_trunc('month', t.transaction_date) = months.month_start
          GROUP BY months.month_start
          ORDER BY months.month_start
        `,
        [userId]
      ),
      pool.query(
        `
          SELECT
            t.id,
            t.type,
            t.amount,
            t.description,
            t.transaction_date,
            c.name AS category_name
          FROM transactions t
          INNER JOIN categories c
            ON c.id = t.category_id
            AND c.user_id = t.user_id
          WHERE t.user_id = $1
          ORDER BY t.transaction_date DESC, t.created_at DESC
          LIMIT 6
        `,
        [userId]
      ),
    ]);

  const totals = totalsResult.rows[0];
  const totalIncome = toNumber(totals.total_income);
  const totalExpenses = toNumber(totals.total_expenses);
  const expenseBreakdown = expenseBreakdownResult.rows.map((row) => ({
    category_id: row.category_id,
    name: row.name,
    total_amount: toNumber(row.total_amount),
  }));
  const incomeBreakdown = incomeBreakdownResult.rows.map((row) => ({
    category_id: row.category_id,
    name: row.name,
    total_amount: toNumber(row.total_amount),
  }));
  const budgetOverview = budgetOverviewResult.rows.map((row) => {
    const amountLimit = toNumber(row.amount_limit);
    const spentAmount = toNumber(row.spent_amount);

    return {
      id: row.id,
      category_id: row.category_id,
      category_name: row.category_name,
      amount_limit: amountLimit,
      spent_amount: spentAmount,
      remaining_amount: amountLimit - spentAmount,
      utilization: amountLimit > 0 ? Number((spentAmount / amountLimit).toFixed(4)) : 0,
    };
  });
  const monthlyTrend = monthlyTrendResult.rows.map((row) => ({
    label: row.label,
    month_key: row.month_key,
    income: toNumber(row.income),
    expenses: toNumber(row.expenses),
  }));
  const recentTransactions = recentTransactionsResult.rows.map((row) => ({
    ...row,
    amount: toNumber(row.amount),
  }));

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    categoryBreakdown: {
      income: incomeBreakdown,
      expense: expenseBreakdown,
    },
    budgetOverview,
    monthlyTrend,
    recentTransactions,
    currentMonthLabel: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
  };
};

module.exports = {
  getSummary,
};
