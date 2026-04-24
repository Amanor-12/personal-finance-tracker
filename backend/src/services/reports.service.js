const pool = require('../config/db');
const AppError = require('../utils/AppError');

const defaultReportRange = () => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - 89);

  return {
    endDate: end.toISOString().slice(0, 10),
    startDate: start.toISOString().slice(0, 10),
  };
};

const toNumber = (value) => Number(value || 0);

const buildInsightCards = ({
  activeRecurringCount,
  completedGoals,
  monthlyRecurringTotal,
  overspentBudgets,
  summary,
  topCategories,
  topMerchants,
}) => {
  const insights = [];

  if (summary.transactionCount === 0) {
    return insights;
  }

  if (summary.net >= 0 && summary.income > 0) {
    insights.push({
      body: `${Math.max(summary.savingsRate, 0).toFixed(0)}% of income remained after expenses in the selected range.`,
      label: 'Cash flow',
      tone: 'positive',
      title: 'Net position is positive',
    });
  } else if (summary.net < 0) {
    insights.push({
      body: 'Expenses are higher than income in the selected range.',
      label: 'Cash flow',
      tone: 'warning',
      title: 'Cash flow needs attention',
    });
  }

  if (topCategories[0]) {
    insights.push({
      body: `${topCategories[0].category} represents ${topCategories[0].share.toFixed(0)}% of expense spend in this range.`,
      label: 'Spending concentration',
      tone: topCategories[0].share >= 45 ? 'warning' : 'neutral',
      title: 'Largest category',
    });
  }

  if (topMerchants[0]) {
    insights.push({
      body: `${topMerchants[0].merchant} appears ${topMerchants[0].count} time${topMerchants[0].count === 1 ? '' : 's'} in the selected range.`,
      label: 'Merchant activity',
      tone: 'neutral',
      title: 'Top merchant source',
    });
  }

  if (overspentBudgets > 0) {
    insights.push({
      body: `${overspentBudgets} budget${overspentBudgets === 1 ? '' : 's'} are currently over limit.`,
      label: 'Budget pressure',
      tone: 'warning',
      title: 'Budget pressure detected',
    });
  }

  if (activeRecurringCount > 0) {
    insights.push({
      body: `$${monthlyRecurringTotal.toFixed(2)} is committed to active recurring payments each month.`,
      label: 'Recurring load',
      tone: 'neutral',
      title: 'Fixed monthly commitments',
    });
  }

  if (completedGoals > 0) {
    insights.push({
      body: `${completedGoals} goal${completedGoals === 1 ? '' : 's'} already completed.`,
      label: 'Goals',
      tone: 'positive',
      title: 'Goal momentum',
    });
  }

  return insights.slice(0, 4);
};

