import React from 'react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { AccountsView } from './views/AccountsView';
import { CoursesView } from './views/CoursesView';
import { ScheduleView } from './views/ScheduleView';

interface DesktopLayoutProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function DesktopLayout(portal: ReturnType<typeof usePortalLogic>) {
  const { store } = portal;

  const renderContent = () => {
    switch (store.activeTab) {
      case 'home': return <HomeView portal={portal} />;
      case 'profile': return <ProfileView portal={portal} />;
      case 'bank-slips':
      case 'statement': return <AccountsView portal={portal} />;
      case 'registered-courses':
      case 'completed-courses':
      case 'available-courses': return <CoursesView portal={portal} />;
      case 'class-schedule': return <ScheduleView portal={portal} />;
      default: return <div className="p-8 text-stone-500">View under construction.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f9fafb] dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 overflow-hidden">
      <Sidebar portal={portal} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav portal={portal} />
        <main className="flex-1 overflow-y-auto p-8 hide-scrollbar" data-lenis-prevent>
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
