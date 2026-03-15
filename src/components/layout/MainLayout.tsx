import React from 'react';
import { Navigation } from './Navigation';
import { Topbar } from './Topbar';
import { NotificationContainer } from '../shared/NotificationContainer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden font-inter">
      <Navigation />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto gradient-surface">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
};
