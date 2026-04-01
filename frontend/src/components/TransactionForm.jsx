export default function TransactionForm({
  categories,
  formData,
  isSubmitting,
  isEditing,
  onCancel,
  onChange,
  onSubmit,
}) {
  const availableCategories = categories.filter((category) => category.type === formData.type);

  return (
    <section className="panel panel--sticky">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{isEditing ? 'Edit transaction' : 'Add transaction'}</p>
          <h3>{isEditing ? 'Adjust a recorded movement' : 'Record money in or out'}</h3>
          <p>Choose a matching category so summaries and budgets stay accurate.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span className="field__label">Type</span>
          <select className="input-control" name="type" onChange={onChange} value={formData.type}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">Category</span>
          <select
            className="input-control"
            name="category_id"
            onChange={onChange}
            value={formData.category_id}
          >
            <option value="">Select category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="form-grid form-grid--split">
          <label className="field">
            <span className="field__label">Amount</span>
            <input
              className="input-control"
              min="0"
              name="amount"
              onChange={onChange}
              placeholder="0.00"
              step="0.01"
              type="number"
              value={formData.amount}
            />
          </label>

          <label className="field">
            <span className="field__label">Date</span>
            <input
              className="input-control"
              name="transaction_date"
              onChange={onChange}
              type="date"
              value={formData.transaction_date}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Description</span>
          <input
            className="input-control"
            name="description"
            onChange={onChange}
            placeholder="Optional note"
            type="text"
            value={formData.description}
          />
        </label>

        <div className="form-actions">
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add transaction'}
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
