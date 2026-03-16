import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../ui';
import {
  Home, Users, Banknote, BarChart3, Briefcase, FileText, ChevronRight,
  Search, Bell, HelpCircle, ChevronDown, LogOut, Settings
} from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  icon?: React.FC<{ className?: string }>;
  href?: string;
}

const getBreadcrumbs = (currentPage: string): BreadcrumbItem[] => {
  const base = [{ label: 'Home', icon: Home, href: 'dashboard' }];

  switch (currentPage) {
    case 'dashboard':
      return [base[0]];
    case 'cases':
      return [...base, { label: 'eCase Filing', icon: Briefcase }];
    case 'my-cases':
      return [...base, { label: 'My Cases', icon: FileText }];
    case 'users':
      return [...base, { label: 'User Management', icon: Users }];
    case 'financials':
      return [...base, { label: 'Financial Records', icon: Banknote }];
    case 'analytics':
      return [...base, { label: 'Analytics', icon: BarChart3 }];
    case 'reports':
    case 'resources':
      return [...base, { label: 'Reports & Resources', icon: FileText }];
    default:
      return base;
  }
};

export const Topbar: React.FC = () => {
  const { authState, setCurrentPage, currentPage, addNotification, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const breadcrumbs = getBreadcrumbs(currentPage);
  const user = authState.user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addNotification('info', `Searching for: ${searchQuery}`);
    }
  };

  const notifications = [
    { id: 1, title: 'New case assigned', message: 'LEX-2024-001 has been assigned to you', time: '2 hours ago', read: false },
    { id: 2, title: 'Document uploaded', message: 'Supporting documents for LEX-2024-002', time: '5 hours ago', read: false },
    { id: 3, title: 'System update', message: 'Scheduled maintenance tonight at 11 PM', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Breadcrumbs */}
          <nav className="flex items-center space-x-1.5">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                )}
                <button
                  onClick={() => item.href && setCurrentPage(item.href)}
                  className={cn(
                    'flex items-center space-x-1.5 px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200',
                    index === breadcrumbs.length - 1
                      ? 'text-navy font-black'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                  )}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border-2 border-slate-400/50 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-gold/20 focus:border-gold focus:bg-white w-64 transition-all duration-300 placeholder:text-slate-500 font-black shadow-sm"
                />
              </div>
            </form>

            {/* Help */}
            <button className="p-2 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-xl transition-all duration-200">
              <HelpCircle className="w-[18px] h-[18px]" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="p-2 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-xl transition-all duration-200 relative"
              >
                <Bell className="w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-premium-lg border border-slate-100/60 z-50 animate-scale-in overflow-hidden">
                  <div className="p-4 border-b border-slate-100/60 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-navy">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors duration-200',
                          !notification.read && 'bg-gold/[0.03]'
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            notification.read ? 'bg-slate-200' : 'bg-gold shadow-gold'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-navy">{notification.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200/60 mx-1" />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                <div className="w-8 h-8 gradient-gold rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-xs font-extrabold text-navy-dark">{user?.name?.[0]}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-bold text-navy leading-none">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize mt-1 font-bold tracking-tight">{user?.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-premium-lg border border-slate-100/60 z-50 animate-scale-in overflow-hidden">
                  <div className="p-4 gradient-navy text-white">
                    <p className="text-sm font-black">{user?.name}</p>
                    <p className="text-xs text-slate-300 mt-1 font-bold">{user?.email}</p>
                    <span className="inline-block mt-3 text-[10px] font-black text-navy bg-gold px-3 py-1 rounded-full capitalize shadow-gold"> {user?.role}</span>
                  </div>
                  <div className="py-1.5">
                    <button className="w-full px-4 py-2.5 text-sm text-left text-slate-600 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors duration-200">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Settings</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2.5 text-sm text-left text-red-500 hover:bg-red-50 flex items-center space-x-2.5 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
