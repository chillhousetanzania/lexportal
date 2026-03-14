import React from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../ui';
import { Shield } from 'lucide-react';

export const AccessDenied: React.FC<{ module?: string }> = ({ module }) => {
  const { setCurrentPage } = useApp();

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-6">
          You do not have permission to access {module ? `the ${module} module` : 'this resource'}.
          Your role does not allow this action.
        </p>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-6 py-3 bg-navy text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

// --- Page Header ---
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, className }) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="text-xl font-black text-navy uppercase tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 font-medium uppercase mt-1 tracking-wider">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
};

// --- Empty State ---
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};
