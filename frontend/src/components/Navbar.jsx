import { useAuth } from '../hooks/useAuth';

export default function Navbar({ description, onMenuToggle, title }) {
  const { logout, user } = useAuth();
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="topbar__main">
        <button aria-label="Open navigation" className="icon-button topbar__menu" onClick={onMenuToggle} type="button">
          Menu
        </button>

        <div>
          <p className="eyebrow">{dateLabel}</p>
          <h1>{title}</h1>
          <p className="topbar__description">{description}</p>
        </div>
      </div>

      <div className="topbar__meta">
        <div className="user-chip">
          <span className="user-chip__avatar">{user?.name?.slice(0, 1) || 'U'}</span>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <button className="button button--ghost" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}
