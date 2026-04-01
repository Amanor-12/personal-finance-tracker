export default function PageHeader({ action, description, eyebrow, title }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>

      {action ? <div className="page-header__action">{action}</div> : null}
    </div>
  );
}