const getReportsOverview = async (userId, query = {}) => {
  const fallbackRange = defaultReportRange();
  const startDate = query.start_date || fallbackRange.startDate;
  const endDate = query.end_date || fallbackRange.endDate;

  if (startDate > endDate) {
    throw new AppError('Start date must be before the end date.', 400);
  }

  const [
    summaryResult,
    categoryResult,
    merchantResult,
    trendResult,
    inputCountsResult,
    budgetResult,
    recurringResult,
    goalsResult,
  ] = await Promise.all([
    pool.query(
      `
        SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
          COUNT(*)::INTEGER AS transaction_count
        FROM transactions
        WHERE
          user_id = $1
          AND transaction_date BETWEEN $2::date AND $3::date
          AND status <> 'excluded'
      `,
      [userId, startDate, endDate]
    ),
    pool.query(
      `
        WITH expense_totals AS (
          SELECT COALESCE(SUM(amount), 0) AS total
          FROM transactions
          WHERE
            user_id = $1
            AND type = 'expense'
            AND transaction_date BETWEEN $2::date AND $3::date
            AND status <> 'excluded'
        )
        SELECT
          c.name AS category,
          COALESCE(SUM(t.amount), 0) AS amount,
          CASE
            WHEN expense_totals.total > 0 THEN (COALESCE(SUM(t.amount), 0) / expense_totals.total) * 100
            ELSE 0
          END AS share
        FROM transactions t
        INNER JOIN categories c
          ON c.id = t.category_id
          AND c.user_id = t.user_id
        CROSS JOIN expense_totals
        WHERE
          t.user_id = $1
          AND t.type = 'expense'
          AND t.transaction_date BETWEEN $2::date AND $3::date
          AND t.status <> 'excluded'
        GROUP BY c.name, expense_totals.total
        ORDER BY amount DESC, c.name ASC
        LIMIT 5
      `,
      [userId, startDate, endDate]
    ),
    pool.query(
      `
        SELECT
          COALESCE(NULLIF(t.description, ''), c.name) AS merchant,
          COALESCE(SUM(t.amount), 0) AS amount,
          COUNT(*)::INTEGER AS count
        FROM transactions t
        INNER JOIN categories c
          ON c.id = t.category_id
          AND c.user_id = t.user_id
        WHERE
          t.user_id = $1
          AND t.type = 'expense'
          AND t.transaction_date BETWEEN $2::date AND $3::date
          AND t.status <> 'excluded'
        GROUP BY COALESCE(NULLIF(t.description, ''), c.name)
        ORDER BY amount DESC, merchant ASC
        LIMIT 5
      `,
      [userId, startDate, endDate]
    ),
    pool.query(
      `
        SELECT
          TO_CHAR(months.month_start, 'Mon') AS label,
          TO_CHAR(months.month_start, 'YYYY-MM') AS month_key,
          COALESCE(SUM(CASE WHEN t.type = 'income' AND t.status <> 'excluded' THEN t.amount ELSE 0 END), 0) AS income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.status <> 'excluded' THEN t.amount ELSE 0 END), 0) AS expenses
        FROM generate_series(
          date_trunc('month', $2::date),
          date_trunc('month', $3::date),
          INTERVAL '1 month'
        ) AS months(month_start)
        LEFT JOIN transactions t
          ON t.user_id = $1
          AND date_trunc('month', t.transaction_date) = months.month_start
        GROUP BY months.month_start
        ORDER BY months.month_start
      `,
      [userId, startDate, endDate]
    ),
    pool.query(
      `
        SELECT
          (SELECT COUNT(*)::INTEGER FROM accounts WHERE user_id = $1 AND status = 'active') AS active_accounts,
          (SELECT COUNT(*)::INTEGER FROM budgets WHERE user_id = $1) AS budgets,
          (SELECT COUNT(*)::INTEGER FROM goals WHERE user_id = $1) AS goals,
          (SELECT COUNT(*)::INTEGER FROM recurring_payments WHERE user_id = $1 AND status = 'active') AS recurring_payments
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT COUNT(*)::INTEGER AS overspent_count
        FROM (
          SELECT
            b.id,
            b.amount_limit,
            COALESCE(SUM(t.amount), 0) AS spent_amount
          FROM budgets b
          LEFT JOIN transactions t
            ON t.user_id = b.user_id
            AND t.category_id = b.category_id
            AND t.type = 'expense'
            AND t.status <> 'excluded'
            AND EXTRACT(MONTH FROM t.transaction_date)::int = b.month
            AND EXTRACT(YEAR FROM t.transaction_date)::int = b.year
          WHERE
            b.user_id = $1
            AND b.month = EXTRACT(MONTH FROM CURRENT_DATE)::int
            AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)::int
          GROUP BY b.id, b.amount_limit
          HAVING COALESCE(SUM(t.amount), 0) > b.amount_limit
        ) overspent
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT
          COUNT(*)::INTEGER AS active_count,
          COALESCE(
            SUM(
              CASE billing_frequency
                WHEN 'weekly' THEN amount * 52.0 / 12.0
                WHEN 'biweekly' THEN amount * 26.0 / 12.0
                WHEN 'monthly' THEN amount
                WHEN 'quarterly' THEN amount / 3.0
                WHEN 'annual' THEN amount / 12.0
                ELSE amount
              END
            ),
            0
          ) AS monthly_total
        FROM recurring_payments
        WHERE user_id = $1 AND status = 'active'
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT COUNT(*)::INTEGER AS completed_count
        FROM goals
        WHERE user_id = $1 AND current_amount >= target_amount
      `,
      [userId]
    ),
  ]);

  const summaryRow = summaryResult.rows[0];
  const summary = {
    expenses: toNumber(summaryRow.expenses),
    income: toNumber(summaryRow.income),
    net: toNumber(summaryRow.income) - toNumber(summaryRow.expenses),
    savingsRate:
      toNumber(summaryRow.income) > 0
        ? ((toNumber(summaryRow.income) - toNumber(summaryRow.expenses)) / toNumber(summaryRow.income)) * 100
        : 0,
    transactionCount: Number(summaryRow.transaction_count) || 0,
  };

  const topCategories = categoryResult.rows.map((row) => ({
    amount: toNumber(row.amount),
    category: row.category,
    share: toNumber(row.share),
  }));
  const topMerchants = merchantResult.rows.map((row) => ({
    amount: toNumber(row.amount),
    count: Number(row.count) || 0,
    merchant: row.merchant,
  }));
  const trend = trendResult.rows.map((row) => ({
    expenses: toNumber(row.expenses),
    income: toNumber(row.income),
    label: row.label,
    monthKey: row.month_key,
  }));
  const inputCounts = inputCountsResult.rows[0];
  const supportingInputs = {
    activeAccounts: Number(inputCounts.active_accounts) || 0,
    budgets: Number(inputCounts.budgets) || 0,
    goals: Number(inputCounts.goals) || 0,
    recurringPayments: Number(inputCounts.recurring_payments) || 0,
  };
  const overspentBudgets = Number(budgetResult.rows[0]?.overspent_count) || 0;
  const activeRecurringCount = Number(recurringResult.rows[0]?.active_count) || 0;
  const monthlyRecurringTotal = toNumber(recurringResult.rows[0]?.monthly_total);
  const completedGoals = Number(goalsResult.rows[0]?.completed_count) || 0;

  return {
    dateRange: {
      endDate,
      startDate,
    },
    insights: buildInsightCards({
      activeRecurringCount,
      completedGoals,
      monthlyRecurringTotal,
      overspentBudgets,
      summary,
      topCategories,
      topMerchants,
    }),
    metadata: {
      activeRecurringCount,
      completedGoals,
      monthlyRecurringTotal,
      overspentBudgets,
    },
    summary,
    supportingInputs,
    topCategories,
    topMerchants,
    trend,
  };
};

module.exports = {
  defaultReportRange,
  getReportsOverview,
};
