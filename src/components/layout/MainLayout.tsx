import React from 'react';
import { Navigation } from './Navigation';
import { NotificationContainer } from '../shared/NotificationContainer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-grey-light overflow-hidden font-inter">
      <Navigation />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
};
