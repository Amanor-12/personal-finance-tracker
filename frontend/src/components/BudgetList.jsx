import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/currency';
import { formatMonthLabel } from '../utils/date';

export default function BudgetList({ budgets, onDelete, onEdit }) {
  if (budgets.length === 0) {
    return (
      <EmptyState
        description="Create monthly category limits to keep spending pressure visible at a glance."
        title="No budgets yet"
      />
    );
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Configured budgets</p>
          <h3>Monthly limits</h3>
        </div>
        <div className="panel__meta">{budgets.length} budgets</div>
      </div>

      <div className="stack-md">
        {budgets.map((budget) => {
          const progressWidth = `${Math.min(budget.utilization * 100, 100)}%`;
          const progressClassName =
            budget.utilization >= 1 ? 'progress-track__fill progress-track__fill--danger' : 'progress-track__fill';

          return (
            <article className="list-card" key={budget.id}>
              <div className="list-card__header">
                <div>
                  <p className="list-card__title">{budget.category_name}</p>
                  <p className="list-card__subtitle">{formatMonthLabel(budget.month, budget.year)}</p>
                </div>

                <div className="list-card__actions">
                  <span className={`pill pill--status ${budget.utilization >= 1 ? 'pill--danger' : ''}`}>
                    {budget.status}
                  </span>
                  <button className="button button--ghost" onClick={() => onEdit(budget)} type="button">
                    Edit
                  </button>
                  <button className="button button--ghost-danger" onClick={() => onDelete(budget)} type="button">
                    Delete
                  </button>
                </div>
              </div>

              <div className="budget-metrics">
                <div>
                  <span>Limit</span>
                  <strong>{formatCurrency(budget.amount_limit)}</strong>
                </div>
                <div>
                  <span>Spent</span>
                  <strong>{formatCurrency(budget.spent_amount)}</strong>
                </div>
                <div>
                  <span>Remaining</span>
                  <strong>{formatCurrency(budget.remaining_amount)}</strong>
                </div>
              </div>

              <div className="progress-track">
                <div className={progressClassName} style={{ width: progressWidth }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
