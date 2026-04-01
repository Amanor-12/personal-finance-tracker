import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page does not exist.</h1>
      <p>Use the navigation below to return to the financial tracker workspace.</p>
      <div className="inline-actions">
        <Link className="button button--primary" to="/dashboard">
          Go to dashboard
        </Link>
        <Link className="button button--ghost" to="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
