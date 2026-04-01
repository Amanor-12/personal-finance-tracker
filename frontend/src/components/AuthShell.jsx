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
            <h1 className="brand-mark__title">A premium finance workspace for budgets, cash flow, and demo day.</h1>
          </div>
        </div>

        <p className="auth-shell__copy">
          Secure sign-in, polished layout, and real PostgreSQL aggregation wrapped in a product-quality
          interface that feels ready for review.
        </p>

        <div className="auth-preview">
          <div className="auth-preview__chart">
            <div className="auth-preview__header">
              <span>Workspace pulse</span>
              <strong>Income vs expense</strong>
            </div>
            <div className="auth-preview__bars">
              <span style={{ height: '42%' }} />
              <span style={{ height: '64%' }} />
              <span style={{ height: '58%' }} />
              <span style={{ height: '78%' }} />
              <span style={{ height: '70%' }} />
              <span style={{ height: '86%' }} />
            </div>
            <div className="auth-preview__footer">
              <span>Live dashboard summaries</span>
              <strong>Ready after sign-in</strong>
            </div>
          </div>

          <div className="auth-preview__card">
            <p className="eyebrow">Primary reserve</p>
            <strong>$42,980.00</strong>
            <span>Sample fintech card styling for presentation-ready polish.</span>
          </div>
        </div>

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
            <p className="eyebrow">Secure access</p>
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
