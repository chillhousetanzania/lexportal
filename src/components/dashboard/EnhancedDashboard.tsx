import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../ui';
import { DataGrid } from '../ui/DataGrid';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterCasesByRole } from '../../utils/rbac';
import { cn } from '../ui';
import { EditCaseModal } from '../cases/EditCaseModal';
import {
  Users, Briefcase, FileText, TrendingUp, Plus,
  Clock, Activity, ArrowRight, Banknote, TrendingDown, BarChart3, Sparkles, Edit2
} from 'lucide-react';
import type { UserRole, CaseStatus, CaseRecord } from '../../types';

// Status pill component
const StatusPill: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const variants: Record<CaseStatus, string> = {
    filed: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    closed: 'bg-slate-50 text-slate-600 border border-slate-200/60',
    archived: 'bg-red-50 text-red-700 border border-red-200/60',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold',
      variants[status]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'filed' && 'bg-blue-500',
        status === 'active' && 'bg-emerald-500',
        status === 'pending' && 'bg-amber-500',
        status === 'closed' && 'bg-slate-400',
        status === 'archived' && 'bg-red-500',
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Skeleton loading component
const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-3 bg-slate-100 rounded-lg w-1/2"></div>
    <div className="h-8 bg-slate-100 rounded-lg w-3/4"></div>
    <div className="h-3 bg-slate-100 rounded-lg w-1/3"></div>
  </div>
);

// Stats Card component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}> = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, onClick }) => (
  <Card
    className={cn(
      'p-6 cursor-pointer group animate-slide-up',
      onClick && 'hover:translate-y-[-2px]'
    )}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-navy mt-2 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1.5 font-medium">{subtitle}</p>
        )}
      </div>
      <div className={cn('p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg', iconBg)}>
        <Icon className={cn('w-6 h-6', iconColor)} />
      </div>
    </div>
  </Card>
);

// Welcome Banner
const WelcomeBanner: React.FC<{ name: string; role: string }> = ({ name, role }) => (
  <div className="gradient-navy rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden animate-slide-up">
    <div className="absolute inset-0 bg-grid-pattern opacity-30" />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Welcome back</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{name}</h2>
        <p className="text-slate-400 text-sm mt-1 capitalize">{role} — LexPortal Legal Management</p>
      </div>
      <div className="hidden sm:block">
        <div className="text-right">
          <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  </div>
);

