import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getNavigationItems } from '../../utils/rbac';
import { cn } from '../ui';
import {
  LayoutDashboard, Users, Briefcase, DollarSign, BarChart3, FileText,
  LogOut, ChevronLeft, ChevronRight, Menu,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Briefcase, DollarSign, BarChart3, FileText,
};

export const Navigation: React.FC = () => {
  const { authState, logout, currentPage, setCurrentPage } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!authState.user) return null;

  const navItems = getNavigationItems(authState.user.role);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={cn('h-16 flex items-center gap-3 border-b border-slate-200 bg-white shadow-sm', collapsed ? 'px-3 justify-center' : 'px-6')}>
        <div className="h-9 w-9 bg-navy rounded-xl flex items-center justify-center text-gold shadow-lg shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        {!collapsed && (
          <h1 className="text-sm font-black text-navy uppercase tracking-tighter leading-none">
            LexPortal
            <br />
            <span className="text-[9px] text-gold tracking-widest font-bold">ENTERPRISE</span>
          </h1>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
        {navItems.map(item => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = currentPage === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                setCurrentPage(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                'w-full text-left flex items-center gap-3 transition-all group',
                collapsed ? 'px-3 py-3 justify-center' : 'px-6 py-3',
                isActive
                  ? 'bg-slate-100 border-r-4 border-gold text-gold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-gold' : 'text-slate-400 group-hover:text-navy')} />
              {!collapsed && <span className="text-xs font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn('border-t border-slate-200 bg-white', collapsed ? 'p-2' : 'p-4')}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 bg-navy text-gold rounded-full flex items-center justify-center text-sm font-bold border border-gold/20 shadow-inner shrink-0">
              {authState.user?.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-navy leading-none truncate">{authState.user?.name}</p>
              <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">{authState.user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50',
            collapsed ? 'p-2 mx-auto' : 'px-3 py-2 w-full'
          )}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-navy shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
      >
        <Menu className="w-5 h-5 text-navy" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-50 z-50 flex flex-col border-r border-slate-200 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col h-full bg-slate-50 border-r border-slate-200 shadow-inner relative shrink-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <NavContent />
      </div>
    </>
  );
};
