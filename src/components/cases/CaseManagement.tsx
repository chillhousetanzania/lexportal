import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, Button, Badge, cn } from '../ui';
import { PageHeader, AccessDenied, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterCasesByRole } from '../../utils/rbac';
import { CaseWizard } from '../wizard/CaseWizard';
import type { CaseRecord, CaseStatus } from '../../types';
import { Plus, Search, Filter, Calendar, Eye, Briefcase } from 'lucide-react';

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
    <div className="p-6 lg:p-8 animate-fade-in">
      <button onClick={onBack} className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-6 hover:text-gold transition-colors inline-flex items-center gap-2">
        &larr; Back to Cases
      </button>

      <div className="gradient-navy rounded-3xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{caseRecord.caseNumber}</p>
            <h2 className="text-2xl font-black tracking-tight">{caseRecord.title}</h2>
          </div>
          <Badge variant={statusVariant(caseRecord.status)} size="lg">{caseRecord.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Assigned Litigator</p>
          <p className="font-bold text-navy">{litigator?.name || 'Unassigned'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Filed Date</p>
          <p className="font-bold text-navy">{caseRecord.filedDate.toLocaleDateString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Clients</p>
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
              <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50/80 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{kd.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{new Date(kd.date).toLocaleDateString()}</p>
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
            <div key={update.id} className="border-l-[3px] border-gold pl-4 py-2">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-bold text-navy text-sm">{update.author}</p>
                <p className="text-slate-400 text-[10px] font-medium">{new Date(update.timestamp).toLocaleString()}</p>
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

const CaseManagementContent: React.FC = () => {
  const { cases, setCases, authState, users, addNotification } = useApp();
  const [showWizard, setShowWizard] = useState(false);
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

  const handleWizardComplete = (wizardData: Record<string, any>) => {
    const caseDetails = wizardData['case-details'] || {};
    const caseNumber = `LEX-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`;

    const newCase: CaseRecord = {
      id: 'c' + Date.now(),
      caseNumber,
      title: caseDetails.caseTitle,
      description: caseDetails.caseDescription,
      status: 'filed',
      assignedLitigator: authState.user!.role === 'litigator' ? authState.user!.id : '',
      assignedClients: [],
      filedDate: new Date(),
      lastUpdated: new Date(),
      keyDates: [{ label: 'Filing Date', date: new Date() }],
      updates: [
        {
          id: 'up' + Date.now(),
          timestamp: new Date(),
          author: authState.user!.name,
          content: 'Case filed via eCase wizard.',
        },
      ],
    };

    setCases(prev => [newCase, ...prev]);
    setShowWizard(false);
    addNotification('success', `Case "${caseDetails.caseTitle}" filed with number ${caseNumber}.`);
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

  if (showWizard) {
    return (
      <CaseWizard
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Case Management" subtitle={`${filteredCases.length} cases`} icon={<Briefcase className="w-6 h-6 text-white" />}>
        {(role === 'admin' || role === 'litigator') && (
          <Button variant="accent" onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4" /> File New Case
          </Button>
        )}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up">
        <Card className="flex-1 p-3.5">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search cases..."
              className="flex-1 text-sm outline-none text-navy bg-transparent placeholder:text-slate-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </Card>
        <Card className="p-3.5">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-300" />
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

      <Card className="overflow-hidden animate-slide-up delay-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-premium">
            <thead>
              <tr>
                <th className="px-6 py-4">Case #</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Litigator</th>
                <th className="px-6 py-4">Filed</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {filteredCases.map(caseItem => {
                const litigator = users.find(u => u.id === caseItem.assignedLitigator);
                return (
                  <tr key={caseItem.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gold">{caseItem.caseNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy text-sm">{caseItem.title}</p>
                      <p className="text-slate-400 text-[10px] truncate max-w-[200px] mt-0.5">{caseItem.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      {(role === 'admin' || role === 'litigator') ? (
                        <select
                          className="text-xs font-semibold bg-transparent outline-none cursor-pointer text-navy"
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
                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">{litigator?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">{caseItem.filedDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
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
