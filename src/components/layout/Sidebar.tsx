import React from 'react';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Calculator, Calendar as CalendarIcon, Users, User,
  ChevronDown, BookMarked, Receipt, Book, FileText, CheckCircle2, ChevronRight, GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'courses', label: 'Courses', icon: BookOpen, subItems: [
    { id: 'registered-courses', label: 'Registered', icon: Book },
    { id: 'completed-courses', label: 'Completed', icon: CheckCircle2 },
    { id: 'available-courses', label: 'Enrollment', icon: BookMarked }
  ]},
  { id: 'accounts', label: 'Accounts', icon: Calculator, subItems: [
    { id: 'statement', label: 'Statement', icon: Receipt }
  ]},
  { id: 'schedule', label: 'Schedule', icon: CalendarIcon, subItems: [
    { id: 'class-schedule', label: 'Class Schedule', icon: CalendarIcon }
  ]},
  { id: 'teachers', label: 'Related Teachers', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const { 
    activeTab, setActiveTab, 
    expandedMenus, toggleMenu, 
    isSidebarCollapsed, setIsSidebarCollapsed,
    isMobileMenuOpen, setIsMobileMenuOpen
  } = useAppStore();

  const handleNavClick = (id: string, isParent: boolean = false) => {
    if (isParent) {
       toggleMenu(id);
    } else {
       setActiveTab(id);
       setIsMobileMenuOpen(false);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 md:px-8 mt-2 md:mt-4 shrink-0 flex items-center justify-between">
        <div className={clsx("flex items-center gap-3", isSidebarCollapsed && "md:hidden")}>
          <div className="w-10 h-10 bg-[#8c1515] dark:bg-[#ef4444] rounded-xl flex items-center justify-center shadow-lg shadow-[#8c1515]/20 shrink-0">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="font-black text-xl tracking-tight text-stone-900 dark:text-white leading-none">
             Sims<span className="text-[#8c1515] dark:text-[#ef4444]">.</span>
          </div>
        </div>
        {/* Toggle Collapse Desktop */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-2 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
           {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 md:px-6 pb-20 space-y-2 relative no-scrollbar">
        {NAVIGATION_ITEMS.map((item) => {
          const isExpanded = expandedMenus[item.id];
          const hasSubs = !!item.subItems;
          const isActive = activeTab === item.id || (hasSubs && item.subItems?.some(s => s.id === activeTab));
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative">
              <button 
                onClick={() => handleNavClick(item.id, hasSubs)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group",
                  isActive 
                    ? "bg-white dark:bg-stone-900 text-[#8c1515] dark:text-[#ef4444] shadow-sm border border-stone-200/50 dark:border-stone-800/50" 
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/50 hover:text-stone-900 dark:hover:text-white",
                  isSidebarCollapsed && "md:justify-center md:px-0"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                 <Icon className={clsx(
                   "w-5 h-5 shrink-0 transition-colors",
                   isActive ? "text-[#8c1515] dark:text-[#ef4444]" : "group-hover:text-stone-900 dark:group-hover:text-white"
                 )} />
                 {!isSidebarCollapsed && (
                   <span className="flex-1 text-left text-sm whitespace-nowrap">{item.label}</span>
                 )}
                 {!isSidebarCollapsed && hasSubs && (
                   <div className={clsx(
                     "w-5 h-5 flex items-center justify-center rounded bg-stone-100 dark:bg-stone-800 transition-transform text-stone-500",
                     isExpanded && "rotate-180"
                   )}>
                     <ChevronDown className="w-3 h-3" />
                   </div>
                 )}
              </button>

              {/* Sub items */}
              {!isSidebarCollapsed && hasSubs && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-2 pl-12 pr-4 space-y-1 relative before:absolute before:left-[1.65rem] before:top-2 before:bottom-2 before:w-px before:bg-stone-200 dark:before:bg-stone-800">
                        {item.subItems?.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id)}
                            className={clsx(
                              "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all block truncate relative",
                              activeTab === sub.id 
                                ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white" 
                                : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800/50"
                            )}
                          >
                             {activeTab === sub.id && (
                               <div className="absolute left-[-1.15rem] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8c1515] dark:bg-[#ef4444] z-10" />
                             )}
                             {sub.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="lg:hidden fixed inset-y-0 left-0 w-72 bg-[#f8f7f5] dark:bg-[#0a0a0a] border-r border-[#e5e5e5] dark:border-[#1a1a1a] z-50 shadow-2xl"
        >
          {navContent}
        </motion.aside>
      </AnimatePresence>

      {/* Desktop Sidebar Container - keeps layout spacing */}
      <div className={clsx(
        "hidden lg:block shrink-0 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[100px]" : "w-[280px]"
      )} />

      {/* Desktop Sidebar Fixed */}
      <aside className={clsx(
        "hidden lg:block fixed inset-y-0 left-0 bg-[#fbfaf9] dark:bg-[#0f0f0f] border-r border-stone-200 dark:border-stone-800 z-30 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[100px]" : "w-[280px]"
      )}>
        {navContent}
      </aside>
    </>
  );
};
