import { useEffect, useState } from 'react';

import AlertMessage from '../components/AlertMessage';
import DashboardBreakdown from '../components/DashboardBreakdown';
import DashboardSummary from '../components/DashboardSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
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
        <PageHeader
          eyebrow="Overview"
          description="A live summary of your current financial position."
          title="Dashboard"
        />
        <AlertMessage message={errorMessage} title="Dashboard unavailable" variant="error" />
      </div>
    );
  }

  return (
    <div className="stack-xl">
      <PageHeader
        eyebrow="Overview"
        description="A premium snapshot of your financial position, powered by live PostgreSQL aggregates."
        title="Dashboard"
      />

      {errorMessage ? <AlertMessage message={errorMessage} title="Some data could not be refreshed" variant="error" /> : null}

      <DashboardSummary summary={summary} />
      <DashboardBreakdown summary={summary} />
    </div>
  );
}
