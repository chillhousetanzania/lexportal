import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../ui';
import { PageHeader, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterSharedResourcesByRole } from '../../utils/rbac';
import type { SharedResource, ResourceType } from '../../types';
import { FileText, File, FileCode, BarChart, Search, Calendar, User } from 'lucide-react';

const typeIcon: Record<ResourceType, React.FC<{ className?: string }>> = {
  report: BarChart,
  document: FileText,
  template: File,
  analysis: FileCode,
};

const typeVariant: Record<ResourceType, 'info' | 'success' | 'warning' | 'default'> = {
  report: 'info',
  document: 'success',
  template: 'warning',
  analysis: 'default',
};

const SharedReportsContent: React.FC = () => {
  const { sharedResources, authState, users } = useApp();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<ResourceType | 'all'>('all');
  const [selectedResource, setSelectedResource] = React.useState<SharedResource | null>(null);

  const role = authState.user!.role;
  const userId = authState.user!.id;

  const roleResources = useMemo(
    () => filterSharedResourcesByRole(sharedResources, role, userId),
    [sharedResources, role, userId]
  );

  const filtered = useMemo(() => {
    return roleResources.filter(r => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [roleResources, search, typeFilter]);

  if (selectedResource) {
    const creator = users.find(u => u.id === selectedResource.createdBy);
    return (
      <div className="p-6 lg:p-8">
        <button
          onClick={() => setSelectedResource(null)}
          className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 hover:text-navy transition-colors"
        >
          &larr; Back to Reports
        </button>

        <div className="bg-navy text-white p-6 rounded-xl mb-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant={typeVariant[selectedResource.type]} size="sm">{selectedResource.type}</Badge>
              <h2 className="text-xl font-black mt-3">{selectedResource.title}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Created By</p>
                <p className="text-sm font-bold text-navy">{creator?.name || 'Unknown'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Created</p>
                <p className="text-sm font-bold text-navy">{selectedResource.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Shared With</p>
                <p className="text-sm font-bold text-navy">{selectedResource.sharedWith.join(', ')}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-3">Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{selectedResource.description}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title={role === 'advisory' ? 'Shared Resources' : 'Shared Reports'}
        subtitle={`${filtered.length} ${role === 'advisory' ? 'resources' : 'reports'} available`}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Card className="flex-1 p-3">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="flex-1 text-sm outline-none text-navy"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </Card>
        <Card className="p-3">
          <select
            className="text-sm outline-none text-navy bg-transparent font-medium"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ResourceType | 'all')}
          >
            <option value="all">All Types</option>
            <option value="report">Reports</option>
            <option value="document">Documents</option>
            <option value="template">Templates</option>
            <option value="analysis">Analysis</option>
          </select>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(resource => {
          const Icon = typeIcon[resource.type];
          const creator = users.find(u => u.id === resource.createdBy);
          return (
            <Card
              key={resource.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all group"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={typeVariant[resource.type]} size="sm">{resource.type}</Badge>
                  </div>
                  <h3 className="font-bold text-navy text-sm mb-1 group-hover:text-gold transition-colors truncate">
                    {resource.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{resource.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>{creator?.name || 'Unknown'}</span>
                    <span>{resource.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <EmptyState
          icon={<FileText className="w-12 h-12 text-slate-300" />}
          title="No reports found"
          description="No reports match your current filters."
        />
      )}
    </div>
  );
};

export const SharedReports: React.FC = () => {
  return (
    <ErrorBoundary>
      <SharedReportsContent />
    </ErrorBoundary>
  );
};
