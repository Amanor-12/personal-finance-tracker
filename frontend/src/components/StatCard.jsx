export default function StatCard({ subtitle, title, tone = 'neutral', value }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__label">{title}</span>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__subtitle">{subtitle}</p>
    </article>
  );
}
