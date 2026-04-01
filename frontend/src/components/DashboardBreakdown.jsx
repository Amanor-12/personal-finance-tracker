import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/currency';
import { formatDisplayDate } from '../utils/date';

const MIX_COLORS = ['#1b8a6b', '#4ba987', '#89ccb3', '#cfe9de'];

const buildMixGradient = (items, totalAmount) => {
  if (!items.length || totalAmount <= 0) {
    return 'conic-gradient(#d9e3dc 0deg 360deg)';
  }

  let currentAngle = 0;
  const stops = items.map((item, index) => {
    const nextAngle = currentAngle + (item.total_amount / totalAmount) * 360;
    const stop = `${MIX_COLORS[index % MIX_COLORS.length]} ${currentAngle}deg ${nextAngle}deg`;
    currentAngle = nextAngle;
    return stop;
  });

  if (currentAngle < 360) {
    stops.push(`#edf2ee ${currentAngle}deg 360deg`);
  }

  return `conic-gradient(${stops.join(', ')})`;
};

export default function DashboardBreakdown({ summary }) {
  const mixItems = summary.categoryBreakdown.income.length
    ? summary.categoryBreakdown.income
    : summary.categoryBreakdown.expense;
  const mixLabel = summary.categoryBreakdown.income.length ? 'Income mix' : 'Expense mix';
  const mixTotal = mixItems.reduce((total, item) => total + item.total_amount, 0);
  const mixGradient = buildMixGradient(mixItems, mixTotal);
  const topExpense = summary.categoryBreakdown.expense[0];
  const budgetFocus =
    summary.budgetOverview.find((budget) => budget.utilization >= 1) || summary.budgetOverview[0] || null;

  const insightTitle = budgetFocus
    ? `${budgetFocus.category_name} needs a closer look`
    : topExpense
      ? `${topExpense.name} is your largest expense bucket`
      : 'Start recording activity';

  const insightMessage = budgetFocus
    ? `${Math.round(budgetFocus.utilization * 100)}% of this month's limit is already used.`
    : topExpense
      ? `${formatCurrency(topExpense.total_amount)} has been spent in this category so far.`
      : 'Add a few transactions to unlock live budget and category insights.';

  return (
    <div className="dashboard-breakdown">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Category mix</p>
            <h3>{mixLabel} by category</h3>
          </div>
        </div>

        {mixItems.length === 0 ? (
          <EmptyState
            description="Add transactions to reveal how money is distributed across your categories."
            title="No category mix yet"
          />
        ) : (
          <div className="mix-layout">
            <div className="mix-ring" style={{ background: mixGradient }}>
              <div className="mix-ring__center">
                <strong>{formatCurrency(mixTotal)}</strong>
                <span>{mixLabel}</span>
              </div>
            </div>

            <div className="mix-legend">
              {mixItems.slice(0, 4).map((item, index) => (
                <div className="mix-legend__item" key={item.category_id}>
                  <div className="mix-legend__name">
                    <i className="mix-legend__dot" style={{ backgroundColor: MIX_COLORS[index % MIX_COLORS.length] }} />
                    <span>{item.name}</span>
                  </div>
                  <strong>{formatCurrency(item.total_amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Current month budgets</p>
            <h3>Budget pressure</h3>
          </div>
        </div>

        {summary.budgetOverview.length === 0 ? (
          <EmptyState
            description="Create a budget to compare this month's spending with a category limit."
            title="No budgets for this month"
          />
        ) : (
          <div className="budget-stack">
            {summary.budgetOverview.map((budget) => (
              <article className="budget-row" key={budget.id}>
                <div className="budget-row__meta">
                  <div>
                    <p className="list-card__title">{budget.category_name}</p>
                    <p className="list-card__subtitle">
                      Spent {formatCurrency(budget.spent_amount)} of {formatCurrency(budget.amount_limit)}
                    </p>
                  </div>
                  <strong className="budget-row__amount">{Math.round(budget.utilization * 100)}%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-track__fill ${budget.utilization >= 1 ? 'progress-track__fill--danger' : ''}`}
                    style={{ width: `${Math.min(budget.utilization * 100, 100)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h3>Recent money movement</h3>
          </div>
        </div>

        {summary.recentTransactions.length === 0 ? (
          <EmptyState
            description="Recent transactions will appear here once you start recording activity."
            title="No transaction history yet"
          />
        ) : (
          <div className="stack-md">
            <div className="activity-feed">
              {summary.recentTransactions.map((transaction) => (
                <article className="activity-row" key={transaction.id}>
                  <div className="activity-row__meta">
                    <span className={`pill ${transaction.type === 'income' ? 'pill--success' : 'pill--neutral'}`}>
                      {transaction.type}
                    </span>
                    <div>
                      <p>{transaction.description || transaction.category_name}</p>
                      <span>
                        {transaction.category_name} | {formatDisplayDate(transaction.transaction_date)}
                      </span>
                    </div>
                  </div>

                  <strong className={transaction.type === 'income' ? 'amount amount--positive' : 'amount amount--negative'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </strong>
                </article>
              ))}
            </div>

            <article className="signal-card">
              <p className="eyebrow">Operator note</p>
              <h4>{insightTitle}</h4>
              <p>{insightMessage}</p>
              <span className="signal-card__footer">Updated from live dashboard data</span>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
