import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, cn } from '../ui';
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
      <div className="p-6 lg:p-8 animate-fade-in">
        <button
          onClick={() => setSelectedResource(null)}
          className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-6 hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          &larr; Back to Reports
        </button>

        <div className="gradient-navy rounded-3xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <Badge variant={typeVariant[selectedResource.type]} size="sm">{selectedResource.type}</Badge>
              <h2 className="text-2xl font-black mt-3 tracking-tight">{selectedResource.title}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created By</p>
                <p className="text-sm font-bold text-navy">{creator?.name || 'Unknown'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</p>
                <p className="text-sm font-bold text-navy">{selectedResource.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shared With</p>
                <p className="text-sm font-bold text-navy capitalize">{selectedResource.sharedWith.join(', ')}</p>
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
        icon={<FileText className="w-6 h-6 text-white" />}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up">
        <Card className="flex-1 p-3.5">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search reports..."
              className="flex-1 text-sm outline-none text-navy bg-transparent placeholder:text-slate-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </Card>
        <Card className="p-3.5">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up delay-1">
        {filtered.map((resource, index) => {
          const Icon = typeIcon[resource.type];
          const creator = users.find(u => u.id === resource.createdBy);
          return (
            <Card
              key={resource.id}
              className="p-5 cursor-pointer group hover:translate-y-[-2px]"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={typeVariant[resource.type]} size="sm">{resource.type}</Badge>
                  </div>
                  <h3 className="font-bold text-navy text-sm mb-1 group-hover:text-gold transition-colors duration-300 truncate">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3">{resource.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span>{creator?.name || 'Unknown'}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
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
