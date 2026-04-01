import { NavLink } from 'react-router-dom';

function DashboardIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3" width="5" x="2" y="2" />
      <rect height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3" width="5" x="9" y="2" />
      <rect height="4" rx="1.2" stroke="currentColor" strokeWidth="1.3" width="5" x="2" y="10" />
      <rect height="2" rx="1" stroke="currentColor" strokeWidth="1.3" width="5" x="9" y="12" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M2 10.5H4.5L6.2 6L8.8 11.2L10.5 8.5H14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <path d="M2 3H14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      <path d="M2 13H14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M3 3.5H13V12.5H3V3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <path
        d="M5.5 9.5L7 8L8.4 9.2L10.7 6.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M3 4.5H7.5V9H3V4.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <path d="M8.5 4.5H13V9H8.5V4.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <path d="M3 10H7.5V12.5H3V10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <path d="M8.5 10H13V12.5H8.5V10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

const navigationGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
      { label: 'Transactions', path: '/transactions', icon: ActivityIcon },
      { label: 'Budgets', path: '/budgets', icon: BudgetIcon },
    ],
  },
  {
    label: 'Setup',
    items: [{ label: 'Categories', path: '/categories', icon: CategoryIcon }],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__inner">
        <div className="sidebar__brand">
          <div className="sidebar__logo">FL</div>
          <div>
            <p>FlowLedger</p>
            <span>Finance operations</span>
          </div>
        </div>

        {navigationGroups.map((group) => (
          <div className="sidebar__section" key={group.label}>
            <p className="sidebar__section-label">{group.label}</p>
            <nav className="sidebar__nav">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                    key={item.path}
                    onClick={onClose}
                    to={item.path}
                  >
                    <span className="sidebar__link-icon">
                      <Icon />
                    </span>
                    <span className="sidebar__link-copy">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="sidebar__support support-card">
          <p className="eyebrow">Need support?</p>
          <strong>Demo-ready guidance lives here.</strong>
          <p>JWT auth, live SQL summaries, and polished flows in one clean workspace.</p>
          <span className="pill pill--success">Secure and synced</span>
        </div>
      </div>
    </aside>
  );
}
