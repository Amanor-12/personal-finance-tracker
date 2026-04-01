import { NavLink } from 'react-router-dom';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Categories', path: '/categories' },
  { label: 'Budgets', path: '/budgets' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__inner">
        <div className="sidebar__brand">
          <div className="sidebar__logo">FL</div>
          <div>
            <p>FlowLedger</p>
            <span>Financial Tracker</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              key={item.path}
              onClick={onClose}
              to={item.path}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <p className="eyebrow">Built for demo day</p>
          <strong>Secure, clean, and presentation-ready.</strong>
        </div>
      </div>
    </aside>
  );
}
