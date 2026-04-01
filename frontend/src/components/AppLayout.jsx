import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

const pageMeta = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Monitor balances, cash flow, category concentration, and monthly budget pressure.',
  },
  '/transactions': {
    title: 'Transactions',
    description: 'Capture money movement quickly and keep dashboard totals current without refreshing.',
  },
  '/categories': {
    title: 'Category system',
    description: 'Keep income and expense labels clean so reporting and transaction entry stay intuitive.',
  },
  '/budgets': {
    title: 'Budget control',
    description: 'Set category limits, monitor utilization, and spot overspend before it compounds.',
  },
};

export default function AppLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const meta = pageMeta[location.pathname] || pageMeta['/dashboard'];

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="app-shell__frame">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div
          aria-hidden={!isSidebarOpen}
          className={`app-shell__overlay ${isSidebarOpen ? 'app-shell__overlay--visible' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="app-shell__content">
          <Navbar
            description={meta.description}
            onMenuToggle={() => setIsSidebarOpen((currentValue) => !currentValue)}
            title={meta.title}
          />

          <main className="page-shell">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
