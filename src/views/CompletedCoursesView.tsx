import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/card';
import { useAppStore } from '../store';
import { Course } from '../data';
import { Download, LayoutGrid, List, GraduationCap } from 'lucide-react';
import { PrintableCompletedCourses } from '../components/print/PrintableCompletedCourses';

const getGradePoint = (grade?: string) => {
  const scale: Record<string, string> = { 
    'A+': '4.00', 'A': '4.00', 'A-': '3.70', 
    'B+': '3.30', 'B': '3.00', 'B-': '2.70', 
    'C+': '2.30', 'C': '2.00', 'C-': '1.70', 
    'D+': '1.30', 'D': '1.00', 'F': '0.00' 
  };
  return grade && scale[grade] ? scale[grade] : '-.--';
};

export const CompletedCoursesView: React.FC = () => {
  const { completedCourses } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
            <p className="text-stone-500 dark:text-stone-400 mt-1">List of all courses you have completed so far.</p>
          </div>
          <div className="flex items-center gap-3">
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
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
               <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </header>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedCourses.map((c, i) => (
                <Card key={i} className="p-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex flex-col hover:shadow-xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-300 rounded-[24px]">
                   
                   {/* Top Badges */}
                   <div className="flex justify-between items-center mb-[-4px]">
                      <div className="flex items-center gap-1.5 bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                         <GraduationCap className="w-3.5 h-3.5" />
                         {c.code}
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60 dark:border-emerald-800">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         Completed
                      </div>
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
                   
                   {/* Bottom Stats */}
                   <div className="grid grid-cols-3 gap-2 mb-0 -mt-[30px]">
                      {/* Letter Grade */}
                      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[18px] p-3 h-[70px] flex flex-col justify-center">
                         <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">Grade</span>
                         <span className="text-[18px] font-black text-indigo-700 dark:text-indigo-300 tracking-tight">{c.grade}</span>
                      </div>
                      {/* Grade Point */}
                      <div className="bg-stone-50/50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-800/50 rounded-[18px] p-3 h-[70px] flex flex-col justify-center">
                         <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1.5">Point</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-[18px] font-black text-stone-900 dark:text-white tracking-tight">{getGradePoint(c.grade)}</span>
                         </div>
                      </div>
                      {/* Marks */}
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[18px] p-3 h-[70px] flex flex-col justify-center">
                         <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Marks</span>
                         <span className="text-[18px] font-black text-stone-900 dark:text-white tracking-tight">{c.marks || '--'}</span>
                      </div>
                   </div>
                </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {groupedCompletedCourses.map(([semester, courses]) => (
               <div key={semester} className="space-y-3">
                 <div className="font-bold text-sm uppercase tracking-widest text-[#8c1515] dark:text-[#ef4444] px-1 border-b border-stone-200 dark:border-stone-800 pb-2">{semester}</div>
                 <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-x-auto shadow-sm no-scrollbar">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500 dark:text-stone-400">
                       <tr>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Course</th>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Title</th>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-center">Credits</th>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-center">Marks</th>
                         <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-right">Grade</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                       {courses.map((c, i) => (
                         <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                           <td className="px-4 py-3 font-mono font-medium text-stone-900 dark:text-stone-100">{c.code}</td>
                           <td className="px-4 py-3 text-stone-700 dark:text-stone-300 whitespace-normal min-w-[200px]">{c.title}</td>
                           <td className="px-4 py-3 text-center text-stone-600 dark:text-stone-400 font-medium">{c.credits.toFixed(2)}</td>
                           <td className="px-4 py-3 text-center text-stone-900 dark:text-stone-100 font-bold">{c.marks || '--'}</td>
                           <td className="px-4 py-3 text-right">
                             <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs border ${['A+', 'A', 'A-'].includes(c.grade || '') ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50'}`}>
                               {c.grade}
                             </span>
                           </td>
                         </tr>
                       ))}
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
