import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, User, BookOpen, Calendar, Wallet, Users, Bell, 
  ChevronRight, ChevronLeft, ChevronDown, CheckCircle2,
  GraduationCap, Clock, MapPin, Menu, AlertCircle, BookMarked, Search, Moon, Info, Sun, Camera,
  TrendingDown, TrendingUp, FileText, X, Mail, Phone, KeyRound, Edit3, LogOut, RefreshCw, Loader2, BarChart3
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { 
  REGISTERED_COURSES, COMPLETED_COURSES, AVAILABLE_COURSES,
  SCHEDULE_DATA, TRANSACTIONS_DATA, FEES_LIST,
  Course
} from '../../data';
import { getNavItems } from '../../data/navData';
import { ScheduleWeeklyView } from '../../views/ScheduleWeeklyView';
import { ScheduleTable } from '../ScheduleTable';
import { DegreeAuditView } from '../../views/DegreeAuditView';
import { GradesView } from '../../views/GradesView';
import { ExamsView } from '../../views/ExamsView';
import { StatementView } from '../../views/StatementView';
import { AdmitCardView } from '../../views/AdmitCardView';
import { AcademicCalendarView } from '../../views/AcademicCalendarView';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { ExamCountdownWidget } from '../ExamCountdownWidget';
import { BankSlipsView } from '../../views/BankSlipsView';
import { CompletedCoursesView } from '../../views/CompletedCoursesView';
import { AdminDashboardView } from '../../views/admin/AdminDashboardView';
import { AdminStudentRecordsView } from '../../views/admin/AdminStudentRecordsView';
import { AdminCourseManagementView } from '../../views/admin/AdminCourseManagementView';
import { AdminGradeManagementView } from '../../views/admin/AdminGradeManagementView';
import { AdminEnrollmentApprovalsView } from '../../views/admin/AdminEnrollmentApprovalsView';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { haptics } from '../../utils/haptics';


type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: { id: string; label: string; icon?: React.ElementType }[];
};

// Simple format time utility
const formatTime = (timeString: string, is24HourFormat: boolean) => {
  if (!timeString) return "";
  const [hoursStr, minutesStr] = timeString.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  
  if (is24HourFormat) {
    return `${hoursStr.padStart(2, '0')}:${minutes}`;
  }
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  return `${hours}:${minutes} ${ampm}`;
};

// UI Components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden transition-colors transform-gpu ${className}`}>
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode, variant?: "default" | "success" | "danger" | "warning" | "outline" | "brand", className?: string }> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    danger: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    outline: "bg-transparent border border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-400",
    brand: "bg-[#8c1515]/10 text-[#8c1515] border border-[#8c1515]/20 dark:bg-[#8c1515]/20 dark:text-[#ef4444] dark:border-[#8c1515]/40"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

import { useAppStore } from '../../store';

