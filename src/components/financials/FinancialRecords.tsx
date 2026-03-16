import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, Button, Badge, Input, Select, cn } from '../ui';
import { PageHeader, AccessDenied, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { FinancialRecord, TransactionType } from '../../types';
import { Plus, Search, Banknote, TrendingUp, TrendingDown } from 'lucide-react';

const typeVariant = (type: TransactionType): 'success' | 'error' | 'warning' | 'info' => {
  const map: Record<TransactionType, 'success' | 'error' | 'warning' | 'info'> = {
    revenue: 'success',
    expense: 'error',
    refund: 'warning',
    adjustment: 'info',
  };
  return map[type];
};

const TransactionForm: React.FC<{
  onSubmit: (data: { transactionDate: string; type: TransactionType; category: string; amount: number; description: string }) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    type: 'revenue' as TransactionType,
    category: '',
    amount: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      transactionDate: form.transactionDate,
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
    });
  };

  return (
    <Card className="p-8 animate-scale-in">
      <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">Record Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Date" type="date" required value={form.transactionDate} onChange={e => setForm({ ...form, transactionDate: e.target.value })} />
          <Select label="Type" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value as TransactionType })} options={[
            { value: 'revenue', label: 'Revenue' },
            { value: 'expense', label: 'Expense' },
            { value: 'refund', label: 'Refund' },
            { value: 'adjustment', label: 'Adjustment' },
          ]} />
          <Input label="Category" required placeholder="e.g. Legal Fees, Office Rent" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <Input label="Amount (TZS)" type="number" required placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        </div>
        <Input label="Description" required placeholder="Brief description of the transaction" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="accent">Record Transaction</Button>
        </div>
      </form>
    </Card>
  );
};

const FinancialRecordsContent: React.FC = () => {
  const { financialRecords, setFinancialRecords, authState, addNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  const metrics = useMemo(() => {
    const revenue = financialRecords.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
    const expenses = financialRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const refunds = financialRecords.filter(r => r.type === 'refund').reduce((s, r) => s + r.amount, 0);
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netIncome: revenue - expenses - refunds,
      totalRecords: financialRecords.length,
    };
  }, [financialRecords]);

  const filtered = useMemo(() => {
    return financialRecords.filter(r => {
      const matchSearch =
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      return matchSearch && matchType;
    }).sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [financialRecords, search, typeFilter]);

  const handleCreate = (data: { transactionDate: string; type: TransactionType; category: string; amount: number; description: string }) => {
    if (isNaN(data.amount) || data.amount <= 0) {
      addNotification('error', 'Please enter a valid amount.');
      return;
    }
    const newRecord: FinancialRecord = {
      id: 'f' + Date.now(),
      transactionDate: new Date(data.transactionDate),
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      createdBy: authState.user!.id,
      createdAt: new Date(),
    };
    setFinancialRecords(prev => [newRecord, ...prev]);
    setShowForm(false);
    addNotification('success', 'Transaction recorded successfully.');
  };

  if (showForm) {
    return (
      <div className="p-6 lg:p-8">
        <TransactionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Financial Records" subtitle="Manage transactions and records" icon={<Banknote className="w-6 h-6 text-white" />}>
        <Button variant="accent" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> New Transaction
        </Button>
      </PageHeader>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up">
        <Card className="p-5 relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-r" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Total Revenue</p>
              <p className="text-2xl font-black text-navy mt-1">TZS {metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>
        <Card className="p-5 relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-500 rounded-r" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Total Expenses</p>
              <p className="text-2xl font-black text-navy mt-1">TZS {metrics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>
        <Card className="p-5 relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-dark rounded-r" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Net Income</p>
              <p className="text-2xl font-black text-navy mt-1">TZS {metrics.netIncome.toLocaleString()}</p>
            </div>
            <div className="p-2.5 bg-gold/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Banknote className="w-6 h-6 text-gold" />
            </div>
          </div>
        </Card>
        <Card className="p-5 relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-500 rounded-r" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Transactions</p>
              <p className="text-2xl font-black text-navy mt-1">{metrics.totalRecords}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-5 mb-8 animate-slide-up delay-1">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
          icon={<Search className="w-5 h-5 text-slate-600" />}
        />
        <div className="w-full sm:w-56">
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as TransactionType | 'all')}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'revenue', label: 'Revenue' },
              { value: 'expense', label: 'Expense' },
              { value: 'refund', label: 'Refund' },
              { value: 'adjustment', label: 'Adjustment' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden animate-slide-up delay-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-premium">
            <thead>
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-4 text-xs text-slate-600 font-black">
                    {record.transactionDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={typeVariant(record.type)} size="sm">{record.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-navy">{record.category}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-bold truncate max-w-[200px]">{record.description}</td>
                  <td className={cn(
                    'px-6 py-4 text-right font-black text-sm',
                    record.type === 'revenue' ? 'text-emerald-700' : record.type === 'expense' ? 'text-red-600' : 'text-slate-700'
                  )}>
                    {record.type === 'expense' || record.type === 'refund' ? '-' : '+'}TZS {record.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState title="No transactions found" description="No transactions match your filters." />
        )}
      </Card>
    </div>
  );
};

export const FinancialRecords: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleGuard allowedRoles={['admin', 'accountant']} fallback={<AccessDenied module="Financial Records" />}>
        <FinancialRecordsContent />
      </RoleGuard>
    </ErrorBoundary>
  );
};
