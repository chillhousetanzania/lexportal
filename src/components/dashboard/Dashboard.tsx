import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../ui';
import { PageHeader } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterCasesByRole, filterSharedResourcesByRole } from '../../utils/rbac';
import {
  Users, Briefcase, FileText, TrendingUp,
  Clock, Activity, ArrowRight,
} from 'lucide-react';
import type { UserRole, CaseStatus } from '../../types';

const statusVariant = (status: CaseStatus): 'info' | 'success' | 'warning' | 'error' | 'default' => {
  const map: Record<CaseStatus, 'info' | 'success' | 'warning' | 'error' | 'default'> = {
    filed: 'info',
    active: 'success',
    pending: 'warning',
    closed: 'default',
    archived: 'error',
  };
  return map[status];
};

const AdminDashboard: React.FC = () => {
  const { users, cases, financialRecords, sharedResources, setCurrentPage } = useApp();

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

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Firm Overview" subtitle="Administrative dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('users')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</p>
              <p className="text-2xl font-black text-navy">{stats.totalUsers}</p>
              <p className="text-[10px] text-slate-400">{stats.activeUsers} active</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-gold cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('cases')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cases</p>
              <p className="text-2xl font-black text-navy">{stats.totalCases}</p>
              <p className="text-[10px] text-slate-400">{stats.activeCases} active</p>
            </div>
            <Briefcase className="w-8 h-8 text-gold" />
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-emerald-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('financials')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
              <p className="text-2xl font-black text-navy">${stats.revenue.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-500">Net: ${stats.netIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('reports')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
              <p className="text-2xl font-black text-navy">{stats.reports}</p>
              <p className="text-[10px] text-slate-400">Shared resources</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card className="mb-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight">Recent Cases</h3>
          <button onClick={() => setCurrentPage('cases')} className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {cases.slice(0, 5).map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-gold">{c.caseNumber}</span>
                <span className="font-bold text-navy text-sm">{c.title}</span>
              </div>
              <Badge variant={statusVariant(c.status)} size="sm">{c.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AccountantDashboard: React.FC = () => {
  const { financialRecords, setCurrentPage } = useApp();

  const stats = useMemo(() => {
    const revenue = financialRecords.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
    const expenses = financialRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    return { revenue, expenses, netIncome: revenue - expenses, transactions: financialRecords.length };
  }, [financialRecords]);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Financial Dashboard" subtitle="Accountant overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-l-4 border-emerald-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('financials')}>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
          <p className="text-2xl font-black text-navy">${stats.revenue.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('financials')}>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Expenses</p>
          <p className="text-2xl font-black text-navy">${stats.expenses.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border-l-4 border-gold cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('analytics')}>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Net Income</p>
          <p className={`text-2xl font-black ${stats.netIncome >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${stats.netIncome.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Transactions</p>
          <p className="text-2xl font-black text-navy">{stats.transactions}</p>
        </Card>
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight">Recent Transactions</h3>
          <button onClick={() => setCurrentPage('financials')} className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {financialRecords.slice(0, 5).map(r => (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="font-bold text-navy text-sm">{r.description}</p>
                <p className="text-slate-400 text-[10px]">{r.category} - {r.transactionDate.toLocaleDateString()}</p>
              </div>
              <span className={`font-bold text-sm ${r.type === 'revenue' ? 'text-emerald-600' : 'text-red-500'}`}>
                {r.type === 'expense' ? '-' : '+'}${r.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const LitigatorDashboard: React.FC = () => {
  const { cases, authState, setCurrentPage } = useApp();
  const userId = authState.user!.id;

  const myCases = useMemo(() => filterCasesByRole(cases, 'litigator', userId), [cases, userId]);

  const stats = useMemo(() => ({
    total: myCases.length,
    active: myCases.filter(c => c.status === 'active').length,
    filed: myCases.filter(c => c.status === 'filed').length,
    pending: myCases.filter(c => c.status === 'pending').length,
  }), [myCases]);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Counsel Command Center" subtitle="Your case overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-l-4 border-gold cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('cases')}>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cases</p>
          <p className="text-2xl font-black text-navy">{stats.total}</p>
        </Card>
        <Card className="p-5 border-l-4 border-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
          <p className="text-2xl font-black text-navy">{stats.active}</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Filed</p>
          <p className="text-2xl font-black text-navy">{stats.filed}</p>
        </Card>
        <Card className="p-5 border-l-4 border-amber-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
          <p className="text-2xl font-black text-navy">{stats.pending}</p>
        </Card>
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight">Your Cases</h3>
          <button onClick={() => setCurrentPage('cases')} className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {myCases.slice(0, 6).map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-gold">{c.caseNumber}</span>
                <span className="font-bold text-navy text-sm">{c.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant(c.status)} size="sm">{c.status}</Badge>
                <span className="text-[10px] text-slate-400">{c.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AdvisoryDashboard: React.FC = () => {
  const { cases, sharedResources, authState, setCurrentPage } = useApp();
  const userId = authState.user!.id;

  const myCases = useMemo(() => cases.filter(c => c.assignedClients.includes(userId)), [cases, userId]);
  const myResources = useMemo(() => filterSharedResourcesByRole(sharedResources, 'advisory', userId), [sharedResources, userId]);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Client Portal" subtitle={`Welcome, ${authState.user!.name}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 border-l-4 border-gold cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('my-cases')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">My Cases</p>
              <p className="text-2xl font-black text-navy">{myCases.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-gold" />
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Cases</p>
              <p className="text-2xl font-black text-navy">{myCases.filter(c => c.status === 'active').length}</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentPage('resources')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Resources</p>
              <p className="text-2xl font-black text-navy">{myResources.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight">Case Status Overview</h3>
          <button onClick={() => setCurrentPage('my-cases')} className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {myCases.map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="font-bold text-navy text-sm">{c.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">Updated {c.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant={statusVariant(c.status)} size="sm">{c.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const dashboardMap: Record<UserRole, React.FC> = {
  admin: AdminDashboard,
  accountant: AccountantDashboard,
  litigator: LitigatorDashboard,
  advisory: AdvisoryDashboard,
};

export const Dashboard: React.FC = () => {
  const { authState } = useApp();
  if (!authState.user) return null;

  const DashboardComponent = dashboardMap[authState.user.role];

  return (
    <ErrorBoundary>
      <DashboardComponent />
    </ErrorBoundary>
  );
};
