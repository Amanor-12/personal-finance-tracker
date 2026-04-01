export default function EmptyState({ action, description, title }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">FL</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
