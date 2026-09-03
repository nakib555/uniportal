import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/card';
import { useAppStore } from '../store';
import { Course } from '../data';
import { Download, LayoutGrid, List, GraduationCap, ArrowLeftRight } from 'lucide-react';
import { PrintableCompletedCourses } from '../components/print/PrintableCompletedCourses';

const getGradePoint = (grade?: string) => {
  const scale: Record<string, string> = { 
    'A+': '4.00', 'A': '3.75', 'A-': '3.50', 
    'B+': '3.25', 'B': '3.00', 'B-': '2.75', 
    'C+': '2.50', 'C': '2.25', 'D': '2.00', 'F': '0.00' 
  };
  return grade && scale[grade] ? scale[grade] : '-.--';
};

const getMarksRange = (grade?: string) => {
  const scale: Record<string, string> = {
    'A+': '80-100', 'A': '75-79', 'A-': '70-74',
    'B+': '65-69', 'B': '60-64', 'B-': '55-59',
    'C+': '50-54', 'C': '45-49', 'D': '40-44', 'F': '0-39'
  };
  return grade && scale[grade] ? scale[grade] : '--';
};


const calculateGroupGPA = (courses: Course[]) => {
  let totalPoints = 0;
  let totalCredits = 0;
  courses.forEach(c => {
    if (c.grade && c.grade.toUpperCase() !== 'W' && c.grade.toUpperCase() !== 'DROP' && c.grade.toUpperCase() !== 'I') {
      const ptStr = getGradePoint(c.grade);
      if (ptStr && ptStr !== '-.--') {
        totalPoints += parseFloat(ptStr) * c.credits;
        totalCredits += c.credits;
      }
    }
  });
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
};