import { usePortalLogic } from '../../hooks/usePortalLogic';
export function MobileLayout(props: ReturnType<typeof usePortalLogic>) {
  const {
    store, is24HourFormat, setIs24HourFormat, profilePic,
    toggleDarkMode, registeredCourses, completedCourses,
    registerError, isSelectionLocked, setIsSelectionLocked, isConfirmRegistrationOpen, setIsConfirmRegistrationOpen,
    pendingCoreqCourse, isCoreqModalOpen, setIsCoreqModalOpen,
    courseSearchQuery, setCourseSearchQuery, courseDeptFilter, setCourseDeptFilter,
    courseCreditFilter, setCourseCreditFilter, coursePrereqFilter, setCoursePrereqFilter,
    courseSortBy, setCourseSortBy, scheduleCourseFilter, setScheduleCourseFilter,
    scheduleDayFilter, setScheduleDayFilter, student, studentData, selectedFees, toggleFee,
    bankSlipTotal, isBankSlipSuccess, isConfirmPaymentOpen, setIsConfirmPaymentOpen,
    handleBankSlipSubmitClick, handleConfirmPayment, filteredSchedule, groupedSchedule,
    groupedCompletedCourses, filteredAvailableCourses, totalDebit, totalCredit, statementChartData,
    handleMenuToggle, handleNavClick, handleSubItemClick,
    handleRegister, confirmCoreqsRegistration, handleDropCourse, hasCompletedPrerequisites, setSelectedFees, setPendingCoreqCourse,
    isSyncModalOpen, setIsSyncModalOpen, isSyncing
  } = props;
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<Course | null>(null);
  const [courseToDrop, setCourseToDrop] = useState<string | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const { activeTab, setActiveTab, expandedMenus, isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isDarkMode, isAdmin } = store;

  const confirmDrop = () => {
    if (courseToDrop) {
      handleDropCourse(courseToDrop);
      setCourseToDrop(null);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('Password has been successfully updated.');
    setIsPasswordOpen(false);
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  const currentNavItems = getNavItems(isAdmin);
  const currentTabParent = currentNavItems.find(n => n.id === activeTab || n.subItems?.some(s => s.id === activeTab));
  const pageTitle = currentNavItems.find(n => n.id === activeTab)?.label || 
                    currentNavItems.flatMap(n => n.subItems || []).find(s => s.id === activeTab)?.label;

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-stone-950 font-sans selection:bg-[#8c1515]/20 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row">
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="cursor-pointer fixed inset-0 bg-stone-900/40 dark:bg-black/60 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-[100dvh] bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0 shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 md:z-20 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px] md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-[88px]' : 'md:w-[280px]'}`}
      >
        <div className={`p-6 border-b border-stone-100 dark:border-stone-800 flex items-center relative h-20 shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
          {!isSidebarCollapsed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <img src="/icon.svg" alt="UniPortal" className="h-10 w-10 object-contain rounded-xl shadow-xs shrink-0" />
              <div className="font-black text-xl tracking-tight text-stone-900 dark:text-white leading-none">
                Sims<span className="text-[#8c1515] dark:text-[#ef4444]">.</span>
              </div>
            </motion.div>
          ) : (
            <img src="/icon.svg" alt="UniPortal" className="h-10 w-10 object-contain rounded-xl shadow-xs shrink-0" />
          )}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm z-30 transition-all hover:scale-105"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        
        <div className={`flex-1 overflow-y-auto py-6 space-y-1 scrollbar-hide ${isSidebarCollapsed ? 'px-3' : 'px-4'}`} data-lenis-prevent>
          {!isSidebarCollapsed && <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3 px-3">Menu</div>}
          
          {currentNavItems.map(item => {
            const isParentActive = activeTab === item.id || item.subItems?.some(s => s.id === activeTab);
            const isExpanded = expandedMenus[item.id];

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleNavClick(item)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between rounded-xl text-sm font-medium transition-all group ${
                    isParentActive && !item.subItems 
                      ? 'bg-[#8c1515] dark:bg-[#8c1515]/90 text-white shadow-md shadow-[#8c1515]/20' 
                      : isParentActive ? 'bg-stone-50 dark:bg-stone-800/50 text-[#8c1515] dark:text-[#ef4444]' 
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-stone-900 dark:hover:text-stone-200'
                  } ${isSidebarCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${(!isParentActive) && 'group-hover:scale-110'} ${isParentActive && !item.subItems ? 'text-white/90' : isParentActive ? 'text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-400 dark:text-stone-500'}`} />
                    {!isSidebarCollapsed && <span className={isParentActive ? 'font-bold' : ''}>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.subItems && (
                     <ChevronDown className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Sub Menu */}
                <AnimatePresence initial={false}>
                  {!isSidebarCollapsed && item.subItems && isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: { 
                          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.25, delay: 0.05 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { 
                          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pl-11 pr-3 py-1 space-y-0.5 mt-1 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-stone-200 dark:before:bg-stone-700">
                        {item.subItems.map(subItem => (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubItemClick(subItem.id)}
                            className={`w-full text-left py-2 px-3 text-[13px] rounded-lg transition-colors flex items-center gap-2 relative ${
                              activeTab === subItem.id 
                                ? 'text-[#8c1515] dark:text-[#ef4444] font-bold bg-[#8c1515]/5 dark:bg-[#ef4444]/10' 
                                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                            }`}
                          >
                            {activeTab === subItem.id && (
                              <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8c1515] dark:bg-[#ef4444]" />
                            )}
                            {subItem.icon && (
                              <subItem.icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                activeTab === subItem.id ? 'text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-400 dark:text-stone-500'
                              }`} />
                            )}
                            <span>{subItem.label}</span>
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
        
        {/* User profile brief */}
        <div className={`m-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 overflow-hidden transition-all shrink-0 ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 mb-3'}`}>
            <img src={profilePic} onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}` }} alt="Profile" className={`rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 object-cover ${isSidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`} />
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-stone-900 dark:text-stone-100 truncate">{isAdmin ? 'Dr. Sarah Connor' : student.name}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate border dark:border-stone-700 bg-white dark:bg-stone-900 px-1.5 rounded w-fit mt-0.5">{isAdmin ? 'Admin' : student.id}</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
               onClick={() => store.setIsLoggedIn(false)}
               className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider py-2 mt-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Sign Out <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Box */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafb] dark:bg-stone-950">
        
        {/* Top Header */}
        <header 
          className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0 print:hidden"
        >
           <div className="flex items-center gap-3">
             <button 
               onClick={() => {
                 haptics.light();
                 setIsMobileMenuOpen(true);
               }} 
               className="md:hidden p-2 -ml-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
             >
               <Menu className="w-5 h-5" />
             </button>
             
             {/* Breadcrumb styling */}
             <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-stone-400 dark:text-stone-500 font-medium">{currentTabParent?.label}</span>
                {currentTabParent?.subItems?.some(s => s.id === activeTab) && (
                  <>
                    <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600" />
                    <span className="text-stone-900 dark:text-stone-100 font-bold">{pageTitle}</span>
                  </>
                )}
             </div>
             
             <h1 className="sm:hidden font-bold text-stone-900 dark:text-white">{pageTitle}</h1>
           </div>

           <div className="flex items-center gap-2 sm:gap-4">
              <PWAInstallButton />

              <div className="hidden lg:flex items-center gap-2 bg-stone-50 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm">
                <Calendar className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                <span className="font-semibold text-stone-700 dark:text-stone-300">{student.currentSemester}</span>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 relative transition-colors"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {!isAdmin && (
                <button 
                  onClick={() => setIsSyncModalOpen(true)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 relative transition-colors ${isSyncing ? 'text-[#8c1515] dark:text-[#ef4444]' : ''}`}
                  title="Sync with Presidency University SIMS"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              )}

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full relative transition-colors ${showNotifications ? 'bg-[#8c1515] text-white dark:bg-[#ef4444]' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400'}`}
                >
                  <Bell className="w-5 h-5" />
                  {!showNotifications && store.topNotifications.some(n => !n.read) && <span className="absolute top-2 right-2 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900 border-none inline-block"></span>}
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
                             <button onClick={() => store.markAllTopNotificationsAsRead()} className="text-xs text-[#8c1515] dark:text-[#ef4444] font-medium hover:underline">Mark all as read</button>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800" data-lenis-prevent>
                             {store.topNotifications.map(notif => {
                                const Icon = notif.type === 'alert' ? AlertCircle :
                                             notif.type === 'success' ? CheckCircle2 :
                                             notif.type === 'info' ? Info : Calendar;
                                return (
                                   <div key={notif.id} onClick={() => store.removeTopNotification(notif.id)} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 cursor-pointer group">
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
                             {store.topNotifications.length === 0 && (
                               <div className="p-6 text-center text-stone-500 text-sm">No new notifications</div>
                             )}
                          </div>
                          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
                             <button onClick={() => store.clearAllTopNotifications()} className="w-full py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">Clear All</button>
                          </div>
                       </motion.div>
                     </>
                   )}
                </AnimatePresence>
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 w-full p-4 md:p-8 relative isolate">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full pb-10"
            >
              
              {/* === ADMIN TABS === */}
              {activeTab === 'admin-dashboard' && <AdminDashboardView />}
              {activeTab === 'student-records' && <AdminStudentRecordsView />}
              {activeTab === 'course-management' && <AdminCourseManagementView />}
              {activeTab === 'grade-submissions' && <AdminGradeManagementView />}
              {activeTab === 'enrollment-approvals' && <AdminEnrollmentApprovalsView />}

              {/* === HOME TAB === */}
              {activeTab === 'home' && (
                <div className="space-y-6 md:space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">Welcome, {student.name}</h2>
                      <p className="text-stone-500 dark:text-stone-400 mt-1">Here is what's happening with your academics today.</p>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <ExamCountdownWidget portalExams={studentData?.exams} />
                  </motion.div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="p-5 md:p-6 bg-white dark:bg-stone-900 relative group border-stone-200 dark:border-stone-800">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Current CGPA</div>
                      <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.cgpa.toFixed(2)}</div>
                    </Card>
                    <Card className="p-5 md:p-6 bg-white dark:bg-stone-900 relative group border-stone-200 dark:border-stone-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Credits Earned</div>
                      <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.creditsCompleted} <span className="text-base font-semibold text-stone-400 dark:text-stone-600">/ 140</span></div>
                    </Card>
                    <Card className="p-5 md:p-6 bg-white dark:bg-stone-900 relative group border-stone-200 dark:border-stone-800">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                        <BookMarked className="w-5 h-5" />
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Enrolled Courses</div>
                      <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{registeredCourses.length}</div>
                    </Card>
                    <Card className="p-5 md:p-6 bg-white dark:bg-stone-900 relative group border-stone-200 dark:border-stone-800">
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 flex items-center justify-center mb-4 text-[#8c1515] dark:text-[#ef4444]">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Balance</div>
                      <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${student.accountBalance < 0 ? 'text-[#8c1515] dark:text-[#ef4444]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {student.accountBalance > 0 ? '-' : ''}{Math.abs(student.accountBalance).toLocaleString()} <span className="text-base font-semibold opacity-50 tracking-normal">Tk</span>
                      </div>
                      {student.accountBalance > 0 && (
                        <p className="text-xs font-bold text-red-500 mt-2 flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> 
                          <span>Overpaid - Can be refunded</span>
                        </p>
                      )}
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* GPA Trend Card */}
                    {student.gpaHistory && student.gpaHistory.length > 0 && (
                      <Card className="p-0 border-stone-200 col-span-full lg:col-span-2">
                         <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
                            <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                               <TrendingUp className="w-5 h-5 text-indigo-500" /> Academic Progression
                            </h3>
                         </div>
                         <div className="p-6 h-64 w-full min-w-0 min-h-[256px]">
                            <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
                               <AreaChart data={student.gpaHistory}>
                                  <defs>
                                     <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                     </linearGradient>
                                  </defs>
                                  <XAxis dataKey="semester" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#888" />
                                  <YAxis domain={['dataMin - 0.2', 4.0]} hide />
                                  <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1c1917' : '#fff', color: isDarkMode ? '#fff' : '#000', borderRadius: '12px', border: isDarkMode ? '1px solid #292524' : '1px solid #f5f5f4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [v.toFixed(2), 'Semester GPA']} />
                                  <Area type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </Card>
                    )}

                    <Card className="p-0 flex flex-col">
                       <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                        <h3 className="font-bold text-stone-900 dark:text-white">Quick Actions</h3>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveTab('registered-courses')} className="text-left p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-[#8c1515]/30 dark:hover:border-[#ef4444]/30 hover:bg-[#8c1515]/5 dark:hover:bg-[#ef4444]/5 transition-all group">
                          <BookOpen className="w-6 h-6 text-indigo-500 mb-3" />
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">My Courses</h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">View enrolled classes</p>
                        </button>
                        <button onClick={() => setActiveTab('class-schedule')} className="text-left p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-[#8c1515]/30 dark:hover:border-[#ef4444]/30 hover:bg-[#8c1515]/5 dark:hover:bg-[#ef4444]/5 transition-all group">
                          <Calendar className="w-6 h-6 text-amber-500 mb-3" />
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">Class Routine</h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">View weekly schedule</p>
                        </button>
                        <button onClick={() => setActiveTab('profile')} className="text-left p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-[#8c1515]/30 dark:hover:border-[#ef4444]/30 hover:bg-[#8c1515]/5 dark:hover:bg-[#ef4444]/5 transition-all group">
                          <User className="w-6 h-6 text-sky-500 mb-3" />
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">Profile info</h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">View academic status</p>
                        </button>
                        <button onClick={() => setActiveTab('class-distribution')} className="text-left p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-[#8c1515]/30 dark:hover:border-[#ef4444]/30 hover:bg-[#8c1515]/5 dark:hover:bg-[#ef4444]/5 transition-all group">
                          <BarChart3 className="w-6 h-6 text-[#8c1515] dark:text-[#ef4444] mb-3" />
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">Class Metrics</h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">Trimester sessions chart</p>
                        </button>
                      </div>

                      <div className="mt-auto p-6 pt-0">
                         <div className="bg-stone-900 border border-stone-800 text-white p-5 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-stone-700">
                            {/* Animated Gmail Colors Background Blob */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                               <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 rounded-full mix-blend-screen filter blur-[40px] animate-pulse" />
                               <div className="absolute top-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-screen filter blur-[40px] animate-pulse" style={{ animationDelay: '1s' }} />
                               <div className="absolute -bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-screen filter blur-[40px] animate-pulse" style={{ animationDelay: '2s' }} />
                               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500 rounded-full mix-blend-screen filter blur-[40px] animate-pulse" style={{ animationDelay: '3s' }} />
                            </div>
                            
                            {/* Animated Background SVG */}
                            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-700 text-white">
                              <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 mb-2">
                               <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                  </svg>
                               </div>
                               <h4 className="text-base font-bold text-white tracking-tight">University Email</h4>
                            </div>
                            <p className="text-stone-400 text-sm mb-4 relative z-10 w-[85%] font-medium leading-relaxed group-hover:text-stone-300 transition-colors">Access Google Workspace and your exclusive student deals.</p>
                            
                            <button className="text-xs font-bold uppercase tracking-widest text-stone-900 bg-white px-4 py-2.5 rounded-lg relative z-10 inline-flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-all duration-300">
                               Start Now
                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                                 <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                               </svg>
                            </button>
                         </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

               {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-4xl relative">
                  {passwordSuccessMsg && (
                    <div className="absolute top-0 right-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 z-10">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {passwordSuccessMsg}
                    </div>
                  )}

                  <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                    <DialogContent>
                      <form onSubmit={handleChangePassword}>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Ensure your account is using a long, random password to stay secure.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Current Password</label>
                            <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">New Password</label>
                            <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Confirm New Password</label>
                            <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
                          <Button type="submit">Update Password</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <header className="mb-6 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">{pageTitle}</h2>
                      <p className="text-stone-500 dark:text-stone-400 mt-1">Your academic and personal records.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                  </header>
                  
                  <Card className="overflow-hidden">
                    <div className="h-32 md:h-40 bg-stone-100 dark:bg-stone-800 flex items-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-blend-overlay dark:opacity-80 relative border-b border-stone-200 dark:border-stone-800">
                      <div className="absolute -bottom-16 left-8 w-[98px] h-[110px] rounded-[10px] border-4 border-white dark:border-stone-900 bg-stone-100 dark:bg-stone-800 shadow-md overflow-hidden z-10">
                        <img src={profilePic} onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}&backgroundColor=e2e8f0` }} alt="Avatar" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    
                    <div className="pt-20 pb-8 px-6 md:px-8 mt-2 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                         <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.name}</h3>
                         <div className="flex gap-2 items-center mt-2">
                           <Badge variant="outline" className="font-mono bg-stone-50/50 dark:bg-stone-800/50 text-[11px] px-2">ID: {student.id}</Badge>
                           <Badge variant="success" className="capitalize text-[11px] px-2">{student.status}</Badge>
                         </div>
                         
                         <div className="mt-8 space-y-4">
                           <div>
                              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">Program</span>
                             <span className="font-medium text-stone-900 dark:text-stone-100">{student.program}</span>
                           </div>
                           <div>
                             <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">Admission Semester</span>
                             <span className="font-medium text-stone-900 dark:text-stone-100">{student.admissionSemester}</span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="md:border-l md:border-stone-100 dark:md:border-stone-800 md:pl-8 flex flex-col justify-center">
                          <div className="bg-stone-50 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4">
                             <div>
                               <div className="flex justify-between items-end mb-1">
                                 <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">Credits Completed</span>
                                 <span className="font-bold text-stone-900 dark:text-stone-100">{student.creditsCompleted} <span className="text-xs font-medium text-stone-400 dark:text-stone-500">/ 140</span></span>
                               </div>
                               <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(student.creditsCompleted/140)*100}%`}}></div>
                               </div>
                             </div>
                             
                             <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center">
                               <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">Current CGPA</span>
                               <span className="text-2xl font-black text-stone-900 dark:text-white">{student.cgpa.toFixed(2)}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h3 className="font-semibold text-lg mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 rounded-lg shrink-0">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{student.email}</p>
                            <p className="text-xs text-stone-500">University Email</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">+880 17XXXXXXXX</p>
                            <p className="text-xs text-stone-500">Mobile Number</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-semibold text-lg mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg shrink-0">
                            <KeyRound className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Password</p>
                            <p className="text-xs text-stone-500 mb-2">Last changed 3 months ago</p>
                            <button onClick={() => setIsPasswordOpen(true)} className="text-xs font-semibold text-[#8c1515] hover:underline">Change Password</button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* === COURSES: REGISTERED === */}
              {activeTab === 'registered-courses' && (
                <div className="space-y-6">
                  {courseToDrop && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-stone-200 dark:border-stone-800"
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Drop Course</h3>
                          <p className="text-stone-500 dark:text-stone-400">Are you sure you want to drop this course?</p>
                        </div>
                        <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 bg-stone-50 dark:bg-stone-950">
                          <button onClick={() => setCourseToDrop(null)} className="px-4 py-2 text-stone-600 dark:text-stone-300 font-bold text-sm bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors">Cancel</button>
                          <button onClick={confirmDrop} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors">Drop</button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  <header>
                    <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">{pageTitle}</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Courses you are currently enrolled in for {student.currentSemester}.</p>
                  </header>

                  {registeredCourses.length === 0 ? (
                    <Card className="p-12 flex flex-col items-center justify-center text-center bg-stone-50/50 dark:bg-stone-900/50 border-dashed border-2 dark:border-stone-800">
                       <BookMarked className="w-12 h-12 text-stone-300 dark:text-stone-600 mb-4" />
                       <h4 className="text-lg font-bold text-stone-700 dark:text-stone-300">No courses registered</h4>
                       <p className="text-stone-500 dark:text-stone-400 mt-1 max-w-sm">You haven't registered for any classes yet. Head to "Course Enrollment" to add courses.</p>
                       <button onClick={() => setActiveTab("available-courses")} className="mt-6 bg-[#8c1515] dark:bg-[#ef4444] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] transition-all">Go to Enrollment</button>
                    </Card>
                  ) : (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(() => {
                        const bundles: any[] = [];
                        const processed = new Set<string>();

                        registeredCourses.forEach((course) => {
                          if (processed.has(course.code)) return;

                          const labs = registeredCourses.filter((c) => c.corequisites?.includes(course.code));

                          if (course.corequisites?.length && registeredCourses.some((c) => course.corequisites?.includes(c.code))) {
                            return;
                          }

                          if (labs.length > 0) {
                            bundles.push({
                              isBundle: true,
                              main: course,
                              labs: labs,
                              totalCredits: course.credits + labs.reduce((sum: number, l: any) => sum + l.credits, 0),
                            });
                            processed.add(course.code);
                            labs.forEach((l) => processed.add(l.code));
                          } else {
                            bundles.push({ isBundle: false, main: course, labs: [], totalCredits: course.credits });
                            processed.add(course.code);
                          }
                        });
                        
                        return bundles.map((bundle, i) => {
                          const c = bundle.main;

                          if (bundle.isBundle) {
                            const titleMain = c.title;
                            const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

                            return (
                              <Card key={'bundle-' + i} className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                                 <div>
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                       <div className="flex flex-wrap items-center">
                                         <Badge variant="outline" className="font-mono bg-stone-50 dark:bg-stone-950 px-2 py-0.5 text-[10px]">{c.code}</Badge>
                                         {bundle.labs.map((l: any) => (
                                           <React.Fragment key={l.code}>
                                             <span className="font-bold text-stone-400 dark:text-stone-500 mx-1 text-[10px]">x</span>
                                             <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px]">{l.code}</Badge>
                                           </React.Fragment>
                                         ))}
                                       </div>
                                       <span className="text-xs font-bold text-stone-500 dark:text-stone-400 font-mono text-right shrink-0 mt-0.5">T =&gt; {bundle.totalCredits.toFixed(2)} Credits</span>
                                    </div>
                                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug line-clamp-2">
                                      {titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span>
                                    </h4>
                                 </div>
                                 
                                 <div className="flex items-end justify-between mt-4 gap-2">
                                    <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex flex-col gap-0.5">
                                       <span>Sec: <span className="font-bold text-stone-700 dark:text-stone-300">{c.section}</span></span>
                                       <span className="truncate max-w-[120px]" title={c.faculty}>Prof: <span className="font-bold text-stone-700 dark:text-stone-300">{c.faculty}</span></span>
                                    </div>
                                    <div className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold whitespace-nowrap">
                                       ({c.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')}) Credits
                                    </div>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setSelectedSyllabusCourse(c); }}
                                      className="p-1.5 text-stone-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                                      title="View Syllabus"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => setCourseToDrop(c.code)} 
                                      disabled={isSelectionLocked} 
                                      className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors shrink-0 ${isSelectionLocked ? 'bg-stone-50 dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800 cursor-not-allowed' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50'}`}
                                    >
                                      Drop Bundle
                                    </button>
                                 </div>
                              </Card>
                            );
                          }

                          return (
                            <Card key={i} className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                               <div>
                                  <div className="flex justify-between items-start mb-2">
                                     <Badge variant="outline" className="font-mono bg-stone-50 dark:bg-stone-950 px-2 py-0.5 text-[10px]">{c.code}</Badge>
                                     <span className="text-xs font-bold text-stone-500 dark:text-stone-400 font-mono text-right shrink-0 ml-2">{c.credits.toFixed(2)} Credits</span>
                                  </div>
                                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug line-clamp-2" title={c.title}>{c.title}</h4>
                               </div>
                               
                               <div className="flex items-end justify-between mt-4">
                                  <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex flex-col gap-0.5">
                                     <span>Sec: <span className="font-bold text-stone-700 dark:text-stone-300">{c.section}</span></span>
                                     <span className="truncate max-w-[120px]" title={c.faculty}>Prof: <span className="font-bold text-stone-700 dark:text-stone-300">{c.faculty}</span></span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setSelectedSyllabusCourse(c); }}
                                      className="p-1.5 text-stone-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                                      title="View Syllabus"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => setCourseToDrop(c.code)} 
                                    disabled={isSelectionLocked} 
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors shrink-0 ${isSelectionLocked ? 'bg-stone-50 dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800 cursor-not-allowed' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50'}`}
                                  >
                                    Drop
                                  </button>
                                  </div>
                               </div>
                            </Card>
                          );
                        });
                      })()}
                    </div>

                    <div className="mt-6 bg-stone-50 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col gap-2 shadow-sm">
                       <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-xs">Total Credits</span>
                          <span className={`font-black text-2xl ${registeredCourses.reduce((acc, c) => acc + c.credits, 0) < 9 ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>{registeredCourses.reduce((acc, c) => acc + c.credits, 0).toFixed(2)}</span>
                       </div>
                       {registeredCourses.reduce((acc, c) => acc + c.credits, 0) < 9 && (
                         <span className="text-sm font-bold text-red-600 dark:text-red-400 text-right flex items-center justify-end mt-1"><AlertCircle className="w-4 h-4 mr-1.5" /> Minimum 9 credits required.</span>
                       )}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button 
                        onClick={() => {
                          if (!isSelectionLocked) {
                            setIsConfirmRegistrationOpen(true);
                          }
                        }} 
                        disabled={isSelectionLocked || registeredCourses.reduce((acc, c) => acc + c.credits, 0) < 9}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-sm transition-all flex items-center gap-2 ${isSelectionLocked || registeredCourses.reduce((acc, c) => acc + c.credits, 0) < 9 ? 'bg-stone-300 dark:bg-stone-700 cursor-not-allowed' : 'bg-[#1f874c] hover:bg-[#166639]'}`}
                      >
                        {isSelectionLocked ? <><CheckCircle2 className="w-5 h-5" /> Registration Confirmed</> : 'Confirm Registration'}
                      </button>
                    </div>

                    {isSelectionLocked && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <strong>Your subject selection for this semester is locked.</strong> You can no longer add or drop courses. If you need to make changes, please contact the registrar's office.
                        </div>
                      </div>
                    )}
                    </>
                  )}
                </div>
              )}

               {/* === COURSES: COMPLETED === */}
              {activeTab === 'completed-courses' && (
                 <CompletedCoursesView />
              )}

              {/* === COURSES: AVAILABLE ENROLLMENT === */}
              {activeTab === 'available-courses' && (
                <div className="space-y-6">
                  <header>
                    <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Course Enrollment</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">List of courses you are eligible for the current semester.</p>
                  </header>

                  <Card className="p-4 bg-white dark:bg-stone-900 shadow-sm border-stone-200 dark:border-stone-800">
                    <div className="flex flex-col md:flex-row gap-4 mb-2">
                       <div className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl relative flex items-center px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200/50 transition-all">
                         <Search className="w-5 h-5 text-stone-400 mr-3" />
                         <input 
                            type="text" 
                            placeholder="Search by course code or title..." 
                            value={courseSearchQuery}
                            onChange={e => setCourseSearchQuery(e.target.value)}
                            className="w-full h-full bg-transparent outline-none text-sm font-medium dark:text-stone-100" 
                         />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
                      <div>
                        <label htmlFor="departmentFilter" className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Department</label>
                        <select 
                          id="departmentFilter"
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                          value={courseDeptFilter}
                          onChange={e => setCourseDeptFilter(e.target.value)}
                        >
                          <option value="All">All Departments</option>
                          <option value="CSE">CSE</option>
                          <option value="EEE">EEE</option>
                          <option value="MAT">MAT</option>
                          <option value="PHY">PHY</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="creditsFilter" className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Credits</label>
                        <select 
                          id="creditsFilter"
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                          value={courseCreditFilter}
                          onChange={e => setCourseCreditFilter(e.target.value)}
                        >
                          <option value="All">Any Credits</option>
                          <option value="1">1.0 Credits</option>
                          <option value="2">2.0 Credits</option>
                          <option value="3">3.0 Credits</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="prereqFilter" className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Prerequisites</label>
                        <select 
                          id="prereqFilter"
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                          value={coursePrereqFilter}
                          onChange={e => setCoursePrereqFilter(e.target.value)}
                        >
                          <option value="All">Any Status</option>
                          <option value="met">All Met / None Required</option>
                          <option value="some">Some Met</option>
                          <option value="none">None Met</option>
                        </select>
                      </div>
                      <div className="col-span-2 lg:col-span-2 flex items-end">
                        <div className="w-full relative">
                           <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Sort By</span>
                           <div className="flex bg-stone-50 dark:bg-stone-950 rounded-lg p-1 border border-stone-200 dark:border-stone-700">
                              <button onClick={() => setCourseSortBy('code')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${courseSortBy === 'code' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}>Code</button>
                              <button onClick={() => setCourseSortBy('title')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${courseSortBy === 'title' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}>Title</button>
                              <button onClick={() => setCourseSortBy('credits-desc')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${courseSortBy.startsWith('credits') ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}>
                                Credits {courseSortBy === 'credits-desc' ? 'â†“' : 'â†‘'}
                              </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {registerError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex">
                       <div className="w-full p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 flex items-center shadow-sm">
                         <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                         <span className="font-semibold text-sm">{registerError}</span>
                       </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAvailableCourses.length === 0 ? (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-stone-500 dark:text-stone-400 font-medium">No courses found matching your criteria.</p>
                      </div>
                    ) : (() => {
                      const bundles: any[] = [];
                      const processed = new Set<string>();

                      filteredAvailableCourses.forEach(course => {
                        if (processed.has(course.code)) return;

                        // find labs that have THIS course as corequisite
                        const labs = filteredAvailableCourses.filter(c => c.corequisites?.includes(course.code));
                        
                        if (labs.length > 0) {
                           bundles.push({
                              isBundle: true,
                              main: course,
                              labs: labs,
                              totalCredits: course.credits + labs.reduce((sum, l) => sum + l.credits, 0),
                              totalFee: course.fee + labs.reduce((sum, l) => sum + l.fee, 0)
                           });
                           processed.add(course.code);
                           labs.forEach(l => processed.add(l.code));
                        } else if (!course.corequisites || course.corequisites.length === 0) {
                           bundles.push({ isBundle: false, main: course, labs: [], totalCredits: course.credits, totalFee: course.fee });
                           processed.add(course.code);
                        } else {
                           // it's a lab whose parent is missing from the list, render alone
                           bundles.push({ isBundle: false, main: course, labs: [], totalCredits: course.credits, totalFee: course.fee });
                           processed.add(course.code);
                        }
                      });

                      return bundles.map(bundle => {
                        const course = bundle.main;
                        
                        if (bundle.isBundle) {
                          const allRegistered = [course, ...bundle.labs].every(c => registeredCourses.some(rc => rc.code === c.code));
                          const someRegistered = [course, ...bundle.labs].some(c => registeredCourses.some(rc => rc.code === c.code));
                          const hasPrereqs = hasCompletedPrerequisites(course);
                          
                          const titleMain = course.title;
                          const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

                          return (
                            <Card 
                              key={course.code + '-bundle'} 
                              className={`relative flex flex-col group transition-all duration-300 ${
                                allRegistered ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' : 'border-stone-200 dark:border-stone-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl'
                              }`}
                            >
                              <div className="p-5 flex-1 flex flex-col">
                                 <div className="flex justify-between items-start mb-3 gap-2">
                                    <div className="flex flex-wrap items-center">
                                      <Badge variant="outline" className="font-mono bg-stone-50/80 dark:bg-stone-900/80 font-bold border-stone-200 dark:border-stone-700">{course.code}</Badge>
                                      {bundle.labs.map((l: any) => (
                                         <React.Fragment key={l.code}>
                                           <span className="font-bold text-stone-400 dark:text-stone-500 mx-1">x</span>
                                           <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold border-emerald-200 dark:border-emerald-800/50">{l.code}</Badge>
                                         </React.Fragment>
                                      ))}
                                    </div>
                                    <Badge variant="outline" className="shrink-0 bg-stone-100 dark:bg-stone-800/80 font-bold whitespace-nowrap mt-0.5">
                                      ({course.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')}) Credits
                                    </Badge>
                                 </div>
                                 
                                 <h4 className="font-extrabold text-[#1c1c1c] dark:text-stone-100 text-lg mb-2 leading-tight pr-4 flex justify-between items-start gap-2">
                                   <span>{titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span></span>
                                   <button
                                     onClick={(e) => { e.stopPropagation(); setSelectedSyllabusCourse(course); }}
                                     className="text-stone-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1.5 rounded-lg shrink-0 transition-colors"
                                     title="View Syllabus"
                                   >
                                     <FileText className="w-4 h-4" />
                                   </button>
                                 </h4>
                                 
                                 <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-6">
                                    <span className="flex items-center"><GraduationCap className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Sec {course.section}</span>
                                    <span className="flex items-center text-stone-700 dark:text-stone-200 font-bold">T =&gt; {bundle.totalCredits.toFixed(2)} Credits</span>
                                    {allRegistered ? (
                                       <Badge variant="success" className="border-none font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 ml-auto">Enrolled</Badge>
                                    ) : (
                                       !hasPrereqs && <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50 flex items-center ml-auto"><AlertCircle className="w-3 h-3 mr-1" /> Prereq Lock</div>
                                    )}                                 </div>

                                  <div className="mt-auto pt-4 border-t border-stone-100/80 dark:border-stone-800 mb-4 bg-stone-50/30 dark:bg-stone-900/30 rounded-xl p-3">
                                   <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                                     Prerequisites
                                     <span className={course.prerequisites?.length ? (hasPrereqs ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400') : 'text-stone-400 dark:text-stone-500'}>
                                       {course.prerequisites?.length ? (hasPrereqs ? 'Fulfilled ✓' : 'Missing ✗') : 'None'}
                                     </span>
                                   </p>
                                   {course.prerequisites?.length ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {course.prerequisites.map(prereq => (
                                          <span key={prereq} className={`text-[11px] px-2 py-0.5 rounded font-bold font-mono border ${completedCourses.some(c => c.code === prereq) ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'}`}>
                                            {prereq}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="block text-[11px] text-stone-500 font-medium italic">No prerequisites required</span>
                                    )}
                                 </div>

                                 <button 
                                  onClick={() => props.handleRegisterBundle(course, bundle.labs)}
                                  disabled={allRegistered || !hasPrereqs || isSelectionLocked}
                                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                    allRegistered 
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 cursor-default border border-emerald-200 dark:border-emerald-900/50' 
                                      : isSelectionLocked
                                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed border border-stone-200 dark:border-stone-700'
                                        : hasPrereqs 
                                          ? 'bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] text-white shadow-md hover:shadow-lg' 
                                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed border border-stone-200 dark:border-stone-700'
                                  }`}
                                 >
                                   {allRegistered ? <><CheckCircle2 className="w-4 h-4" /> Enrolled</> : someRegistered ? 'Enroll Missing' : isSelectionLocked ? 'Selection Locked' : hasPrereqs ? 'Add Bundle' : 'Prerequisites Missing'}
                                 </button>
                              </div>
                            </Card>
                          );
                        }

                        const hasPrereqs = hasCompletedPrerequisites(course);
                        const isRegistered = registeredCourses.some(c => c.code === course.code);

                        return (
                          <Card 
                            key={course.code} 
                            className={`relative flex flex-col group transition-all duration-300 ${
                              isRegistered ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' : 'border-stone-200 dark:border-stone-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl'
                            }`}
                          >
                            <div className="p-5 flex-1 flex flex-col">
                               <div className="flex justify-between items-start mb-3">
                                  <Badge variant="outline" className="font-mono bg-stone-50/80 dark:bg-stone-900/80 font-bold border-stone-200 dark:border-stone-700">{course.code}</Badge>
                                  {isRegistered ? (
                                     <Badge variant="success" className="border-none font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">Enrolled</Badge>
                                  ) : (
                                     !hasPrereqs && <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Prereq Lock</div>
                                  )}
                               </div>
                               
                               <h4 className="font-extrabold text-[#1c1c1c] dark:text-stone-100 text-lg mb-2 leading-tight pr-4 flex justify-between items-start gap-2">
                                 <span>{course.title}</span>
                                 <button
                                   onClick={(e) => { e.stopPropagation(); setSelectedSyllabusCourse(course); }}
                                   className="text-stone-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1.5 rounded-lg shrink-0 transition-colors"
                                   title="View Syllabus"
                                 >
                                   <FileText className="w-4 h-4" />
                                 </button>
                               </h4>
                               
                               <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-6">
                                  <span className="flex items-center"><GraduationCap className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Sec {course.section}</span>
                                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {course.credits.toFixed(1)} Credits</span>
                                  <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {course.faculty.split(' ')[0]}</span>
                               </div>

                                <div className="mt-auto pt-4 border-t border-stone-100/80 dark:border-stone-800 mb-4 bg-stone-50/30 dark:bg-stone-900/30 rounded-xl p-3">
                                 <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                                   Prerequisites
                                   <span className={course.prerequisites?.length ? (hasPrereqs ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400') : 'text-stone-400 dark:text-stone-500'}>
                                     {course.prerequisites?.length ? (hasPrereqs ? 'Fulfilled ✓' : 'Missing ✗') : 'None'}
                                   </span>
                                 </p>
                                 {course.prerequisites?.length ? (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                      {course.prerequisites.map(prereq => (
                                        <span key={prereq} className={`text-[11px] px-2 py-0.5 rounded font-bold font-mono border ${completedCourses.some(c => c.code === prereq) ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'}`}>
                                          {prereq}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="block text-[11px] text-stone-500 font-medium italic mb-3">No prerequisites required</span>
                                  )}

                                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 flex justify-between items-center mt-3">
                                    Co-requisites
                                  </p>
                                  {course.corequisites?.length ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {course.corequisites.map(coreq => {
                                         const hasCoreq = completedCourses.some(c => c.code === coreq) || registeredCourses.some(c => c.code === coreq);
                                         return (
                                          <span key={coreq} className={`text-[11px] px-2 py-0.5 rounded font-bold font-mono border ${hasCoreq ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'}`}>
                                            {coreq}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="block text-[11px] text-stone-500 font-medium italic">No co-requisites required</span>
                                  )}
                               </div>

                               <button 
                                onClick={() => handleRegister(course)}
                                disabled={isRegistered || !hasPrereqs || isSelectionLocked}
                                className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                  isRegistered 
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 cursor-default border border-emerald-200 dark:border-emerald-900/50' 
                                    : isSelectionLocked
                                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed border border-stone-200 dark:border-stone-700'
                                      : hasPrereqs 
                                        ? 'bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] text-white shadow-md hover:shadow-lg' 
                                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed border border-stone-200 dark:border-stone-700'
                                }`}
                               >
                                 {isRegistered ? <><CheckCircle2 className="w-4 h-4" /> Enrolled</> : isSelectionLocked ? 'Selection Locked' : hasPrereqs ? 'Add Course' : 'Prerequisites Missing'}
                               </button>
                            </div>
                          </Card>
                        )
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* === ACCOUNTS: BANK SLIPS === */}
              {activeTab === 'bank-slips' && (
                <div className="max-w-5xl"><BankSlipsView portal={props} /></div>
              )}

              {/* === ACCOUNTS: STATEMENT === */}
              {activeTab === 'statement' && (
                 <div className="max-w-5xl"><StatementView portal={props} /></div>
              )}

              {/* === SCHEDULE: CLASS === */}
              {activeTab === 'class-schedule' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                     <div className="flex items-center gap-3">
                       <button 
                          onClick={() => setIs24HourFormat(!is24HourFormat)}
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700 font-bold text-sm px-4 py-2 rounded-lg transition-colors w-fit shadow-sm"
                       >
                         {is24HourFormat ? 'Switch to AM/PM' : 'Switch to 24H'}
                       </button>
                     </div>
                  </div>

                  <Card className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-4 mb-4">
                     <div className="flex-1">
                        <label htmlFor="scheduleDayFilter" className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Filter by Day</label>
                        <select 
                           id="scheduleDayFilter"
                           className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                           value={scheduleDayFilter}
                           onChange={e => setScheduleDayFilter(e.target.value)}
                        >
                           <option value="All">All Days</option>
                           <option value="Monday">Monday</option>
                           <option value="Tuesday">Tuesday</option>
                           <option value="Wednesday">Wednesday</option>
                           <option value="Thursday">Thursday</option>
                           <option value="Friday">Friday</option>
                           <option value="Saturday">Saturday</option>
                           <option value="Sunday">Sunday</option>
                        </select>
                     </div>
                     <div className="flex-1">
                        <label htmlFor="scheduleCourseFilter" className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">Filter by Course</label>
                        <select 
                           id="scheduleCourseFilter"
                           className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                           value={scheduleCourseFilter}
                           onChange={e => setScheduleCourseFilter(e.target.value)}
                        >
                           <option value="All">All Courses</option>
                           {Array.from(new Set(SCHEDULE_DATA.map(s => s.courseCode))).map(code => (
                             <option key={code} value={code}>{code}</option>
                           ))}
                        </select>
                     </div>
                  </Card>

                  {groupedSchedule.length === 0 ? (
                     <Card className="p-10 flex flex-col items-center justify-center text-center border-dashed border-stone-200 dark:border-stone-800">
                        <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-700 mb-3" />
                        <h3 className="font-bold text-stone-900 dark:text-white text-lg">No classes found</h3>
                        <p className="text-stone-500 dark:text-stone-400 mt-1">Try adjusting your filters.</p>
                        <button 
                           onClick={() => { setScheduleCourseFilter('All'); setScheduleDayFilter('All'); }}
                           className="mt-4 text-[#8c1515] font-medium hover:underline text-sm"
                        >
                           Clear filters
                        </button>
                     </Card>
                  ) : (
                     <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth hide-scrollbar gap-6 items-start">
                       {groupedSchedule.map(([day, classes]) => (
                         <div key={day} className="flex-none w-[280px] sm:w-[320px] flex flex-col">
                            <div className="flex items-center justify-between mb-4 sticky top-0 py-2 bg-[#f9fafb] dark:bg-stone-950 z-10">
                               <div className="flex items-center gap-3">
                                  <h3 className="font-bold text-xl text-stone-900 dark:text-white tracking-tight">{day}</h3>
                                  <Badge variant="outline" className="bg-white dark:bg-stone-900 rounded-full text-xs">{classes.length}</Badge>
                               </div>
                            </div>
                            <div className="flex flex-col gap-4 relative">
                               {/* Vertical timeline line */}
                               <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-stone-200 dark:bg-stone-800 rounded-full" />
                               
                               {classes.map((s, i) => (
                                  <div key={i} className="relative pl-8 group">
                                     {/* Timeline dot */}
                                     {s.courseCode !== '-' && (
                                       <div className="absolute left-[11px] top-6 w-[10px] h-[10px] rounded-full bg-stone-300 dark:bg-stone-600 ring-4 ring-[#f9fafb] dark:ring-stone-950 group-hover:bg-[#8c1515] dark:group-hover:bg-[#ef4444] transition-colors z-10" />
                                     )}
                                     
                                     <Card className={`p-4 sm:p-5 border-transparent ${s.courseCode !== '-' ? 'group-hover:border-[#8c1515]/30 dark:group-hover:border-[#ef4444]/30 hover:shadow-lg hover:shadow-[#8c1515]/5' : 'opacity-70'} transition-all overflow-hidden relative border border-stone-200/50 dark:border-stone-800/80`}>
                                        {/* Accent line on the left of the card */}
                                        {s.courseCode !== '-' && (
                                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8c1515] dark:bg-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                        
                                        <div className="flex items-center justify-between text-sm mb-3">
                                           <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs sm:text-sm">
                                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                                              {s.start !== '-' ? formatTime(s.start, is24HourFormat) : '-'} <span className="text-stone-400 font-medium px-0.5">-</span> <span className="text-stone-500 font-medium">{s.end !== '-' ? formatTime(s.end, is24HourFormat) : '-'}</span>
                                           </div>
                                        </div>
                                        
                                        <h4 className={`font-bold text-base sm:text-lg ${s.courseCode !== '-' ? 'text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-500'} mb-1 leading-tight`}>{s.courseCode}</h4>
                                        <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 mb-4 line-clamp-2">{s.title}</p>
                                        
                                        {s.courseCode !== '-' && (
                                          <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                                             <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                                                   <MapPin className="w-3.5 h-3.5 text-stone-400" /> Room {s.room || '-'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                                                   <Users className="w-3.5 h-3.5 text-stone-400" /> {s.faculty || "TBA"}
                                                </span>
                                             </div>
                                             {s.campus && (
                                               <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-500">
                                                  Campus {s.campus}
                                               </div>
                                             )}
                                          </div>
                                        )}
                                     </Card>
                                  </div>
                               ))}
                            </div>
                         </div>
                       ))}
                     </div>
                  )}
                </div>
              )}

              {/* === ACADEMICS TAB === */}
              {activeTab === 'degree-audit' && <DegreeAuditView portal={props} />}
              {activeTab === 'transcript' && <GradesView portal={props} />}
              {activeTab === 'academic-calendar' && <AcademicCalendarView />}
              {activeTab === 'exam-routine' && <ExamsView portal={props} />}
              {activeTab === 'exam-admit-card' && <AdmitCardView portal={props} />}

              {/* === FINANCIAL AID === */}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Co-requisite Modal */}
      <AnimatePresence>
        {isCoreqModalOpen && pendingCoreqCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                  Co-requisites Required
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
                  <span className="font-bold">{pendingCoreqCourse.main.code}</span> requires you to also register for the following co-requisites:
                </p>
                <div className="bg-stone-50 dark:bg-stone-950 rounded-xl p-4 space-y-3 mb-6 border border-stone-100 dark:border-stone-800">
                  {pendingCoreqCourse.coreqs.map(req => (
                    <div key={req.code} className="flex justify-between items-center">
                      <div className="font-mono font-bold text-stone-900 dark:text-stone-100">{req.code}</div>
                      <div className="text-sm font-semibold text-stone-500 dark:text-stone-400">{req.credits.toFixed(1)} Credits</div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-500 dark:text-stone-400">Total Additional Credits</span>
                    <span className="font-bold text-stone-900 dark:text-white">{pendingCoreqCourse.coreqs.reduce((acc, c) => acc + c.credits, 0).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsCoreqModalOpen(false);
                      setPendingCoreqCourse(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmCoreqsRegistration}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] shadow-sm transition-colors"
                  >
                    Add All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {selectedSyllabusCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                 <div>
                   <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">{selectedSyllabusCourse.code}</div>
                   <h3 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">{selectedSyllabusCourse.title} - Syllabus</h3>
                 </div>
                 <button onClick={() => setSelectedSyllabusCourse(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 text-stone-700 dark:text-stone-300" data-lenis-prevent>
                 {selectedSyllabusCourse.syllabus ? (
                    <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
                      {selectedSyllabusCourse.syllabus}
                    </div>
                 ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                      <p className="font-semibold text-lg text-stone-500 dark:text-stone-400">No Syllabus Available</p>
                      <p className="text-sm text-stone-400 dark:text-stone-500 mt-2">The syllabus for this course has not been uploaded yet.</p>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Confirmation Modal */}
      <AnimatePresence>
        {isConfirmRegistrationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                 <div>
                   <h3 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">Confirm Registration</h3>
                 </div>
                 <button onClick={() => setIsConfirmRegistrationOpen(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800" data-lenis-prevent>
                <p className="mb-4">Please review your selected courses before finalizing. Once finalized, you cannot make changes without contacting the registrar.</p>
                <div className="space-y-4">
                  {(() => {
                    const bundles: any[] = [];
                    const processed = new Set<string>();

                    registeredCourses.forEach((course) => {
                      if (processed.has(course.code)) return;

                      const labs = registeredCourses.filter((c) => c.corequisites?.includes(course.code));

                      if (course.corequisites?.length && registeredCourses.some((c) => course.corequisites?.includes(c.code))) {
                        return;
                      }

                      if (labs.length > 0) {
                        bundles.push({
                          isBundle: true,
                          main: course,
                          labs: labs,
                          totalCredits: course.credits + labs.reduce((sum: number, l: any) => sum + l.credits, 0),
                        });
                        processed.add(course.code);
                        labs.forEach((l) => processed.add(l.code));
                      } else {
                        bundles.push({ isBundle: false, main: course, labs: [], totalCredits: course.credits });
                        processed.add(course.code);
                      }
                    });

                    return bundles.map((bundle, i) => {
                      const course = bundle.main;

                      if (bundle.isBundle) {
                        const titleMain = course.title;
                        const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

                        return (
                          <div key={'bundle-' + i} className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex flex-wrap items-center">
                                  <div className="font-bold text-stone-900 dark:text-white mr-1">{course.code}</div>
                                  {bundle.labs.map((l: any) => (
                                    <React.Fragment key={l.code}>
                                      <span className="text-xl leading-none text-stone-400 font-normal mx-1">x</span>
                                      <div className="font-bold text-stone-900 dark:text-white">{l.code}</div>
                                    </React.Fragment>
                                  ))}
                                </div>
                                <div className="text-sm font-medium mt-1">
                                  {titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span>
                                </div>
                              </div>
                              <div className="font-bold whitespace-nowrap text-right">
                                <div>T =&gt; {bundle.totalCredits.toFixed(2)} Credits</div>
                                <div className="text-[10px] text-stone-500 font-normal">({course.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')})</div>
                              </div>
                            </div>
                            {((course.prerequisites && course.prerequisites.length > 0) || (course.corequisites && course.corequisites.length > 0)) && (
                              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex flex-col gap-1.5">
                                {course.prerequisites && course.prerequisites.length > 0 && <div><span className="font-bold text-stone-700 dark:text-stone-300">Prerequisites:</span> {course.prerequisites.join(", ")}</div>}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div key={course.code} className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-stone-900 dark:text-white">{course.code}</div>
                              <div className="text-sm font-medium">{course.title}</div>
                            </div>
                            <div className="font-bold">{course.credits.toFixed(2)} Credits</div>
                          </div>
                          {((course.prerequisites && course.prerequisites.length > 0) || (course.corequisites && course.corequisites.length > 0)) && (
                            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex flex-col gap-1.5">
                              {course.prerequisites && course.prerequisites.length > 0 && <div><span className="font-bold text-stone-700 dark:text-stone-300">Prerequisites:</span> {course.prerequisites.join(", ")}</div>}
                              {course.corequisites && course.corequisites.length > 0 && <div><span className="font-bold text-stone-700 dark:text-stone-300">Co-requisites:</span> {course.corequisites.join(", ")}</div>}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex justify-between items-center text-indigo-900 dark:text-indigo-100 mt-4">
                    <span className="font-bold text-lg">Total Credits</span>
                    <span className="font-black text-xl">{registeredCourses.reduce((acc, c) => acc + c.credits, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-stone-50 dark:bg-stone-950 flex justify-end gap-3 shrink-0">
                 <button 
                   onClick={() => setIsConfirmRegistrationOpen(false)}
                   className="px-6 py-2.5 rounded-lg text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={() => {
                     haptics.success();
                     setIsSelectionLocked(true);
                     setIsConfirmRegistrationOpen(false);
                   }}
                   className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#1f874c] text-white hover:bg-[#166639] transition-colors shadow-md"
                 >
                    Confirm & Submit
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
