import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { 
  Home, User, BookOpen, Calendar, Wallet, Users, ChevronRight, ChevronDown, BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '../desktop/navData';

interface SidebarProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function Sidebar({ portal }: SidebarProps) {
  const { store, handleNavClick } = portal;
  const { activeTab, expandedMenus, isSidebarCollapsed } = store;

  return (
    <aside 
      className={cn(
        "h-[100dvh] bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0 transition-all duration-300 relative",
        isSidebarCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      <div className={cn(
        "p-5 border-b border-stone-100 dark:border-stone-800 flex items-center h-20 shrink-0",
        isSidebarCollapsed ? "justify-center" : "gap-3"
      )}>
        <img 
          src="https://wsrv.nl/?url=http://www.sims.pu.edu.bd/img/layout/header_logo.png&output=webp" 
          alt="PU" 
          className="h-9 w-auto object-contain shrink-0 dark:brightness-200 dark:grayscale" 
        />
        {!isSidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <h1 className="font-bold text-stone-900 dark:text-white leading-none text-lg">Presidency</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8c1515] dark:text-[#ef4444] font-bold mt-0.5">University</p>
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full py-4 px-3 flex flex-col gap-1 hide-scrollbar" data-lenis-prevent>
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.subItems && item.subItems.some(s => s.id === activeTab));
          const isExpanded = expandedMenus[item.id];
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => handleNavClick(item)}
                className={cn(
                  "w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all group",
                  isActive 
                    ? "bg-[#8c1515] text-white shadow-md shadow-[#8c1515]/20" 
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50 hover:text-stone-900 dark:hover:text-stone-200"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "")} />
                  {!isSidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                </div>
                {!isSidebarCollapsed && item.subItems && (
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "", isActive ? "text-white/80" : "text-stone-400")} />
                )}
              </button>

              <AnimatePresence>
                {!isSidebarCollapsed && isExpanded && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 mt-1 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-stone-200 dark:before:bg-stone-800">
                      {item.subItems.map(subItem => (
                        <button
                          key={subItem.id}
                          onClick={() => portal.handleSubItemClick(subItem.id)}
                          className={cn(
                            "w-full text-left pl-10 pr-3 py-2 rounded-lg text-sm transition-colors relative",
                            activeTab === subItem.id
                              ? "text-[#8c1515] dark:text-[#ef4444] font-medium bg-stone-50 dark:bg-stone-800/50"
                              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                          )}
                        >
                          <span className={cn(
                            "absolute left-[1.18rem] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full",
                            activeTab === subItem.id ? "bg-[#8c1515] dark:bg-[#ef4444]" : "bg-stone-300 dark:bg-stone-600"
                          )} />
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-stone-100 dark:border-stone-800">
         <button 
           onClick={() => store.setIsSidebarCollapsed(!isSidebarCollapsed)}
           className="w-full flex justify-center py-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
         >
           <ChevronRight className={cn("w-5 h-5 transition-transform", !isSidebarCollapsed ? "rotate-180" : "")} />
         </button>
      </div>
    </aside>
  );
}
