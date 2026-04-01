import { Link } from 'react-router-dom';

export default function AuthShell({
  children,
  description,
  footerLabel,
  footerLink,
  footerPrompt,
  title,
}) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__panel auth-shell__panel--brand">
        <div className="brand-mark">
          <span className="brand-mark__glyph">FL</span>
          <div>
            <p className="brand-mark__eyebrow">FlowLedger</p>
            <h1 className="brand-mark__title">Finance tracking built to present like a SaaS product.</h1>
          </div>
        </div>

        <p className="auth-shell__copy">
          A polished full-stack workspace for budgets, categories, cash flow, and live aggregated
          reporting.
        </p>

        <div className="auth-shell__metrics">
          <div className="metric-chip">
            <span>Secure JWT auth</span>
            <strong>Protected</strong>
          </div>
          <div className="metric-chip">
            <span>Starter setup</span>
            <strong>Ready in minutes</strong>
          </div>
          <div className="metric-chip">
            <span>Dashboard</span>
            <strong>Real SQL summaries</strong>
          </div>
        </div>
      </div>

      <div className="auth-shell__panel auth-shell__panel--form">
        <div className="auth-card">
          <div className="auth-card__header">
            <p className="eyebrow">Welcome</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          {children}

          <p className="auth-card__footer">
            {footerPrompt} <Link to={footerLink}>{footerLabel}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
