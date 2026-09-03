import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { CoursesView } from './views/CoursesView';
import { CompletedCoursesView } from '../views/CompletedCoursesView';
import { ScheduleWeeklyView } from './views/ScheduleWeeklyView';
import { DegreeAuditView } from './views/DegreeAuditView';
import { GradesView } from './views/GradesView';
import { ExamsView } from './views/ExamsView';
import { AttendanceView } from './views/AttendanceView';
import { FacultyEvalView } from './views/FacultyEvalView';
import { FinancialAidView } from './views/FinancialAidView';
import { StatementView } from '../views/StatementView';
import { AdmitCardView } from '../views/AdmitCardView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminStudentRecordsView } from './views/admin/AdminStudentRecordsView';
import { AdminCourseManagementView } from './views/admin/AdminCourseManagementView';
import { AdminGradeManagementView } from './views/admin/AdminGradeManagementView';
import { AdminEnrollmentApprovalsView } from './views/admin/AdminEnrollmentApprovalsView';
import { AdminAttendanceManagementView } from './views/admin/AdminAttendanceManagementView';

interface DesktopLayoutProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export function DesktopLayout(portal: ReturnType<typeof usePortalLogic>) {
  const { store, isConfirmRegistrationOpen, setIsConfirmRegistrationOpen, setIsSelectionLocked, registeredCourses } = portal;

  const renderContent = () => {
    switch (store.activeTab) {
      case 'home': return <HomeView portal={portal} />;
      case 'admin-dashboard': return <AdminDashboardView />;
      case 'student-records': return <AdminStudentRecordsView />;
      case 'course-management': return <AdminCourseManagementView />;
      case 'grade-submissions': return <AdminGradeManagementView />;
      case 'enrollment-approvals': return <AdminEnrollmentApprovalsView />;
      case 'attendance-tracking': return <AdminAttendanceManagementView />;
      case 'profile': return <ProfileView portal={portal} />;
      case 'statement': return <StatementView portal={portal} />;
      case 'financial-aid': return <FinancialAidView />;
      case 'registered-courses':
      case 'available-courses': return <CoursesView portal={portal} />;
      case 'completed-courses': return <CompletedCoursesView />;
      case 'class-schedule': return <ScheduleWeeklyView portal={portal} />;
      case 'degree-audit': return <DegreeAuditView />;
      case 'transcript': return <GradesView />;
      case 'exam-routine': return <ExamsView />;
      case 'exam-admit-card': return <AdmitCardView portal={portal} />;
      case 'attendance': return <AttendanceView />;
      case 'faculty-evaluation': return <FacultyEvalView />;
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

      {/* Registration Confirmation Modal */}
      <AnimatePresence>
        {isConfirmRegistrationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-stone-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800"
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
                        return; // Will be processed parent bundle
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
                                <div>T =&gt; {bundle.totalCredits.toFixed(2)} Cr</div>
                                <div className="text-[10px] text-stone-500 font-normal">({course.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')})</div>
                              </div>
                            </div>
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
                            <div className="font-bold">{course.credits.toFixed(2)} Cr</div>
                          </div>
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
