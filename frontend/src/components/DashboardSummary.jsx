import StatCard from './StatCard';
import { formatCurrency } from '../utils/currency';

export default function DashboardSummary({ summary }) {
  const totalBudgetLimit = summary.budgetOverview.reduce((total, budget) => total + budget.amount_limit, 0);
  const totalBudgetSpent = summary.budgetOverview.reduce((total, budget) => total + budget.spent_amount, 0);
  const maxTrendValue = Math.max(
    ...summary.monthlyTrend.flatMap((month) => [month.income, month.expenses]),
    0
  );

  return (
    <section className="hero-panel">
      <div className="hero-panel__summary">
        <div>
          <p className="eyebrow">Live overview</p>
          <h2>{summary.currentMonthLabel}</h2>
          <p className="hero-panel__copy">
            Track what came in, what went out, and how much room you still have to move.
          </p>
        </div>

        <div className="hero-balance">
          <span>Available balance</span>
          <strong>{formatCurrency(summary.balance)}</strong>
          <p>
            {formatCurrency(summary.totalIncome)} income against {formatCurrency(summary.totalExpenses)} expenses.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard subtitle="All recorded income" title="Income" tone="positive" value={formatCurrency(summary.totalIncome)} />
        <StatCard
          subtitle="All recorded expenses"
          title="Expenses"
          tone="negative"
          value={formatCurrency(summary.totalExpenses)}
        />
        <StatCard
          subtitle={summary.budgetOverview.length ? 'Current month budget usage' : 'Create budgets to track runway'}
          title="Budget runway"
          value={summary.budgetOverview.length ? formatCurrency(totalBudgetLimit - totalBudgetSpent) : 'No budgets'}
        />
      </div>

      <div className="trend-card">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Cash flow trend</p>
            <h3>Last six months</h3>
          </div>
        </div>

        <div className="trend-chart">
          {summary.monthlyTrend.map((month) => (
            <div className="trend-chart__column" key={month.month_key}>
              <div className="trend-chart__bars">
                <span
                  className="trend-chart__bar trend-chart__bar--income"
                  style={{ height: `${maxTrendValue > 0 ? (month.income / maxTrendValue) * 100 : 0}%` }}
                />
                <span
                  className="trend-chart__bar trend-chart__bar--expense"
                  style={{ height: `${maxTrendValue > 0 ? (month.expenses / maxTrendValue) * 100 : 0}%` }}
                />
              </div>
              <div className="trend-chart__label">
                <strong>{month.label}</strong>
                <span>{formatCurrency(month.income - month.expenses)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
