import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { Course, AVAILABLE_COURSES } from '../data';
import { Search, AlertCircle, GraduationCap, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

export const CourseEnrollmentView: React.FC = () => {
  const { 
    completedCourses, 
    registeredCourses, 
    setRegisteredCourses,
    isSelectionLocked,
    setSelectedSyllabusCourse
  } = useAppStore();

  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseDeptFilter, setCourseDeptFilter] = useState("All");
  const [courseCreditFilter, setCourseCreditFilter] = useState("All");
  const [coursePrereqFilter, setCoursePrereqFilter] = useState("All");
  const [courseSortBy, setCourseSortBy] = useState("code");
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const [pendingCoreqCourse, setPendingCoreqCourse] = useState<{main: Course, coreqs: Course[]} | null>(null);
  const [isCoreqModalOpen, setIsCoreqModalOpen] = useState(false);

  const filteredAvailableCourses = useMemo(() => {
    const result = AVAILABLE_COURSES.filter(c => {
      // Exclude courses that have been completed without failing
      const hasPassed = completedCourses.some(
        comp => comp.code === c.code && comp.grade && !['F', 'W', 'Drop', 'I'].includes(comp.grade)
      );
      if (hasPassed) return false;

      const matchesSearch = c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) || 
                            c.title.toLowerCase().includes(courseSearchQuery.toLowerCase());
      const dept = c.code.replace(/[0-9]/g, '');
      const matchesDept = courseDeptFilter === "All" || dept === courseDeptFilter;
      const matchesCredit = courseCreditFilter === "All" || c.credits.toString() === courseCreditFilter;
      
      let matchesPrereq = true;
      if (coursePrereqFilter !== "All") {
        const prereqs = c.prerequisites || [];
        if (prereqs.length === 0) {
           matchesPrereq = coursePrereqFilter === "all" || coursePrereqFilter === "met";
        } else {
           const metCount = prereqs.filter(p => completedCourses.some(comp => comp.code === p)).length;
           if (coursePrereqFilter === "all" || coursePrereqFilter === "met") matchesPrereq = metCount === prereqs.length;
           else if (coursePrereqFilter === "some") matchesPrereq = (metCount > 0 && metCount < prereqs.length);
           else if (coursePrereqFilter === "none") matchesPrereq = metCount === 0;
        }
      }

      return matchesSearch && matchesDept && matchesCredit && matchesPrereq;
    });

    result.sort((a, b) => {
      if (courseSortBy === "code") return a.code.localeCompare(b.code);
      if (courseSortBy === "title") return a.title.localeCompare(b.title);
      if (courseSortBy === "credits-desc") return b.credits - a.credits;
      if (courseSortBy === "credits-asc") return a.credits - b.credits;
      return 0;
    });

    return result;
  }, [courseSearchQuery, courseDeptFilter, courseCreditFilter, coursePrereqFilter, courseSortBy, completedCourses]);

  const hasCompletedPrerequisites = (course: Course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => 
      completedCourses.some(c => c.code === prereq)
    );
  };

  const handleRegister = (course: Course) => {
    if (isSelectionLocked) {
      setRegisterError(`Course selection is locked for this semester.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    if (!hasCompletedPrerequisites(course)) {
      setRegisterError(`Prerequisite not met: ${course.prerequisites?.join(', ')}`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    if (registeredCourses.some(c => c.code === course.code)) {
      setRegisterError(`Already registered for ${course.code}.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }
    
    if (course.corequisites && course.corequisites.length > 0) {
      const missingCoreqs = course.corequisites.filter(coreq => 
        !completedCourses.some(c => c.code === coreq) && 
        !registeredCourses.some(c => c.code === coreq)
      );
      if (missingCoreqs.length > 0) {
        const missingCoreqCourses = AVAILABLE_COURSES.filter(c => missingCoreqs.includes(c.code));
        const missingCoreqCredits = missingCoreqCourses.reduce((acc, c) => acc + c.credits, 0);
        const currentCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
        
        if (currentCredits + course.credits + missingCoreqCredits > 21) {
          setRegisterError(`Cannot add ${course.code} because adding its missing co-requisites (${missingCoreqs.join(', ')}) would exceed the 21 credit limit.`);
          setTimeout(() => setRegisterError(null), 3000);
          return;
        }

        setPendingCoreqCourse({ main: course, coreqs: missingCoreqCourses });
        setIsCoreqModalOpen(true);
        return;
      }
    }

    const currentCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
    if (currentCredits + course.credits > 21) {
      setRegisterError(`Cannot exceed maximum of 21 credits. Total will be ${currentCredits + course.credits}.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    setRegisteredCourses([...registeredCourses, course]);
  };

  const confirmCoreqsRegistration = () => {
    if (!pendingCoreqCourse) return;
    setRegisteredCourses([...registeredCourses, pendingCoreqCourse.main, ...pendingCoreqCourse.coreqs]);
    setIsCoreqModalOpen(false);
    setPendingCoreqCourse(null);
  };

  return (
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
        ) : filteredAvailableCourses.map(course => {
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
                       {course.prerequisites?.length ? (hasPrereqs ? 'Fulfilled âœ“' : 'Missing âœ—') : 'None'}
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
        })}
      </div>

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
                  className="flex-1 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmCoreqsRegistration}
                  className="flex-1 px-4 py-2 bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] text-white rounded-lg font-bold transition-colors shadow-sm"
                >
                  Add All
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
