export default function AlertMessage({ message, onDismiss, title, variant = 'info' }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`alert alert--${variant}`} role="status">
      <div>
        {title ? <p className="alert__title">{title}</p> : null}
        <p className="alert__message">{message}</p>
      </div>
      {onDismiss ? (
        <button className="alert__dismiss" onClick={onDismiss} type="button">
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
