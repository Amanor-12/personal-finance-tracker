import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

const pageMeta = {
  '/dashboard': {
    title: 'Financial command center',
    description: 'Monitor live cash flow, current budgets, and where your money is moving.',
  },
  '/transactions': {
    title: 'Transactions',
    description: 'Capture income and expenses quickly with clear, reliable records.',
  },
  '/categories': {
    title: 'Categories',
    description: 'Organize every money movement with a clean income and expense taxonomy.',
  },
  '/budgets': {
    title: 'Budgets',
    description: 'Set monthly guardrails and track how close each category is to its limit.',
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
  );
}
