import React, { useState, useMemo } from 'react';
import { cn } from './index';
import { Search, Filter, ArrowUpDown, MoreVertical } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
}

export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  filterable = true,
  className,
  onRowClick,
  emptyState,
}: DataGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue.toString().localeCompare(bValue.toString());
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (filteredAndSortedData.length === 0) {
    return (
      <div className={cn('bg-white rounded-2xl border border-slate-100/60 p-16 text-center shadow-premium', className)}>
        <div className="text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No results found</p>
          <p className="text-xs mt-1 text-slate-400">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100/60 overflow-hidden shadow-premium', className)}>
      {/* Header with Search */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-slate-100/80 flex items-center gap-4 bg-slate-50/30">
          {searchable && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/15 focus:border-gold/40 transition-all duration-300 placeholder:text-slate-300"
              />
            </div>
          )}
          {filterable && (
            <button className="px-4 py-2.5 text-sm text-slate-500 hover:text-navy bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-premium">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    'px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em]',
                    column.sortable && 'cursor-pointer hover:text-gold transition-colors duration-200'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && (
                      <ArrowUpDown className={cn(
                        'w-3 h-3 transition-all duration-200',
                        sortColumn === column.key ? 'text-gold opacity-100' : 'opacity-30'
                      )} />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {filteredAndSortedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  'transition-all duration-200 group',
                  onRowClick && 'cursor-pointer hover:bg-slate-50/80'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key as string} className="px-6 py-4 text-sm text-slate-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
