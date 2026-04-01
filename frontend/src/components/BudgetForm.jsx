import { monthOptions } from '../utils/months';

export default function BudgetForm({
  categories,
  formData,
  isSubmitting,
  isEditing,
  onCancel,
  onChange,
  onSubmit,
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, index) => currentYear - 1 + index);

  return (
    <section className="panel panel--sticky">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{isEditing ? 'Edit budget' : 'New budget'}</p>
          <h3>{isEditing ? 'Refine this monthly guardrail' : 'Create a monthly budget target'}</h3>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span className="field__label">Expense category</span>
          <select
            className="input-control"
            name="category_id"
            onChange={onChange}
            value={formData.category_id}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Monthly limit</span>
          <input
            className="input-control"
            min="0"
            name="amount_limit"
            onChange={onChange}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={formData.amount_limit}
          />
        </label>

        <div className="form-grid form-grid--split">
          <label className="field">
            <span className="field__label">Month</span>
            <select className="input-control" name="month" onChange={onChange} value={formData.month}>
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Year</span>
            <select className="input-control" name="year" onChange={onChange} value={formData.year}>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add budget'}
          </button>
          {isEditing ? (
            <button className="button button--ghost" onClick={onCancel} type="button">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
