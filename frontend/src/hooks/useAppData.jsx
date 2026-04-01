import { createContext, useContext, useState } from 'react';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const refreshDashboard = () => {
    setDashboardRefreshKey((currentValue) => currentValue + 1);
  };

  return (
    <AppDataContext.Provider
      value={{
        dashboardRefreshKey,
        refreshDashboard,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider.');
  }

  return context;
}