// ===== Admin Dashboard =====
const EnhancedAdminDashboard: React.FC = () => {
  const { users, cases, setCases, financialRecords, sharedResources, setCurrentPage, authState, setSelectedCase, addNotification } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [editingCase, setEditingCase] = useState<CaseRecord | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const revenue = financialRecords.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
    const expenses = financialRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalCases: cases.length,
      activeCases: cases.filter(c => c.status === 'active').length,
      revenue,
      expenses,
      netIncome: revenue - expenses,
      reports: sharedResources.length,
    };
  }, [users, cases, financialRecords, sharedResources]);

  const caseColumns = [
    {
      key: 'caseNumber',
      title: 'Case Number',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-xs font-bold text-gold">{value}</span>
      ),
    },
    {
      key: 'title',
      title: 'Case Title',
      sortable: true,
      render: (value: string, row: CaseRecord) => (
        <div>
          <span className="font-semibold text-sm text-navy block">{value}</span>
          <span className="text-slate-400 text-[10px] truncate max-w-[200px] mt-0.5 block">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: CaseStatus) => <StatusPill status={value} />,
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      render: (value: Date) => (
        <span className="text-xs text-slate-400 font-medium">{value.toLocaleDateString()}</span>
      ),
    },
  ];

  const handleEditSave = (updatedCase: CaseRecord) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? {
      ...updatedCase,
      lastUpdated: new Date(),
      updates: [
        ...c.updates,
        {
          id: 'up' + Date.now(),
          timestamp: new Date(),
          author: authState.user!.name,
          content: 'Case details updated.',
        }
      ]
    } : c));
    setEditingCase(null);
    addNotification('success', 'Case details updated successfully.');
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-32 bg-slate-100 rounded-3xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <SkeletonLoader />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <WelcomeBanner name={authState.user?.name || ''} role={authState.user?.role || ''} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active`}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          onClick={() => setCurrentPage('users')}
        />
        <StatsCard
          title="Cases"
          value={stats.totalCases}
          subtitle={`${stats.activeCases} active`}
          icon={Briefcase}
          iconBg="bg-gold/10"
          iconColor="text-gold"
          onClick={() => setCurrentPage('cases')}
        />
        <StatsCard
          title="Revenue"
          value={`TZS ${stats.revenue.toLocaleString()}`}
          subtitle={`Net: TZS ${stats.netIncome.toLocaleString()}`}
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          onClick={() => setCurrentPage('financials')}
        />
        <StatsCard
          title="Reports"
          value={stats.reports}
          subtitle="Shared resources"
          icon={FileText}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          onClick={() => setCurrentPage('reports')}
        />
      </div>

      {/* Recent Cases Data Grid */}
      <div className="mb-6 animate-slide-up delay-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-navy tracking-tight">Recent Cases</h3>
          <button
            onClick={() => setCurrentPage('cases')}
            className="text-sm font-bold text-gold hover:text-gold-dark transition-colors flex items-center gap-1.5 group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <DataGrid<CaseRecord>
          data={cases.slice(0, 10)}
          columns={caseColumns}
          onRowClick={(c: CaseRecord) => {
            setSelectedCase(c);
            setCurrentPage('cases');
          }}
          renderActions={(c: CaseRecord) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingCase(c);
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-gold hover:text-navy transition-all duration-300 shadow-sm border border-slate-200"
              title="Edit Case"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        />
      </div>

      {editingCase && (
        <EditCaseModal
          initialCase={editingCase}
          onSave={handleEditSave}
          onClose={() => setEditingCase(null)}
        />
      )}
    </div>
  );
};

// ===== Accountant Dashboard =====
const EnhancedAccountantDashboard: React.FC = () => {
  const { financialRecords, setCurrentPage, authState } = useApp();

  const stats = useMemo(() => {
    const revenue = financialRecords.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
    const expenses = financialRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const refunds = financialRecords.filter(r => r.type === 'refund').reduce((s, r) => s + r.amount, 0);
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netIncome: revenue - expenses - refunds,
      transactionCount: financialRecords.length,
      recentTransactions: financialRecords.slice(0, 5),
      margin: revenue > 0 ? ((revenue - expenses) / revenue * 100).toFixed(1) : '0',
    };
  }, [financialRecords]);

  return (
    <div className="p-6 lg:p-8">
      <WelcomeBanner name={authState.user?.name || ''} role={authState.user?.role || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`TZS ${stats.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          onClick={() => setCurrentPage('financials')}
        />
        <StatsCard
          title="Total Expenses"
          value={`TZS ${stats.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          onClick={() => setCurrentPage('financials')}
        />
        <StatsCard
          title="Net Income"
          value={`TZS ${stats.netIncome.toLocaleString()}`}
          icon={Banknote}
          iconBg="bg-gold/10"
          iconColor="text-gold"
          onClick={() => setCurrentPage('analytics')}
        />
        <StatsCard
          title="Profit Margin"
          value={`${stats.margin}%`}
          subtitle={`${stats.transactionCount} transactions`}
          icon={BarChart3}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          onClick={() => setCurrentPage('analytics')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-up delay-2">
        <Card className="p-6 group cursor-pointer hover:translate-y-[-2px]" onClick={() => setCurrentPage('financials')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy text-sm">Financial Records</h3>
              <p className="text-xs text-slate-400 mt-1">View and manage all transactions</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </div>
        </Card>
        <Card className="p-6 group cursor-pointer hover:translate-y-[-2px]" onClick={() => setCurrentPage('analytics')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy text-sm">Analytics Dashboard</h3>
              <p className="text-xs text-slate-400 mt-1">Revenue trends and expense analysis</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="animate-slide-up delay-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-navy tracking-tight">Recent Transactions</h3>
          <button onClick={() => setCurrentPage('financials')} className="text-sm font-bold text-gold hover:text-gold-dark transition-colors flex items-center gap-1.5 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-100/60">
            {stats.recentTransactions.map(record => (
              <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    record.type === 'revenue' ? 'bg-emerald-50' : record.type === 'expense' ? 'bg-red-50' : 'bg-amber-50'
                  )}>
                    {record.type === 'revenue' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> :
                     record.type === 'expense' ? <TrendingDown className="w-5 h-5 text-red-500" /> :
                     <Banknote className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{record.category}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{record.description}</p>
                  </div>
                </div>
                <span className={cn(
                  'font-bold text-sm',
                  record.type === 'revenue' ? 'text-emerald-600' : record.type === 'expense' ? 'text-red-500' : 'text-slate-600'
                )}>
                  {record.type === 'expense' || record.type === 'refund' ? '-' : '+'}TZS {record.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ===== Litigator Dashboard =====
const EnhancedLitigatorDashboard: React.FC = () => {
  const { cases, setCases, authState, setCurrentPage, setSelectedCase, addNotification } = useApp();
  const userId = authState.user!.id;
  const [editingCase, setEditingCase] = useState<CaseRecord | null>(null);

  const myCases = useMemo(() => filterCasesByRole(cases, 'litigator', userId), [cases, userId]);

  const stats = useMemo(() => ({
    total: myCases.length,
    active: myCases.filter(c => c.status === 'active').length,
    filed: myCases.filter(c => c.status === 'filed').length,
    pending: myCases.filter(c => c.status === 'pending').length,
  }), [myCases]);

  const caseColumns = [
    {
      key: 'caseNumber',
      title: 'Case Number',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-xs font-bold text-gold">{value}</span>
      ),
    },
    {
      key: 'title',
      title: 'Case Title',
      sortable: true,
      render: (value: string, row: CaseRecord) => (
        <div>
          <span className="font-semibold text-sm text-navy block">{value}</span>
          <span className="text-slate-400 text-[10px] truncate max-w-[200px] mt-0.5 block">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: CaseStatus) => <StatusPill status={value} />,
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      render: (value: Date) => (
        <span className="text-xs text-slate-400 font-medium">{value.toLocaleDateString()}</span>
      ),
    },
  ];

  const handleEditSave = (updatedCase: CaseRecord) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? {
      ...updatedCase,
      lastUpdated: new Date(),
      updates: [
        ...c.updates,
        {
          id: 'up' + Date.now(),
          timestamp: new Date(),
          author: authState.user!.name,
          content: 'Case details updated.',
        }
      ]
    } : c));
    setEditingCase(null);
    addNotification('success', 'Case details updated successfully.');
  };

  return (
    <div className="p-6 lg:p-8">
      <WelcomeBanner name={authState.user?.name || ''} role={authState.user?.role || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Cases"
          value={stats.total}
          icon={Briefcase}
          iconBg="bg-gold/10"
          iconColor="text-gold"
          onClick={() => setCurrentPage('cases')}
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={Activity}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          onClick={() => setCurrentPage('cases')}
        />
        <StatsCard
          title="Filed"
          value={stats.filed}
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          onClick={() => setCurrentPage('cases')}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          onClick={() => setCurrentPage('cases')}
        />
      </div>

      <div className="animate-slide-up delay-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-navy tracking-tight">My Cases</h3>
          <Button onClick={() => setCurrentPage('cases')} variant="accent" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Case
          </Button>
        </div>
        <DataGrid<CaseRecord>
          data={myCases}
          columns={caseColumns}
          onRowClick={(c: CaseRecord) => {
            setSelectedCase(c);
            setCurrentPage('cases');
          }}
          renderActions={(c: CaseRecord) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingCase(c);
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-gold hover:text-navy transition-all duration-300 shadow-sm border border-slate-200"
              title="Edit Case"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        />
      </div>

      {editingCase && (
        <EditCaseModal
          initialCase={editingCase}
          onSave={handleEditSave}
          onClose={() => setEditingCase(null)}
        />
      )}
    </div>
  );
};

// ===== Advisory Dashboard =====
const EnhancedAdvisoryDashboard: React.FC = () => {
  const { cases, sharedResources, authState, setCurrentPage } = useApp();
  const userId = authState.user!.id;

  const myCases = useMemo(() => cases.filter(c => c.assignedClients.includes(userId)), [cases, userId]);
  const myResources = useMemo(() => sharedResources.filter(r => r.explicitShares.includes(userId)), [sharedResources, userId]);

  const stats = useMemo(() => ({
    totalCases: myCases.length,
    activeCases: myCases.filter(c => c.status === 'active').length,
    pendingCases: myCases.filter(c => c.status === 'pending').length,
    sharedDocs: myResources.length,
  }), [myCases, myResources]);

  return (
    <div className="p-6 lg:p-8">
      <WelcomeBanner name={authState.user?.name || ''} role={authState.user?.role || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="My Cases"
          value={stats.totalCases}
          icon={Briefcase}
          iconBg="bg-gold/10"
          iconColor="text-gold"
          onClick={() => setCurrentPage('my-cases')}
        />
        <StatsCard
          title="Active Cases"
          value={stats.activeCases}
          icon={Activity}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          onClick={() => setCurrentPage('my-cases')}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingCases}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          onClick={() => setCurrentPage('my-cases')}
        />
        <StatsCard
          title="Documents"
          value={stats.sharedDocs}
          subtitle="Shared with you"
          icon={FileText}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          onClick={() => setCurrentPage('resources')}
        />
      </div>

      {/* My Cases Summary */}
      <div className="mb-8 animate-slide-up delay-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-navy tracking-tight">My Cases</h3>
          <button onClick={() => setCurrentPage('my-cases')} className="text-sm font-bold text-gold hover:text-gold-dark transition-colors flex items-center gap-1.5 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCases.slice(0, 4).map(c => (
            <Card key={c.id} className="p-5 cursor-pointer group hover:translate-y-[-2px]" onClick={() => setCurrentPage('my-cases')}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-gold">{c.caseNumber}</span>
                <StatusPill status={c.status} />
              </div>
              <h4 className="font-bold text-navy text-sm mb-1 group-hover:text-gold transition-colors">{c.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.updates.length} updates</span>
                <span>{c.filedDate.toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up delay-3">
        <Card className="p-6 group cursor-pointer hover:translate-y-[-2px]" onClick={() => setCurrentPage('my-cases')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy text-sm">Track My Cases</h3>
              <p className="text-xs text-slate-400 mt-1">View detailed status and updates</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </div>
        </Card>
        <Card className="p-6 group cursor-pointer hover:translate-y-[-2px]" onClick={() => setCurrentPage('resources')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy text-sm">Shared Documents</h3>
              <p className="text-xs text-slate-400 mt-1">Access documents shared with you</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const dashboardMap: Record<UserRole, React.FC> = {
  admin: EnhancedAdminDashboard,
  accountant: EnhancedAccountantDashboard,
  litigator: EnhancedLitigatorDashboard,
  advisory: EnhancedAdvisoryDashboard,
};

export const EnhancedDashboard: React.FC = () => {
  const { authState } = useApp();
  if (!authState.user) return null;

  const DashboardComponent = dashboardMap[authState.user.role];

  return (
    <ErrorBoundary>
      <DashboardComponent />
    </ErrorBoundary>
  );
};
