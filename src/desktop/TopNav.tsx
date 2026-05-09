import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { navItems } from './navData';

interface TopNavProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function TopNav({ portal }: TopNavProps) {
  const { store, toggleDarkMode, profilePic } = portal;
  
  const pageTitle = navItems.find(n => n.id === store.activeTab)?.label || 
                    navItems.flatMap(n => n.subItems || []).find(s => s.id === store.activeTab)?.label;

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 z-10 sticky top-0">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-4 py-2 w-64 border border-stone-200 dark:border-stone-700 focus-within:ring-2 focus-within:ring-[#8c1515]/20 focus-within:border-[#8c1515] transition-all">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search portal..." 
            className="bg-transparent border-none outline-none text-sm w-full text-stone-700 dark:text-stone-300 placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors">
            {store.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900"></span>
          </button>
          
          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 mx-2" />
          
          <button className="flex items-center gap-3 hover:opacity-80 transition-opacity rounded-full p-1 border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
            <img src={profilePic} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm bg-stone-100" />
            <div className="hidden sm:block text-left mr-2">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200 leading-tight">Ibrahim</p>
              <p className="text-xs text-stone-500">Student</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
