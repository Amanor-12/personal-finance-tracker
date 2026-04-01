import EmptyState from './EmptyState';

function CategoryGroup({ categories, groupLabel, onDelete, onEdit }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{groupLabel}</p>
          <h3>{groupLabel === 'Income' ? 'Revenue categories' : 'Spending categories'}</h3>
        </div>
        <div className="panel__meta">{categories.length} labels</div>
      </div>

      <div className="stack-md">
        {categories.map((category) => (
          <article className="list-card list-card--compact" key={category.id}>
            <div className="list-card__header">
              <div>
                <p className="list-card__title">{category.name}</p>
                <p className="list-card__subtitle">
                  {category.transaction_count} transactions | {category.budget_count} budgets
                </p>
              </div>

              <div className="list-card__actions">
                <button className="button button--ghost" onClick={() => onEdit(category)} type="button">
                  Edit
                </button>
                <button className="button button--ghost-danger" onClick={() => onDelete(category)} type="button">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CategoryList({ categories, onDelete, onEdit }) {
  if (categories.length === 0) {
    return (
      <EmptyState
        description="Build a clean category system to power clearer transaction entry and reporting."
        title="No categories yet"
      />
    );
  }

  const incomeCategories = categories.filter((category) => category.type === 'income');
  const expenseCategories = categories.filter((category) => category.type === 'expense');

  return (
    <div className="stack-lg">
      <CategoryGroup categories={incomeCategories} groupLabel="Income" onDelete={onDelete} onEdit={onEdit} />
      <CategoryGroup categories={expenseCategories} groupLabel="Expense" onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}
