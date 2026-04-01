export default function CategoryForm({ formData, isEditing, isSubmitting, onCancel, onChange, onSubmit }) {
  return (
    <section className="panel panel--sticky">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{isEditing ? 'Edit category' : 'New category'}</p>
          <h3>{isEditing ? 'Refine your category naming' : 'Create a category'}</h3>
          <p>Keep income and expense labels tidy so reporting remains clean.</p>
        </div>
      </div>

      <div className="form-note">
        <span>Structure tip</span>
        <strong className="form-note__value">Separate income and expense labels</strong>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span className="field__label">Category name</span>
          <input
            className="input-control"
            name="name"
            onChange={onChange}
            placeholder="e.g. Dining out"
            type="text"
            value={formData.name}
          />
        </label>

        <label className="field">
          <span className="field__label">Category type</span>
          <select className="input-control" name="type" onChange={onChange} value={formData.type}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <div className="form-actions">
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add category'}
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
