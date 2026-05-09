import React, { useState } from 'react';
import { BookOpen, AlertCircle, Search, Filter, Lock, Plus, LockOpen, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../../hooks/usePortalLogic';
import { Course } from '../../data';

export function CoursesView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const { 
    store, isSelectionLocked, setIsSelectionLocked, registeredCourses,
    handleDropCourse, registerError,
    groupedCompletedCourses, student,
    courseSearchQuery, setCourseSearchQuery,
    courseDeptFilter, setCourseDeptFilter,
    courseCreditFilter, setCourseCreditFilter,
    coursePrereqFilter, setCoursePrereqFilter,
    filteredAvailableCourses, hasCompletedPrerequisites, handleRegister,
    isCoreqModalOpen, setIsCoreqModalOpen, pendingCoreqCourse, confirmCoreqsRegistration
  } = portal;
  
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<Course | null>(null);

  if (store.activeTab === 'registered-courses') {
    const totalCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm flex items-center gap-3">
              <span className="text-sm text-stone-500">Total Credits:</span>
              <span className={`font-bold text-lg ${totalCredits < 9 ? 'text-red-600 dark:text-red-400' : totalCredits > 18 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {totalCredits.toFixed(2)} <span className="text-sm font-normal text-stone-500">/ 21</span>
              </span>
            </div>
            {totalCredits < 9 && (
              <span className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5" /> Minimum 9 credits required.
              </span>
            )}
          </div>
          <button 
            onClick={() => {
              if (!isSelectionLocked) {
                portal.setIsConfirmRegistrationOpen(true);
              }
            }} 
            disabled={isSelectionLocked || totalCredits < 9}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
              isSelectionLocked || totalCredits < 9 
                ? 'bg-stone-300 dark:bg-stone-700 text-white cursor-not-allowed' 
                : 'bg-[#1f874c] text-white hover:bg-[#166639]'
            }`}
          >
            {isSelectionLocked ? <><Lock className="w-4 h-4" /> Registration Confirmed</> : 'Confirm Registration'}
          </button>
        </div>

        {isSelectionLocked && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-400 mt-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Your subject selection for this semester is locked.</strong> You can no longer add or drop courses. If you need to make changes, please contact the registrar's office.
            </div>
          </div>
        )}

        <AnimatePresence>
          {registerError && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-900/50"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{registerError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

            return bundles.map((bundle) => {
              const course = bundle.main;

              if (bundle.isBundle) {
                const titleMain = course.title;
                const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

                return (
                  <Card key={course.code + '-bundle'} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="p-5 flex-1 relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-wrap items-center">
                          <Badge variant="brand">{course.code}</Badge>
                          {bundle.labs.map((l: any) => (
                            <React.Fragment key={l.code}>
                              <span className="font-bold text-stone-400 dark:text-stone-500 mx-1">x</span>
                              <Badge variant="outline" className="text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">{l.code}</Badge>
                            </React.Fragment>
                          ))}
                        </div>
                        <Badge variant="outline" className="shrink-0 bg-stone-100 dark:bg-stone-800 font-bold whitespace-nowrap ml-2">
                          ({course.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')}) Cr
                        </Badge>
                      </div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex-1">
                           <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight pr-8">
                             {titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span>
                           </h3>
                        </div>
                        <div className="text-xs font-bold text-stone-500 whitespace-nowrap mt-1">
                           T =&gt; {bundle.totalCredits.toFixed(2)}Credit
                        </div>
                      </div>
                      <p className="text-sm text-stone-500">{course.faculty}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge>Sec {course.section}</Badge>
                        <Badge variant="success">Confirmed</Badge>
                      </div>
                    </div>
                    <div className="border-t border-stone-100 dark:border-stone-800 p-4 bg-stone-50 dark:bg-stone-800/30">
                      <button 
                        onClick={() => handleDropCourse(course.code)}
                        disabled={isSelectionLocked}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <AlertCircle className="w-4 h-4" /> Drop {bundle.totalCredits.toFixed(2)} Cr Bundle
                      </button>
                    </div>
                  </Card>
                );
              }

              return (
                <Card key={course.code} className="flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="p-5 flex-1 relative">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="brand">{course.code}</Badge>
                      <Badge variant="outline">{course.credits.toFixed(2)} Cr.</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight mb-2 pr-8">{course.title}</h3>
                    <p className="text-sm text-stone-500">{course.faculty}</p>
                    <div className="mt-4 flex gap-2">
                      <Badge>Sec {course.section}</Badge>
                      <Badge variant="success">Confirmed</Badge>
                    </div>
                  </div>
                  <div className="border-t border-stone-100 dark:border-stone-800 p-4 bg-stone-50 dark:bg-stone-800/30">
                    <button 
                      onClick={() => handleDropCourse(course.code)}
                      disabled={isSelectionLocked}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertCircle className="w-4 h-4" /> Drop Course
                    </button>
                  </div>
                </Card>
              );
            });
          })()}
          {registeredCourses.length === 0 && (
             <div className="col-span-full py-20 text-center">
               <BookOpen className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
               <p className="text-stone-500 text-lg">No courses registered yet.</p>
               <button onClick={() => store.setActiveTab('available-courses')} className="mt-4 text-[#8c1515] font-medium hover:underline">Browse available courses</button>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (store.activeTab === 'completed-courses') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-sm text-stone-500 font-medium mb-1">Total Credits</p>
            <p className="text-3xl font-bold">{student.creditsCompleted}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-stone-500 font-medium mb-1">CGPA</p>
            <p className="text-3xl font-bold text-[#8c1515]">{student.cgpa}</p>
          </Card>
        </div>

        {groupedCompletedCourses.map(([semester, courses]) => {
          const semesterCredits = courses.reduce((acc, c) => acc + c.credits, 0);
          return (
            <Card key={semester} className="overflow-hidden">
              <div className="bg-stone-50 dark:bg-stone-800/50 px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <h3 className="font-semibold text-lg">{semester}</h3>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{courses.length} Courses</Badge>
                  <Badge variant="outline">{semesterCredits} Credits</Badge>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-stone-500">Course</th>
                      <th className="px-6 py-3 font-medium text-stone-500">Title</th>
                      <th className="px-6 py-3 font-medium text-stone-500">Credits</th>
                      <th className="px-6 py-3 font-medium text-stone-500 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {(() => {
                      const bundles: any[] = [];
                      const processed = new Set<string>();

                      courses.forEach((course) => {
                        if (processed.has(course.code)) return;

                        const labs = courses.filter((c) => c.corequisites?.includes(course.code));

                        if (course.corequisites?.length && courses.some((c) => course.corequisites?.includes(c.code))) {
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

                      return bundles.map((bundle, idx) => {
                        const course = bundle.main;

                        if (bundle.isBundle) {
                          const titleMain = course.title;
                          const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

                          return (
                            <tr key={'bundle-' + idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                              <td className="px-6 py-4 font-semibold text-[#8c1515] dark:text-[#ef4444] whitespace-nowrap">
                                {course.code}
                                {bundle.labs.map((l: any) => (
                                  <React.Fragment key={l.code}>
                                    <span className="text-stone-400 font-normal mx-1">x</span>
                                    {l.code}
                                  </React.Fragment>
                                ))}
                              </td>
                              <td className="px-6 py-4 text-stone-800 dark:text-stone-300 font-medium">
                                {titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span>
                              </td>
                              <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                                T =&gt; {bundle.totalCredits.toFixed(2)}Credit
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`inline-flex font-bold ${['A', 'A-', 'B+'].includes(course.grade || '') ? 'text-emerald-600' : 'text-stone-700 dark:text-stone-300'}`}>
                                    {course.grade}
                                  </span>
                                  {bundle.labs.map((l: any) => (
                                    <span key={l.code} className={`text-xs inline-flex font-bold ${['A', 'A-', 'B+'].includes(l.grade || '') ? 'text-emerald-600' : 'text-stone-700 dark:text-stone-300'}`}>
                                      {l.grade}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                            <td className="px-6 py-4 font-semibold text-[#8c1515] dark:text-[#ef4444] whitespace-nowrap">{course.code}</td>
                            <td className="px-6 py-4 text-stone-800 dark:text-stone-300 font-medium">{course.title}</td>
                            <td className="px-6 py-4 text-stone-500">{course.credits.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`inline-flex font-bold ${['A', 'A-', 'B+'].includes(course.grade || '') ? 'text-emerald-600' : 'text-stone-700 dark:text-stone-300'}`}>
                                {course.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // available-courses
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {registerError && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-900/50"
          >
            <AlertCircle className="w-5 h-5 auto shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{registerError}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Card className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-center">
        <div className="xl:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search by code or title..." 
            value={courseSearchQuery}
            onChange={(e) => setCourseSearchQuery(e.target.value)}
            className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#8c1515]/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
           <Filter className="w-4 h-4 text-stone-400 shrink-0" />
           <select 
             value={courseDeptFilter} 
             onChange={e => setCourseDeptFilter(e.target.value)}
             className="w-full bg-stone-100 dark:bg-stone-800 border-none text-sm rounded-lg py-2 focus:ring-2 focus:ring-[#8c1515]/20"
           >
             <option value="All">All Depts</option>
             <option value="CSE">CSE</option>
             <option value="MAT">MAT</option>
             <option value="ENG">ENG</option>
             <option value="PHY">PHY</option>
           </select>
        </div>
        
        <select 
          value={courseCreditFilter} 
          onChange={e => setCourseCreditFilter(e.target.value)}
          className="w-full bg-stone-100 dark:bg-stone-800 border-none text-sm rounded-lg py-2 focus:ring-2 focus:ring-[#8c1515]/20"
        >
          <option value="All">All Credits</option>
          <option value="1">1 Credit</option>
          <option value="3">3 Credits</option>
        </select>
        
        <select 
          value={coursePrereqFilter} 
          onChange={e => setCoursePrereqFilter(e.target.value)}
          className="w-full bg-stone-100 dark:bg-stone-800 border-none text-sm rounded-lg py-2 focus:ring-2 focus:ring-[#8c1515]/20"
        >
          <option value="All">All Status</option>
          <option value="met">Prereqs Met</option>
          <option value="none">Needs Prereqs</option>
        </select>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(() => {
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
              const prereqMet = hasCompletedPrerequisites(course);
              
              const titleMain = course.title;
              const titleLab = bundle.labs.map((l: any) => l.title.replace(titleMain, '').trim() || 'Laboratory').join(' + ');

              return (
                <Card key={course.code + '-bundle'} className={`flex flex-col h-full transition-all ${allRegistered ? 'border-[#8c1515] ring-1 ring-[#8c1515] shadow-md shadow-[#8c1515]/10' : 'hover:border-stone-300 dark:hover:border-stone-700'}`}>
                  <div className="p-5 flex-1 relative flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap items-center">
                        <Badge variant="brand">{course.code}</Badge>
                        {bundle.labs.map((l: any) => (
                           <React.Fragment key={l.code}>
                             <span className="font-bold text-stone-400 dark:text-stone-500 mx-1">x</span>
                             <Badge variant="outline" className="text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">{l.code}</Badge>
                           </React.Fragment>
                        ))}
                      </div>
                      <Badge variant="outline" className="shrink-0 bg-stone-100 dark:bg-stone-800 font-bold whitespace-nowrap ml-2">
                        ({course.credits.toFixed(2)} x {bundle.labs.map((l: any) => l.credits.toFixed(2)).join(' x ')}) Cr
                      </Badge>
                    </div>
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex-1">
                         <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                           {titleMain} <span className="text-stone-400 font-normal">x {titleLab}</span>
                         </h3>
                      </div>
                      <div className="text-xs font-bold text-stone-500 whitespace-nowrap mt-1">
                         T =&gt; {bundle.totalCredits.toFixed(2)}Credit
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                       <div className="flex justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-2">
                         <span className="text-stone-500">Prerequisites</span>
                         <span className={`font-semibold ${prereqMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {course.prerequisites?.length ? course.prerequisites.join(', ') : 'None'}
                         </span>
                       </div>
                       <div className="flex justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-2">
                         <span className="text-stone-500">Total Fee</span>
                         <span className="font-semibold text-stone-700 dark:text-stone-300">৳{bundle.totalFee.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="border-t border-stone-100 dark:border-stone-800 p-4 bg-stone-50 dark:bg-stone-800/30 flex gap-2">
                     <button 
                      onClick={() => setSelectedSyllabusCourse(course)}
                      className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => portal.handleRegisterBundle(course, bundle.labs)}
                      disabled={allRegistered || isSelectionLocked}
                      className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-bold rounded-lg transition-colors ${
                        allRegistered 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                          : !prereqMet
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : isSelectionLocked
                              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                              : 'bg-[#8c1515] hover:bg-[#7a1212] text-white shadow-sm'
                      }`}
                    >
                      {allRegistered ? 'Enrolled' : someRegistered ? 'Enroll Missing' : <><Plus className="w-4 h-4" /> Enroll {bundle.totalCredits.toFixed(2)} Cr</>}
                    </button>
                  </div>
                </Card>
              );
            }

            // Regular non-bundled course render
            const isRegistered = registeredCourses.some(c => c.code === course.code);
            const prereqMet = hasCompletedPrerequisites(course);
            
            return (
              <Card key={course.code} className={`flex flex-col h-full transition-all ${isRegistered ? 'border-[#8c1515] ring-1 ring-[#8c1515] shadow-md shadow-[#8c1515]/10' : 'hover:border-stone-300 dark:hover:border-stone-700'}`}>
                <div className="p-5 flex-1 relative flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="brand">{course.code}</Badge>
                    <Badge variant="outline">{course.credits.toFixed(2)} Cr.</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight mb-2 pr-8">{course.title}</h3>
                  <div className="mt-auto pt-4 space-y-2">
                    <div className="flex justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-2">
                      <span className="text-stone-500">Prerequisites</span>
                      <span className={`font-semibold ${prereqMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {course.prerequisites?.length ? course.prerequisites.join(', ') : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-2">
                      <span className="text-stone-500">Fee</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">৳{course.fee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-stone-100 dark:border-stone-800 p-4 bg-stone-50 dark:bg-stone-800/30 flex gap-2">
                   <button 
                    onClick={() => setSelectedSyllabusCourse(course)}
                    className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRegister(course)}
                    disabled={isRegistered || isSelectionLocked}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-colors ${
                      isRegistered 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                        : !prereqMet
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : isSelectionLocked
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-[#8c1515] hover:bg-[#7a1212] text-white shadow-sm'
                    }`}
                  >
                    {isRegistered ? 'Enrolled' : <><Plus className="w-4 h-4" /> Enroll Course</>}
                  </button>
                </div>
              </Card>
            );
          });
        })()}
      </div>

       <AnimatePresence>
        {isCoreqModalOpen && pendingCoreqCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Co-requisite Required</h3>
                <p className="text-stone-500 text-sm mb-4">
                  <strong>{pendingCoreqCourse.main.code}</strong> requires you to also take the following co-requisite courses:
                </p>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 p-4 mb-6">
                  {pendingCoreqCourse.coreqs.map(c => (
                    <div key={c.code} className="flex justify-between items-center py-2 border-b last:border-0 border-stone-200 dark:border-stone-700">
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-stone-500 text-sm">{c.title}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium mb-6">Do you want to add both courses to your registry?</p>
                
                <div className="flex gap-3">
                  <button onClick={() => setIsCoreqModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-stone-200 font-medium hover:bg-stone-50 transition-colors">Cancel</button>
                  <button onClick={confirmCoreqsRegistration} className="flex-1 py-2.5 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] text-white font-medium transition-colors">Add Both Courses</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Syllabus Modal */}
      <AnimatePresence>
        {selectedSyllabusCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm"
               onClick={() => setSelectedSyllabusCourse(null)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/30">
                <div className="flex items-center gap-3">
                  <Badge variant="brand">{selectedSyllabusCourse.code}</Badge>
                  <h3 className="text-lg font-bold truncate">{selectedSyllabusCourse.title}</h3>
                </div>
                <button onClick={() => setSelectedSyllabusCourse(null)} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors">&times;</button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="prose prose-sm dark:prose-invert max-w-none prose-stone">
                   <div dangerouslySetInnerHTML={{ __html: selectedSyllabusCourse.syllabus || 'No syllabus available.' }} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
