import React from 'react';
import { useAppStore } from '../../store';
import { LogOut, Sun, Moon, Book, FileText, Calendar, Users, DollarSign, BookMarked, Settings, Clock, User } from 'lucide-react';
import { getStudentData } from '../../data';

import { ProxyImage } from '../ProxyImage';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const Header: React.FC = () => {
  const { 
    isDarkMode, setIsDarkMode, 
    is24HourFormat, setIs24HourFormat, 
    setIsMobileMenuOpen,
    profilePic, setProfilePic,
    currentStudentId
  } = useAppStore();

  const student = getStudentData(currentStudentId).profile;

  return (
    <header className="h-20 lg:h-24 sticky top-0 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50 z-20 flex items-center justify-between px-6 lg:px-10 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="lg:hidden p-2.5 -ml-2.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-xl transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div>
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 hidden sm:block mb-0.5">{getGreeting()},</h2>
          <div className="font-extrabold text-stone-900 dark:text-white text-lg tracking-tight leading-none">{student.name}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <button 
            onClick={() => setIs24HourFormat(!is24HourFormat)}
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors shadow-sm"
          >
            {is24HourFormat ? '24hr' : '12hr'}
          </button>
        </div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="w-10 h-10 flex flex-col items-center justify-center rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all shadow-sm"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-stone-200 dark:bg-stone-800 mx-1 hidden sm:block"></div>

        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none mb-1">ID</div>
            <div className="font-mono text-sm font-bold text-stone-900 dark:text-white leading-none">{student.id}</div>
          </div>
          <div className="relative">
            <ProxyImage 
               src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
               fallbackSrc={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
               alt={student.name} 
               className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shadow-sm ring-2 ring-stone-100 dark:ring-stone-800"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-stone-950 rounded-full"></div>
          </div>
        </button>
      </div>
    </header>
  );
};
