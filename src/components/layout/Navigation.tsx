import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getNavigationItems } from '../../utils/rbac';
import { cn } from '../ui';
import {
  LayoutDashboard, Users, Briefcase, Banknote, BarChart3, FileText,
  LogOut, ChevronLeft, ChevronRight, Menu, Scale, X
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Briefcase, Banknote, BarChart3, FileText,
};

export const Navigation: React.FC = () => {
  const { authState, logout, currentPage, setCurrentPage } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!authState.user) return null;

  const navItems = getNavigationItems(authState.user.role);

  const NavContent = () => (
    <>
      {/* LexPortal Logo */}
      <div className={cn(
        'h-[72px] flex items-center gap-3 border-b border-white/5 shrink-0',
        collapsed ? 'px-3 justify-center' : 'px-5'
      )}>
        <div className="h-10 w-10 gradient-gold rounded-xl flex items-center justify-center shadow-gold shrink-0">
          <Scale className="w-5 h-5 text-navy-dark" />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <h1 className="text-sm font-black text-white leading-none tracking-tight">
              LexPortal
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Legacy Law Firm</span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar px-2.5">
        <div className="space-y-1">
          {navItems.map((item, index) => {
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
                  'w-full text-left flex items-center transition-all duration-300 group relative rounded-xl',
                  collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                  isActive
                    ? 'bg-white/10 text-gold shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
                style={{ animationDelay: `${index * 0.03}s` }}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-6 gradient-gold rounded-r-full shadow-gold transition-all duration-300" />
                )}
                <Icon className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-all duration-300',
                  isActive ? 'text-gold' : 'text-slate-500 group-hover:text-white'
                )} />
                {!collapsed && (
                  <span className={cn(
                    'text-[13px] font-medium ml-3 transition-all duration-300',
                    isActive ? 'text-white font-semibold' : ''
                  )}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className={cn('border-t border-white/5 shrink-0', collapsed ? 'p-2' : 'p-4')}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-9 w-9 rounded-xl gradient-gold flex items-center justify-center text-xs font-extrabold text-navy-dark shrink-0 shadow-gold">
              {authState.user?.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-none truncate">{authState.user?.name}</p>
              <p className="text-[10px] text-gold/70 capitalize mt-1 font-medium tracking-wide">{authState.user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-2 text-slate-500 hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-500/10',
            collapsed ? 'p-2.5 mx-auto' : 'px-4 py-2.5 w-full'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-xs font-semibold">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 bg-navy-light border border-white/10 rounded-full items-center justify-center text-slate-400 hover:text-gold hover:border-gold/40 hover:shadow-gold transition-all duration-300 hover:scale-110 z-20"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-navy rounded-xl shadow-navy border border-white/10 hover:border-gold/30 transition-all duration-300"
      >
        <Menu className="w-5 h-5 text-gold" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-72 gradient-navy z-50 flex flex-col border-r border-white/5 transition-transform duration-300 shadow-premium-lg',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col h-full gradient-navy border-r border-white/5 relative shrink-0 transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[260px]'
        )}
      >
        <NavContent />
      </div>
    </>
  );
};
