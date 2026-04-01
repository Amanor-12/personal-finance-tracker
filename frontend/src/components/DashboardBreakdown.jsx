import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/currency';
import { formatDisplayDate } from '../utils/date';

export default function DashboardBreakdown({ summary }) {
  const maxExpense = Math.max(...summary.categoryBreakdown.expense.map((item) => item.total_amount), 0);

  return (
    <div className="dashboard-breakdown">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Spending breakdown</p>
            <h3>Where expenses are concentrated</h3>
          </div>
        </div>

        {summary.categoryBreakdown.expense.length === 0 ? (
          <EmptyState
            description="Add a few expense transactions to unlock your top spending categories."
            title="No expense activity yet"
          />
        ) : (
          <div className="stack-md">
            {summary.categoryBreakdown.expense.map((item) => (
              <div className="breakdown-row" key={item.category_id}>
                <div className="breakdown-row__header">
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.total_amount)}</strong>
                </div>
                <div className="progress-track progress-track--subtle">
                  <div
                    className="progress-track__fill"
                    style={{
                      width: `${maxExpense > 0 ? (item.total_amount / maxExpense) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Current month budgets</p>
            <h3>Budget pressure, live</h3>
          </div>
        </div>

        {summary.budgetOverview.length === 0 ? (
          <EmptyState
            description="Create a budget to compare this month’s spending with a category limit."
            title="No budgets for this month"
          />
        ) : (
          <div className="stack-md">
            {summary.budgetOverview.map((budget) => (
              <article className="list-card list-card--compact" key={budget.id}>
                <div className="list-card__header">
                  <div>
                    <p className="list-card__title">{budget.category_name}</p>
                    <p className="list-card__subtitle">
                      Spent {formatCurrency(budget.spent_amount)} of {formatCurrency(budget.amount_limit)}
                    </p>
                  </div>
                  <strong>{Math.round(budget.utilization * 100)}%</strong>
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
            {summary.recentTransactions.map((transaction) => (
              <article className="activity-row" key={transaction.id}>
                <div className="activity-row__meta">
                  <span className={`pill ${transaction.type === 'income' ? 'pill--success' : 'pill--neutral'}`}>
                    {transaction.type}
                  </span>
                  <div>
                    <p>{transaction.description || transaction.category_name}</p>
                    <span>
                      {transaction.category_name} • {formatDisplayDate(transaction.transaction_date)}
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
        )}
      </section>
    </div>
  );
}
