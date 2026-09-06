import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, LogOut, CheckCircle2, AlertCircle, Info, Calendar, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortalLogic } from '../../hooks/usePortalLogic';
import { useAppStore } from '../../store';
import { getNavItems } from '../../data/navData';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface TopNavProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function TopNav({ portal }: TopNavProps) {
  const { store, toggleDarkMode, profilePic, student } = portal;
  const appStore = useAppStore();
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
          <PWAInstallButton className="hidden sm:inline-flex" />

          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors" title="Toggle Dark Mode">
            {store.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!store.isAdmin && (
            <button 
              onClick={() => portal.setIsSyncModalOpen(true)} 
              className={`p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors relative flex items-center justify-center ${portal.isSyncing ? 'text-[#8c1515] dark:text-[#ef4444]' : ''}`} 
              title="Sync with Presidency University SIMS"
            >
              <RefreshCw className={`w-5 h-5 ${portal.isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-[#8c1515] text-white dark:bg-[#ef4444]' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500'}`} 
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {!showNotifications && appStore.topNotifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900 border-none inline-block"></span>}
            </button>

            <AnimatePresence>
               {showNotifications && (
                 <>
                   <div className="cursor-pointer fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.15 }}
                     className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200 dark:border-stone-800 z-50 overflow-hidden"
                   >
                      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
                         <h3 className="font-bold text-stone-900 dark:text-white">Notifications</h3>
                         <button onClick={() => appStore.markAllTopNotificationsAsRead()} className="text-xs text-[#8c1515] dark:text-[#ef4444] font-medium hover:underline">Mark all as read</button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800" data-lenis-prevent>
                         {appStore.topNotifications.map(notif => {
                            const Icon = notif.type === 'alert' ? AlertCircle :
                                         notif.type === 'success' ? CheckCircle2 :
                                         notif.type === 'info' ? Info : Calendar;
                            return (
                               <div key={notif.id} onClick={() => appStore.removeTopNotification(notif.id)} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 cursor-pointer group">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 ${notif.color}`}>
                                     <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <h4 className={`font-bold text-sm transition-colors ${notif.read ? 'text-stone-500' : 'text-stone-900 dark:text-white group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444]'}`}>{notif.title}</h4>
                                     <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">{notif.desc}</p>
                                     <span className="text-xs text-stone-400 mt-2 block font-medium">{notif.time}</span>
                                  </div>
                               </div>
                            )
                         })}
                             {appStore.topNotifications.length === 0 && (
                               <div className="p-6 text-center text-stone-500 text-sm">No new notifications</div>
                             )}
                      </div>
                      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-center">
                         <button className="text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">View All Notifications</button>
                      </div>
                          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
                             <button onClick={() => appStore.clearAllTopNotifications()} className="w-full py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">Clear All</button>
                          </div>
                       </motion.div>
                 </>
               )}
            </AnimatePresence>
          </div>
          
          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 mx-2" />
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors pr-2 cursor-pointer">
               <img src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${student?.name || 'Student'}`} onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student?.name || 'Student'}` }} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
               <div className="hidden sm:block text-left mr-2">
                 <p className="text-sm font-bold text-stone-700 dark:text-stone-200 leading-tight">{store.isAdmin ? 'Dr. Sarah Connor' : (student?.name || 'Student')}</p>
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
