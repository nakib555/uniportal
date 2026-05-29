import React, { useMemo } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { Course } from '../data';
import { Download } from 'lucide-react';
import { PrintableCompletedCourses } from '../components/print/PrintableCompletedCourses';

export const CompletedCoursesView: React.FC = () => {
  const { completedCourses } = useAppStore();

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
          <button onClick={() => window.print()} className="flex w-fit items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
             <Download className="w-4 h-4" /> Download PDF
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {groupedCompletedCourses.map(([semester, courses]) => (
            <div key={semester} className="space-y-4">
              <div className="font-bold text-xs uppercase tracking-widest text-[#8c1515] dark:text-[#ef4444] px-1 mb-2">{semester}</div>
              <div className="space-y-4">
                {courses.map((c, i) => (
                  <Card key={i} className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex flex-col hover:shadow-md transition-shadow hover:-translate-y-1">
                     <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="font-mono bg-stone-50 dark:bg-stone-950">{c.code}</Badge>
                        <span className={`font-black tracking-tight px-2.5 py-1 rounded-md text-xs border ${['A+', 'A', 'A-'].includes(c.grade || '') ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50'}`}>
                          {c.grade}
                        </span>
                     </div>
                     <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-2 mt-1 leading-snug line-clamp-2" title={c.title}>{c.title}</h4>
                     <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-auto pt-2 border-t border-stone-100 dark:border-stone-800">
                        Credits: <span className="font-bold text-stone-700 dark:text-stone-300 ml-1">{c.credits.toFixed(2)}</span>
                     </div>
                  </Card>
                ))}
              </div>
            </div>
         ))}
      </div>
    </div>
    </>
  );
};