export const CompletedCoursesView: React.FC = () => {
  const { completedCourses } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTitle, setShowTitle] = useState(true);
  const [gradeDisplayMode, setGradeDisplayMode] = useState<'letter' | 'point'>('letter');
  const [cardOverrides, setCardOverrides] = useState<Record<string, 'letter' | 'point'>>({});

  const toggleCardGrade = (courseCode: string) => {
    setCardOverrides(prev => {
      const current = prev[courseCode] || gradeDisplayMode;
      return {
        ...prev,
        [courseCode]: current === 'letter' ? 'point' : 'letter'
      };
    });
  };

  const getEffectiveMode = (courseCode: string) => {
    return cardOverrides[courseCode] || gradeDisplayMode;
  };

  const groupedCompletedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    completedCourses.forEach(c => {
      if (!groups[c.semester]) groups[c.semester] = [];
      groups[c.semester].push(c);
    });
    return Object.entries(groups).sort((a,b) => b[0].localeCompare(a[0]));
  }, [completedCourses]);

  return (
    <>
      <PrintableCompletedCourses courses={completedCourses} />
      <div className="space-y-6 print-hide">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Completed Courses</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              List of all courses you have completed so far.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 font-medium cursor-pointer">
                <input type="checkbox" checked={showTitle} onChange={(e) => setShowTitle(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4" />
                Show Title
              </label>
            )}
            <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-1 rounded-lg border border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors">
               <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </header>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedCourses.map((c, i) => {
              const mode = getEffectiveMode(c.code);
              return (
                <Card key={i} className="p-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex flex-col hover:shadow-xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-300 rounded-[24px]">
                   
                   {/* Top Badges */}
                   <div className="flex justify-between items-center mb-[-4px]">
                      <div className="flex items-center gap-1.5 bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                         <GraduationCap className="w-3.5 h-3.5" />
                         {c.code}
                      </div>
                      {c.grade?.toUpperCase() === 'F' ? (
                        <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200/60 dark:border-red-800">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                           Failed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60 dark:border-emerald-800">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           Completed
                        </div>
                      )}
                   </div>
                   
                   {/* Title & Credits */}
                   <div className="mb-0">
                     <h4 className="font-extrabold text-stone-900 dark:text-stone-100 text-[19px] mb-1.5 leading-tight tracking-tight" title={c.title}>{c.title}</h4>
                     <div className="flex items-center text-stone-400 dark:text-stone-500 text-sm font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600 mr-2" />
                       {c.credits.toFixed(2)} Cr
                     </div>
                   </div>
                   
                   {/* Divider */}
                   <div className="border-t border-stone-100 dark:border-stone-800/60 w-full mb-6 mt-auto" />
                   
                   {/* Bottom Stats with interactive flip */}
                   <div className="grid grid-cols-3 gap-2 mb-0 -mt-[30px]">
                      {/* Box 1: Grade (flips to GP or Letter on click/switch) */}
                      <button
                        type="button"
                        onClick={() => toggleCardGrade(c.code)}
                        title="Click to toggle Letter Grade / GP"
                        className={`group text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer rounded-[18px] p-3 h-[70px] flex flex-col justify-center ${
                          c.grade?.toUpperCase() === 'F' 
                            ? "bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700" 
                            : "bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700"
                        }`}
                      >
                         <div className="flex items-center justify-between w-full mb-1">
                           <span className={c.grade?.toUpperCase() === 'F' ? "text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest" : "text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"}>
                             {mode === 'letter' ? 'Grade' : 'GP'}
                           </span>
                           <ArrowLeftRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 text-stone-500 transition-opacity" />
                         </div>
                         <span className={c.grade?.toUpperCase() === 'F' ? "text-[18px] font-black text-red-700 dark:text-red-300 tracking-tight" : "text-[18px] font-black text-indigo-700 dark:text-indigo-300 tracking-tight"}>
                           {mode === 'letter' ? (c.grade || '--') : `${getGradePoint(c.grade)}`}
                         </span>
                      </button>

                      {/* Box 2: Point / Letter Counterpart */}
                      <button
                        type="button"
                        onClick={() => toggleCardGrade(c.code)}
                        title="Click to toggle Letter Grade / GP"
                        className="text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-stone-50/50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-800/50 hover:border-stone-300 dark:hover:border-stone-600 rounded-[18px] p-3 h-[70px] flex flex-col justify-center"
                      >
                         <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">
                           {mode === 'letter' ? 'Point' : 'Grade'}
                         </span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-[18px] font-black text-stone-900 dark:text-white tracking-tight">
                              {mode === 'letter' ? getGradePoint(c.grade) : (c.grade || '--')}
                            </span>
                         </div>
                      </button>

                      {/* Box 3: Marks */}
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[18px] p-3 h-[70px] flex flex-col justify-center">
                         <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Marks</span>
                         <span className="text-[18px] font-black text-stone-900 dark:text-white tracking-tight">{c.marks || getMarksRange(c.grade)}</span>
                      </div>
                   </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/30 dark:to-emerald-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white">Overall Academic Performance</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Calculated cumulatively across all completed semesters</p>
              </div>
              <div className="bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 px-6 py-3 rounded-xl text-center min-w-[140px]">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Cumulative GPA</span>
                <span className="text-3xl font-black text-[#8c1515]">{calculateGroupGPA(completedCourses)}</span>
              </div>
            </div>
            {groupedCompletedCourses.map(([semester, courses]) => (
               <div key={semester} className="space-y-3">
                 <div className="flex justify-between items-center font-bold text-sm uppercase tracking-widest text-[#8c1515] dark:text-[#ef4444] px-1 border-b border-stone-200 dark:border-stone-800 pb-2">
                   <span>{semester}</span>
                   <span className="text-stone-500 dark:text-stone-400">Group CGPA: <span className="text-[#8c1515] dark:text-[#ef4444]">{calculateGroupGPA(courses)}</span></span>
                 </div>
                 <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-x-auto shadow-sm no-scrollbar">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500 dark:text-stone-400">
                       <tr>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Course</th>
                         {showTitle && <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Title</th>}
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-center">Credits</th>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-center">Marks</th>
                         <th 
                           onClick={() => {
                             const next = gradeDisplayMode === 'letter' ? 'point' : 'letter';
                             setGradeDisplayMode(next);
                             setCardOverrides({});
                           }}
                           className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-right cursor-pointer hover:text-stone-900 dark:hover:text-white transition-colors select-none"
                           title="Click to toggle between Letter Grade and GP"
                         >
                           <span className="inline-flex items-center gap-1.5">
                             {gradeDisplayMode === 'letter' ? 'Grade' : 'GP'}
                             <ArrowLeftRight className="w-3 h-3 text-stone-400" />
                           </span>
                         </th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                       {courses.map((c, i) => {
                         const mode = getEffectiveMode(c.code);
                         return (
                           <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                             <td className="px-4 py-3 font-mono font-medium text-stone-900 dark:text-stone-100">{c.code}</td>
                             {showTitle && <td className="px-4 py-3 text-stone-700 dark:text-stone-300 whitespace-normal min-w-[200px]">{c.title}</td>}
                             <td className="px-4 py-3 text-center text-stone-600 dark:text-stone-400 font-medium">{c.credits.toFixed(2)}</td>
                             <td className="px-4 py-3 text-center text-stone-900 dark:text-stone-100 font-bold">{c.marks || getMarksRange(c.grade)}</td>
                             <td className="px-4 py-3 text-right">
                               <button
                                 type="button"
                                 onClick={() => toggleCardGrade(c.code)}
                                 title="Click to toggle Letter Grade / GP"
                                 className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-lg text-xs border transition-all active:scale-95 cursor-pointer ${
                                   c.grade?.toUpperCase() === 'F'
                                     ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 hover:border-red-400'
                                     : ['A+', 'A', 'A-'].includes(c.grade || '') 
                                       ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 hover:border-emerald-400' 
                                       : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50 hover:border-indigo-400'
                                 }`}>
                                 {mode === 'letter' ? (c.grade || '--') : getGradePoint(c.grade)}
                               </button>
                             </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
