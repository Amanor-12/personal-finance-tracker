import { useEffect, useState } from 'react';

import AlertMessage from '../components/AlertMessage';
import DashboardBreakdown from '../components/DashboardBreakdown';
import DashboardSummary from '../components/DashboardSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppData } from '../hooks/useAppData.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import dashboardService from '../services/dashboardService';
import { extractErrorMessage } from '../utils/validation';

export default function DashboardPage() {
  const { dashboardRefreshKey } = useAppData();
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);

      try {
        const response = await dashboardService.getSummary(token);
        setSummary(response);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [dashboardRefreshKey, token]);

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (!summary) {
    return (
      <div className="stack-xl">
        <AlertMessage message={errorMessage} title="Dashboard unavailable" variant="error" />
      </div>
    );
  }

  return (
    <div className="stack-xl">
      {errorMessage ? (
        <AlertMessage
          message={errorMessage}
          title="Some dashboard data could not be refreshed"
          variant="error"
        />
      ) : null}

      <DashboardSummary summary={summary} />
      <DashboardBreakdown summary={summary} />
    </div>
  );
}
