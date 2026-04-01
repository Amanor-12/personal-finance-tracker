import { formatCurrency } from '../utils/currency';

const CHART_HEIGHT = 220;
const CHART_PADDING = 18;
const CHART_WIDTH = 560;

const buildPath = (points) => {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
};

const buildPoints = (data, key, maxValue) => {
  const plotHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const plotWidth = CHART_WIDTH - CHART_PADDING * 2;

  return data.map((month, index) => ({
    x: CHART_PADDING + (index * plotWidth) / Math.max(data.length - 1, 1),
    y: CHART_HEIGHT - CHART_PADDING - (month[key] / Math.max(maxValue, 1)) * plotHeight,
  }));
};

export default function DashboardSummary({ summary }) {
  const totalBudgetLimit = summary.budgetOverview.reduce((total, budget) => total + budget.amount_limit, 0);
  const totalBudgetSpent = summary.budgetOverview.reduce((total, budget) => total + budget.spent_amount, 0);
  const maxTrendValue = Math.max(
    ...summary.monthlyTrend.flatMap((month) => [month.income, month.expenses]),
    1
  );
  const incomePoints = buildPoints(summary.monthlyTrend, 'income', maxTrendValue);
  const expensePoints = buildPoints(summary.monthlyTrend, 'expenses', maxTrendValue);
  const lastMonth = summary.monthlyTrend[summary.monthlyTrend.length - 1] || {
    expenses: 0,
    income: 0,
  };
  const topIncomeCategory = summary.categoryBreakdown.income[0];
  const topExpenseCategory = summary.categoryBreakdown.expense[0];
  const budgetRunway = totalBudgetLimit > 0 ? totalBudgetLimit - totalBudgetSpent : 0;
  const budgetUsage = totalBudgetLimit > 0 ? Math.min(totalBudgetSpent / totalBudgetLimit, 1) : 0;
  const monthlyNet = lastMonth.income - lastMonth.expenses;

  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero__main">
        <div className="dashboard-hero__header">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Operating overview</h2>
            <p className="dashboard-hero__copy">
              Real income, expenses, and budget pressure pulled from your live financial records.
            </p>
          </div>
          <span className="pill pill--neutral">Last 6 months</span>
        </div>

        <div className="dashboard-hero__headline">
          <div>
            <span className="dashboard-hero__label">Available balance</span>
            <strong className="dashboard-hero__balance">{formatCurrency(summary.balance)}</strong>
            <p className="dashboard-hero__subcopy">
              {formatCurrency(summary.totalIncome)} recorded income and {formatCurrency(summary.totalExpenses)} in
              expenses.
            </p>
          </div>

          <div className="dashboard-strip">
            <div className="dashboard-strip__item">
              <span>Recorded income</span>
              <strong>{formatCurrency(summary.totalIncome)}</strong>
            </div>
            <div className="dashboard-strip__item">
              <span>Recorded expenses</span>
              <strong>{formatCurrency(summary.totalExpenses)}</strong>
            </div>
            <div className="dashboard-strip__item">
              <span>Latest month delta</span>
              <strong>{formatCurrency(monthlyNet)}</strong>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <div>
              <p className="eyebrow">Cash flow trend</p>
              <h3>Income and expense movement</h3>
            </div>
            <div className="chart-card__legend">
              <span>
                <i className="chart-card__legend-dot chart-card__legend-dot--income" />
                Income
              </span>
              <span>
                <i className="chart-card__legend-dot chart-card__legend-dot--expense" />
                Expense
              </span>
            </div>
          </div>

          <svg className="chart-card__svg" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
            {[0.2, 0.4, 0.6, 0.8].map((position) => {
              const y = CHART_HEIGHT - CHART_PADDING - (CHART_HEIGHT - CHART_PADDING * 2) * position;

              return (
                <line
                  key={position}
                  className="chart-card__grid-line"
                  x1={CHART_PADDING}
                  x2={CHART_WIDTH - CHART_PADDING}
                  y1={y}
                  y2={y}
                />
              );
            })}

            <path className="chart-card__path chart-card__path--income" d={buildPath(incomePoints)} />
            <path className="chart-card__path chart-card__path--expense" d={buildPath(expensePoints)} />

            {incomePoints.map((point, index) => (
              <circle
                className="chart-card__dot chart-card__dot--income"
                cx={point.x}
                cy={point.y}
                key={`income-${summary.monthlyTrend[index].month_key}`}
                r="3.5"
              />
            ))}

            {expensePoints.map((point, index) => (
              <circle
                className="chart-card__dot chart-card__dot--expense"
                cx={point.x}
                cy={point.y}
                key={`expense-${summary.monthlyTrend[index].month_key}`}
                r="3.5"
              />
            ))}
          </svg>

          <div className="chart-card__labels">
            {summary.monthlyTrend.map((month) => (
              <span key={month.month_key}>{month.label}</span>
            ))}
          </div>
        </div>
      </div>

      <aside className="dashboard-hero__aside">
        <article className="finance-card">
          <div className="finance-card__header">
            <span>Primary reserve</span>
            <span>{summary.currentMonthLabel}</span>
          </div>
          <strong className="finance-card__balance">{formatCurrency(summary.balance)}</strong>
          <p className="finance-card__caption">FlowLedger operating balance</p>
          <div className="finance-card__number">LIVE FINANCE TRACKER</div>
          <div className="finance-card__meta">
            <div>
              <span>Top income</span>
              <strong>{topIncomeCategory?.name || 'Awaiting income data'}</strong>
            </div>
            <div>
              <span>Largest spend</span>
              <strong>{topExpenseCategory?.name || 'No expenses yet'}</strong>
            </div>
          </div>
        </article>

        <article className="insight-card insight-card--accent">
          <div>
            <p className="eyebrow">Budget runway</p>
            <h3>{summary.budgetOverview.length ? formatCurrency(budgetRunway) : 'Create budgets to unlock runway'}</h3>
            <p>
              {summary.budgetOverview.length
                ? `${Math.round(budgetUsage * 100)}% of current monthly limits are already used.`
                : 'Monthly budget targets will appear here as soon as you create them.'}
            </p>
          </div>

          <div className="progress-track progress-track--contrast">
            <div className="progress-track__fill" style={{ width: `${budgetUsage * 100}%` }} />
          </div>
        </article>

        <div className="mini-metrics">
          <article className="mini-metric">
            <span className="mini-metric__label">Active budgets</span>
            <strong>{summary.budgetOverview.length}</strong>
            <p>{summary.budgetOverview.length ? 'Monthly controls running' : 'No budget controls yet'}</p>
          </article>
          <article className="mini-metric">
            <span className="mini-metric__label">Top income source</span>
            <strong>{topIncomeCategory ? formatCurrency(topIncomeCategory.total_amount) : '$0.00'}</strong>
            <p>{topIncomeCategory?.name || 'Add income transactions to populate this card'}</p>
          </article>
        </div>
      </aside>
    </section>
  );
}
