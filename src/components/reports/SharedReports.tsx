import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Input, Select } from '../ui';
import { PageHeader, EmptyState } from '../shared/PageElements';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { filterSharedResourcesByRole } from '../../utils/rbac';
import type { SharedResource, ResourceType } from '../../types';
import { FileText, File, FileCode, BarChart, Search, Calendar, User, ArrowLeft } from 'lucide-react';

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
          className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-6 hover:text-gold transition-colors inline-flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Reports
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
          <Card className="p-5 border-2 border-slate-300/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <User className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Created By</p>
                <p className="text-sm font-black text-navy">{creator?.name || 'Unknown'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-slate-300/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <Calendar className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Created</p>
                <p className="text-sm font-black text-navy">{selectedResource.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-slate-300/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <FileText className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shared With</p>
                <p className="text-sm font-black text-navy capitalize">{selectedResource.sharedWith.join(', ')}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 border-2 border-slate-300/60">
          <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-gold rounded-full" /> Description
          </h3>
          <p className="text-navy text-sm font-medium leading-relaxed">{selectedResource.description}</p>
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

      <div className="flex flex-col sm:flex-row gap-5 mb-8 animate-slide-up">
        <Input
          placeholder="Search reports or resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
          icon={<Search className="w-5 h-5 text-slate-600" />}
        />
        <div className="w-full sm:w-56">
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ResourceType | 'all')}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'report', label: 'Reports' },
              { value: 'document', label: 'Documents' },
              { value: 'template', label: 'Templates' },
              { value: 'analysis', label: 'Analysis' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up delay-1">
        {filtered.map((resource) => {
          const Icon = typeIcon[resource.type];
          const creator = users.find(u => u.id === resource.createdBy);
          return (
            <Card
              key={resource.id}
              className="p-5 cursor-pointer group hover:translate-y-[-2px]"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-navy group-hover:border-navy transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={typeVariant[resource.type]} size="sm">{resource.type}</Badge>
                  </div>
                  <h3 className="font-black text-navy text-base mb-1.5 group-hover:text-gold transition-colors duration-300 truncate">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 font-bold text-xs line-clamp-2 mb-4 leading-relaxed">{resource.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-700 font-black uppercase tracking-tight">
                    <span>{creator?.name || 'Unknown'}</span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
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
