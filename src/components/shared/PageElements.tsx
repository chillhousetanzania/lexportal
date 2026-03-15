import React from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../ui';
import { Shield, ArrowLeft } from 'lucide-react';

export const AccessDenied: React.FC<{ module?: string }> = ({ module }) => {
  const { setCurrentPage } = useApp();

  return (
    <div className="flex items-center justify-center h-full p-8 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-premium">
          <Shield className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          You do not have permission to access {module ? `the ${module} module` : 'this resource'}.
          Your current role does not allow this action.
        </p>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 gradient-gold text-navy-dark rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-gold hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-[0.97]"
        >
          <ArrowLeft className="w-4 h-4" />
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
  icon?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, className, icon }) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8', className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="h-12 w-12 gradient-navy rounded-2xl flex items-center justify-center shadow-navy shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400 font-medium mt-1 tracking-wide">{subtitle}</p>}
        </div>
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
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {icon && (
        <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 shadow-premium">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};
