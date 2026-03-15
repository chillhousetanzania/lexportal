import React from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../ui';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: 'bg-white border-emerald-200/80 text-emerald-800 shadow-[0_4px_14px_rgba(16,185,129,0.1)]',
    error: 'bg-white border-red-200/80 text-red-800 shadow-[0_4px_14px_rgba(239,68,68,0.1)]',
    warning: 'bg-white border-amber-200/80 text-amber-800 shadow-[0_4px_14px_rgba(245,158,11,0.1)]',
    info: 'bg-white border-blue-200/80 text-blue-800 shadow-[0_4px_14px_rgba(59,130,246,0.1)]',
  };

  const iconColorMap = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 max-w-sm">
      {notifications.map(notification => {
        const Icon = iconMap[notification.type];
        return (
          <div
            key={notification.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm animate-slide-in-right',
              colorMap[notification.type]
            )}
          >
            <div className={cn('shrink-0 mt-0.5', iconColorMap[notification.type])}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium flex-1 leading-relaxed">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
