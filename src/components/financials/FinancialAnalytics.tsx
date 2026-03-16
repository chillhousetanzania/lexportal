import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, cn } from '../ui';
import { PageHeader, AccessDenied } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { FinancialRecord, FinancialMetrics, CategoryBreakdown } from '../../types';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Coins, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

const COLORS = ['#d4af37', '#0f172a', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const calculateMetrics = (records: FinancialRecord[]): FinancialMetrics => {
  const revenue = records.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
  const expenses = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  const expensesByCategory = records
    .filter(r => r.type === 'expense')
    .reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {});

  const totalExpenseAmount = Object.values(expensesByCategory).reduce((s, a) => s + a, 0);

  const categoryBreakdown: CategoryBreakdown[] = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0,
    })
  );

  return {
    totalRevenue: revenue,
    totalExpenses: expenses,
    netIncome: revenue - expenses,
    revenueGrowth: 0,
    expensesByCategory: categoryBreakdown,
  };
};

const calculateRevenueByMonth = (records: FinancialRecord[]) => {
  const monthMap: Record<string, { revenue: number; expenses: number }> = {};

  records.forEach(r => {
    const date = new Date(r.transactionDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) monthMap[key] = { revenue: 0, expenses: 0 };
    if (r.type === 'revenue') monthMap[key].revenue += r.amount;
    if (r.type === 'expense') monthMap[key].expenses += r.amount;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => ({
      period,
      revenue: data.revenue,
      expenses: data.expenses,
      net: data.revenue - data.expenses,
    }));
};

const FinancialAnalyticsContent: React.FC = () => {
  const { financialRecords } = useApp();
  const [timePreset, setTimePreset] = useState<'all' | 'quarter' | 'year'>('all');

  const filteredRecords = useMemo(() => {
    if (timePreset === 'all') return financialRecords;
    const now = new Date();
    const cutoff = new Date();
    if (timePreset === 'quarter') cutoff.setMonth(now.getMonth() - 3);
    if (timePreset === 'year') cutoff.setFullYear(now.getFullYear() - 1);
    return financialRecords.filter(r => new Date(r.transactionDate) >= cutoff);
  }, [financialRecords, timePreset]);

  const metrics = useMemo(() => calculateMetrics(filteredRecords), [filteredRecords]);
  const revenueData = useMemo(() => calculateRevenueByMonth(filteredRecords), [filteredRecords]);

  const pieData = metrics.expensesByCategory.map(c => ({
    name: c.category,
    value: c.amount,
  }));

  const categoryBarData = metrics.expensesByCategory.map(c => ({
    category: c.category,
    amount: c.amount,
  }));

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Financial Analytics" subtitle="Revenue trends, expense analysis, and key metrics" icon={<BarChart3 className="w-6 h-6 text-white" />}>
        <div className="flex gap-1.5 bg-slate-100/80 rounded-xl p-1">
          {(['all', 'year', 'quarter'] as const).map(preset => (
            <button
              key={preset}
              onClick={() => setTimePreset(preset)}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300',
                timePreset === preset
                  ? 'gradient-navy text-gold shadow-navy'
                  : 'text-slate-600 hover:text-navy hover:bg-white font-black'
              )}
            >
              {preset === 'all' ? 'All Time' : preset === 'year' ? 'Last Year' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
        <Card className="p-5 group hover:translate-y-[-2px]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Revenue</p>
              <p className="text-2xl font-black text-navy mt-1">TZS {metrics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 group hover:translate-y-[-2px]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Expenses</p>
              <p className="text-2xl font-black text-navy mt-1">TZS {metrics.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 group hover:translate-y-[-2px]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Net Income</p>
              <p className={cn('text-2xl font-black mt-1', metrics.netIncome >= 0 ? 'text-emerald-700' : 'text-red-600')}>
                TZS {metrics.netIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5 group hover:translate-y-[-2px]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Margin</p>
              <p className="text-2xl font-black text-navy mt-1">
                {metrics.totalRevenue > 0 ? ((metrics.netIncome / metrics.totalRevenue) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Trend Line Chart */}
      <Card className="p-6 mb-6 animate-slide-up delay-1">
        <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">Revenue & Expense Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="#64748b" />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              formatter={(value) => [`TZS ${Number(value).toLocaleString()}`]}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2.5} dot={{ fill: '#d4af37', r: 4 }} activeDot={{ r: 6, strokeWidth: 2 }} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6, strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up delay-2">
        {/* Expense Breakdown Pie Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">Expense Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
                  formatter={(value) => [`TZS ${Number(value).toLocaleString()}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-300 text-sm font-medium">No expense data</div>
          )}
        </Card>

        {/* Category Bar Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">Expenses by Category</h3>
          {categoryBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#64748b" angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
                  formatter={(value) => [`TZS ${Number(value).toLocaleString()}`]}
                />
                <Bar dataKey="amount" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-300 text-sm font-medium">No expense data</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export const FinancialAnalytics: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleGuard allowedRoles={['admin', 'accountant']} fallback={<AccessDenied module="Financial Analytics" />}>
        <FinancialAnalyticsContent />
      </RoleGuard>
    </ErrorBoundary>
  );
};
