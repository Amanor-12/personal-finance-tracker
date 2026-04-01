export default function ConfirmDialog({
  confirmLabel = 'Confirm',
  description,
  isLoading,
  onCancel,
  onConfirm,
  open,
  title,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <div aria-modal="true" className="dialog" role="dialog">
        <div className="dialog__content">
          <p className="eyebrow">Confirm action</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <div className="dialog__actions">
          <button className="button button--ghost" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button button--danger" disabled={isLoading} onClick={onConfirm} type="button">
            {isLoading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
