import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage, AuthenticationGuard } from './components/auth';
import { MainLayout } from './components/layout';
import { EnhancedDashboard } from './components/dashboard/EnhancedDashboard';
import { UserManagement } from './components/users/UserManagement';
import { CaseManagement } from './components/cases/CaseManagement';
import { ECaseTracker } from './components/cases/ECaseTracker';
import { FinancialRecords } from './components/financials/FinancialRecords';
import { FinancialAnalytics } from './components/financials/FinancialAnalytics';
import { SharedReports } from './components/reports/SharedReports';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

const PageRouter: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard':
      return <EnhancedDashboard />;
    case 'users':
      return <UserManagement />;
    case 'cases':
      return <CaseManagement />;
    case 'my-cases':
      return <ECaseTracker />;
    case 'financials':
      return <FinancialRecords />;
    case 'analytics':
      return <FinancialAnalytics />;
    case 'reports':
    case 'resources':
      return <SharedReports />;
    default:
      return <EnhancedDashboard />;
  }
};

const App: React.FC = () => {
  const { authState } = useApp();

  if (!authState.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AuthenticationGuard>
      <MainLayout>
        <ErrorBoundary>
          <PageRouter />
        </ErrorBoundary>
      </MainLayout>
    </AuthenticationGuard>
  );
};

export default App;
