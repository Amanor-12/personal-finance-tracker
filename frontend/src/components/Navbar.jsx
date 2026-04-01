import { useAuth } from '../hooks/useAuth.jsx';

function MenuIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d="M3 5H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <path d="M3 9H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <path d="M3 13H10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.2 10.2L13.3 13.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M4.2 6.6C4.2 4.5 5.9 2.8 8 2.8C10.1 2.8 11.8 4.5 11.8 6.6V8.7L13 10.2H3L4.2 8.7V6.6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <path
        d="M6.5 12.1C6.7 12.9 7.3 13.2 8 13.2C8.7 13.2 9.3 12.9 9.5 12.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export default function Navbar({ description, onMenuToggle, title }) {
  const { logout, user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="topbar__main">
        <button aria-label="Open navigation" className="icon-button topbar__menu" onClick={onMenuToggle} type="button">
          <MenuIcon />
        </button>

        <div className="topbar__copy">
          <div className="topbar__heading-row">
            <span className="topbar__pill">Hello, {firstName}</span>
            <span className="topbar__route">{dateLabel}</span>
          </div>
          <h1>{title}</h1>
          <p className="topbar__description">{description}</p>
        </div>
      </div>

      <div className="topbar__meta">
        <div className="topbar__utilities">
          <button aria-label="Search workspace" className="icon-button" type="button">
            <SearchIcon />
          </button>
          <button aria-label="View alerts" className="icon-button" type="button">
            <BellIcon />
          </button>
        </div>

        <div className="user-chip">
          <span className="user-chip__avatar">{user?.name?.slice(0, 1) || 'U'}</span>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email || 'Workspace member'}</span>
          </div>
        </div>

        <button className="button button--ghost button--compact" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}
