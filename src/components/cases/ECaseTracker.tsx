import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleGuard } from '../auth/RoleGuard';
import { Card, Badge } from '../ui';
import { PageHeader, AccessDenied, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import type { CaseRecord, CaseStatus } from '../../types';
import { Calendar, Clock, FileText, Search } from 'lucide-react';

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

const CaseCard: React.FC<{ caseRecord: CaseRecord; onSelect: () => void; isSelected: boolean }> = ({ caseRecord, onSelect, isSelected }) => {
  return (
    <Card
      className={`p-5 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-gold' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[10px] font-bold text-gold">{caseRecord.caseNumber}</span>
        <Badge variant={statusVariant(caseRecord.status)} size="sm">{caseRecord.status}</Badge>
      </div>
      <h3 className="font-bold text-navy text-sm mb-2">{caseRecord.title}</h3>
      <p className="text-slate-500 text-xs line-clamp-2 mb-3">{caseRecord.description}</p>
      <div className="flex items-center gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {caseRecord.filedDate.toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {caseRecord.updates.length} updates
        </span>
      </div>
    </Card>
  );
};

const CaseDetailPanel: React.FC<{ caseRecord: CaseRecord }> = ({ caseRecord }) => {
  const { users } = useApp();
  const litigator = users.find(u => u.id === caseRecord.assignedLitigator);

  return (
    <div className="space-y-6">
      <div className="bg-navy text-white p-5 rounded-xl">
        <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-1">{caseRecord.caseNumber}</p>
        <h2 className="text-lg font-black mb-2">{caseRecord.title}</h2>
        <Badge variant={statusVariant(caseRecord.status)} size="md">{caseRecord.status}</Badge>
      </div>

      <Card className="p-5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Case Details</h4>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{caseRecord.description}</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Litigator</p>
            <p className="font-bold text-navy">{litigator?.name || 'N/A'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Filed</p>
            <p className="font-bold text-navy">{caseRecord.filedDate.toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {caseRecord.keyDates.length > 0 && (
        <Card className="p-5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Key Dates</h4>
          <div className="space-y-2">
            {caseRecord.keyDates.map((kd, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="font-bold text-navy text-xs">{kd.label}</p>
                  <p className="text-slate-400 text-[10px]">{new Date(kd.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Updates</h4>
        <div className="space-y-3">
          {caseRecord.updates.slice(0, 5).map(update => (
            <div key={update.id} className="border-l-2 border-gold pl-3 py-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-navy text-xs">{update.author}</p>
                <p className="text-slate-400 text-[10px]">{new Date(update.timestamp).toLocaleDateString()}</p>
              </div>
              <p className="text-slate-600 text-xs">{update.content}</p>
            </div>
          ))}
          {caseRecord.updates.length === 0 && (
            <p className="text-slate-400 text-xs italic">No updates yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

const ECaseTrackerContent: React.FC = () => {
  const { cases, authState } = useApp();
  const userId = authState.user!.id;
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [search, setSearch] = useState('');

  const myCases = useMemo(
    () => cases.filter(c => c.assignedClients.includes(userId)),
    [cases, userId]
  );

  const filtered = useMemo(
    () =>
      myCases.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(search.toLowerCase())
      ),
    [myCases, search]
  );

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="My Cases" subtitle={`${myCases.length} cases assigned to you`} />

      <Card className="mb-6 p-3">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your cases..."
            className="flex-1 text-sm outline-none text-navy"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filtered.map(c => (
            <CaseCard
              key={c.id}
              caseRecord={c}
              onSelect={() => setSelectedCase(c)}
              isSelected={selectedCase?.id === c.id}
            />
          ))}
          {filtered.length === 0 && (
            <EmptyState
              icon={<FileText className="w-12 h-12 text-slate-300" />}
              title="No cases found"
              description="You don't have any cases assigned to you yet."
            />
          )}
        </div>

        <div className="hidden lg:block">
          {selectedCase ? (
            <CaseDetailPanel caseRecord={selectedCase} />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Select a case to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile detail view */}
      {selectedCase && (
        <div className="lg:hidden mt-6">
          <button
            onClick={() => setSelectedCase(null)}
            className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 hover:text-navy"
          >
            &larr; Back to list
          </button>
          <CaseDetailPanel caseRecord={selectedCase} />
        </div>
      )}
    </div>
  );
};

export const ECaseTracker: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleGuard allowedRoles={['advisory']} fallback={<AccessDenied module="eCase Tracker" />}>
        <ECaseTrackerContent />
      </RoleGuard>
    </ErrorBoundary>
  );
};
