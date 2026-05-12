import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, LogOut, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { getNavItems } from './navData';

const NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Tuition Fee Due', desc: 'Fall 2026 tuition fee is due in 3 days.', time: '2 hours ago', icon: AlertCircle, color: 'text-amber-500' },
  { id: 2, type: 'success', title: 'Grade Posted', desc: 'Your final grade for CSE-305 has been posted.', time: '5 hours ago', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 3, type: 'info', title: 'New Course Material', desc: 'Dr. Rahman uploaded "Chapter 4 Notes".', time: '1 day ago', icon: Info, color: 'text-blue-500' },
  { id: 4, type: 'event', title: 'Robotics Club Meeting', desc: 'Tomorrow at 4:00 PM in Room 301.', time: '1 day ago', icon: Calendar, color: 'text-indigo-500' },
];

interface TopNavProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function TopNav({ portal }: TopNavProps) {
  const { store, toggleDarkMode, profilePic } = portal;
  const [showNotifications, setShowNotifications] = useState(false);
  
  const currentNavItems = getNavItems(store.isAdmin);
  const pageTitle = currentNavItems.find(n => n.id === store.activeTab)?.label || 
                    currentNavItems.flatMap(n => n.subItems || []).find(s => s.id === store.activeTab)?.label;

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 z-50 sticky top-0 print:hidden relative">
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
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors" title="Toggle Dark Mode">
            {store.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-[#8c1515] text-white dark:bg-[#ef4444]' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500'}`} 
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {!showNotifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900 border-none inline-block"></span>}
            </button>

            <AnimatePresence>
               {showNotifications && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.15 }}
                     className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200 dark:border-stone-800 z-50 overflow-hidden"
                   >
                      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
                         <h3 className="font-bold text-stone-900 dark:text-white">Notifications</h3>
                         <button className="text-xs text-[#8c1515] dark:text-[#ef4444] font-medium hover:underline">Mark all as read</button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                         {NOTIFICATIONS.map(notif => {
                            const Icon = notif.icon;
                            return (
                               <div key={notif.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 cursor-pointer group">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 ${notif.color}`}>
                                     <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors">{notif.title}</h4>
                                     <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">{notif.desc}</p>
                                     <span className="text-xs text-stone-400 mt-2 block font-medium">{notif.time}</span>
                                  </div>
                               </div>
                            )
                         })}
                      </div>
                      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-center">
                         <button className="text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">View All Notifications</button>
                      </div>
                   </motion.div>
                 </>
               )}
            </AnimatePresence>
          </div>
          
          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 mx-2" />
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors pr-2 cursor-pointer">
               <img src={profilePic} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
               <div className="hidden sm:block text-left mr-2">
                 <p className="text-sm font-bold text-stone-700 dark:text-stone-200 leading-tight">{store.isAdmin ? 'Dr. Sarah Connor' : 'Ibrahim'}</p>
                 <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{store.isAdmin ? 'Administrator' : 'Student'}</p>
               </div>
             </div>
             <button onClick={() => store.setIsLoggedIn(false)} className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-stone-400 transition-colors" title="Sign Out">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
