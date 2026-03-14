import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, Button, Badge, Input, Select, Textarea } from '../ui';
import { PageHeader, AccessDenied, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterCasesByRole } from '../../utils/rbac';
import type { CaseRecord, CaseStatus } from '../../types';
import { Plus, Search, Filter, Calendar, Eye } from 'lucide-react';

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

const CaseDetailView: React.FC<{ caseRecord: CaseRecord; onBack: () => void }> = ({ caseRecord, onBack }) => {
  const { users } = useApp();
  const litigator = users.find(u => u.id === caseRecord.assignedLitigator);
  const clients = users.filter(u => caseRecord.assignedClients.includes(u.id));

  return (
    <div className="p-6 lg:p-8">
      <button onClick={onBack} className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 hover:text-navy transition-colors">
        &larr; Back to Cases
      </button>

      <div className="bg-navy text-white p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-1">{caseRecord.caseNumber}</p>
            <h2 className="text-xl font-black">{caseRecord.title}</h2>
          </div>
          <Badge variant={statusVariant(caseRecord.status)} size="lg">{caseRecord.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Litigator</p>
          <p className="font-bold text-navy">{litigator?.name || 'Unassigned'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filed Date</p>
          <p className="font-bold text-navy">{caseRecord.filedDate.toLocaleDateString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clients</p>
          <p className="font-bold text-navy">{clients.map(c => c.name).join(', ') || 'None'}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-3">Description</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{caseRecord.description}</p>
      </Card>

      {caseRecord.keyDates.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4">Key Dates</h3>
          <div className="space-y-3">
            {caseRecord.keyDates.map((kd, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gold" />
                <div>
                  <p className="font-bold text-navy text-sm">{kd.label}</p>
                  <p className="text-slate-400 text-xs">{new Date(kd.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4">Case Updates</h3>
        <div className="space-y-4">
          {caseRecord.updates.map(update => (
            <div key={update.id} className="border-l-2 border-gold pl-4 py-2">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-bold text-navy text-sm">{update.author}</p>
                <p className="text-slate-400 text-[10px]">{new Date(update.timestamp).toLocaleString()}</p>
              </div>
              <p className="text-slate-600 text-sm">{update.content}</p>
            </div>
          ))}
          {caseRecord.updates.length === 0 && (
            <p className="text-slate-400 text-sm italic">No updates recorded yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

const CaseForm: React.FC<{ onSubmit: (data: { title: string; description: string; assignedLitigator: string; assignedClients: string[] }) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const { users } = useApp();
  const litigators = users.filter(u => u.role === 'litigator' && u.status === 'active');
  const advisoryClients = users.filter(u => u.role === 'advisory' && u.status === 'active');

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedLitigator: litigators[0]?.id || '',
    selectedClients: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      description: form.description,
      assignedLitigator: form.assignedLitigator,
      assignedClients: form.selectedClients,
    });
  };

  const toggleClient = (clientId: string) => {
    setForm(prev => ({
      ...prev,
      selectedClients: prev.selectedClients.includes(clientId)
        ? prev.selectedClients.filter(id => id !== clientId)
        : [...prev.selectedClients, clientId],
    }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-6">File New Case</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Case Title"
          required
          placeholder="e.g. Doe v. Smith Corp"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          label="Description"
          required
          placeholder="Brief description of the case..."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <Select
          label="Assigned Litigator"
          required
          value={form.assignedLitigator}
          onChange={e => setForm({ ...form, assignedLitigator: e.target.value })}
          options={litigators.map(l => ({ value: l.id, label: l.name }))}
        />
        {advisoryClients.length > 0 && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Clients</label>
            <div className="flex flex-wrap gap-2">
              {advisoryClients.map(client => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => toggleClient(client.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    form.selectedClients.includes(client.id)
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {client.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="accent">File Case</Button>
        </div>
      </form>
    </Card>
  );
};

const CaseManagementContent: React.FC = () => {
  const { cases, setCases, authState, users, addNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');

  const role = authState.user!.role;
  const userId = authState.user!.id;

  const roleCases = useMemo(() => filterCasesByRole(cases, role, userId), [cases, role, userId]);

  const filteredCases = useMemo(() => {
    return roleCases.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roleCases, search, statusFilter]);

  const handleFileCase = (data: { title: string; description: string; assignedLitigator: string; assignedClients: string[] }) => {
    const caseNumber = `LEX-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase: CaseRecord = {
      id: 'c' + Date.now(),
      caseNumber,
      title: data.title,
      description: data.description,
      status: 'filed',
      assignedLitigator: data.assignedLitigator,
      assignedClients: data.assignedClients,
      filedDate: new Date(),
      lastUpdated: new Date(),
      keyDates: [{ label: 'Filing Date', date: new Date() }],
      updates: [
        {
          id: 'up' + Date.now(),
          timestamp: new Date(),
          author: authState.user!.name,
          content: 'Case filed.',
        },
      ],
    };
    setCases(prev => [newCase, ...prev]);
    setShowForm(false);
    addNotification('success', `Case "${data.title}" filed with number ${caseNumber}.`);
  };

  const handleStatusUpdate = (caseId: string, newStatus: CaseStatus) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          status: newStatus,
          lastUpdated: new Date(),
          updates: [
            ...c.updates,
            {
              id: 'up' + Date.now(),
              timestamp: new Date(),
              author: authState.user!.name,
              content: `Status updated to "${newStatus}".`,
            },
          ],
        };
      })
    );
    addNotification('success', 'Case status updated.');
  };

  if (selectedCase) {
    return <CaseDetailView caseRecord={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  if (showForm) {
    return (
      <div className="p-6 lg:p-8">
        <CaseForm onSubmit={handleFileCase} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Case Management" subtitle={`${filteredCases.length} cases`}>
        {(role === 'admin' || role === 'litigator') && (
          <Button variant="accent" onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> File New Case</span>
          </Button>
        )}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Card className="flex-1 p-3">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="flex-1 text-sm outline-none text-navy"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="text-sm outline-none text-navy bg-transparent font-medium"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as CaseStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="filed">Filed</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Case #</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Litigator</th>
                <th className="px-6 py-4">Filed</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map(caseItem => {
                const litigator = users.find(u => u.id === caseItem.assignedLitigator);
                return (
                  <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gold">{caseItem.caseNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy text-sm">{caseItem.title}</p>
                      <p className="text-slate-400 text-[10px] truncate max-w-[200px]">{caseItem.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      {(role === 'admin' || role === 'litigator') ? (
                        <select
                          className="text-xs font-semibold bg-transparent outline-none cursor-pointer"
                          value={caseItem.status}
                          onChange={e => handleStatusUpdate(caseItem.id, e.target.value as CaseStatus)}
                        >
                          <option value="filed">Filed</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="closed">Closed</option>
                          <option value="archived">Archived</option>
                        </select>
                      ) : (
                        <Badge variant={statusVariant(caseItem.status)} size="sm">{caseItem.status}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{litigator?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{caseItem.filedDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCases.length === 0 && (
          <EmptyState title="No cases found" description="No cases match your current filters." />
        )}
      </Card>
    </div>
  );
};

export const CaseManagement: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleGuard allowedRoles={['admin', 'litigator']} fallback={<AccessDenied module="Case Management" />}>
        <CaseManagementContent />
      </RoleGuard>
    </ErrorBoundary>
  );
};
