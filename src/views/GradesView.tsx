import React, { useMemo } from 'react';
import { Card, Badge } from '../components/ui';
import { COMPLETED_COURSES } from '../data';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { Download } from 'lucide-react';
import { PrintableTranscript } from '../components/print/PrintableTranscript';

const getMarksRange = (grade?: string) => {
  const scale: Record<string, string> = {
    'A+': '80-100', 'A': '75-79', 'A-': '70-74',
    'B+': '65-69', 'B': '60-64', 'B-': '55-59',
    'C+': '50-54', 'C': '45-49', 'D': '40-44', 'F': '0-39'
  };
  return grade && scale[grade] ? scale[grade] : '--';
};

export function GradesView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const completedCourses = portal ? portal.completedCourses : COMPLETED_COURSES;
  const student = portal ? portal.student : null;
  const cgpa = student ? student.cgpa : 3.85;

  const semesters = useMemo(() => {
    const semestersMap: Record<string, typeof completedCourses> = {};
    completedCourses.forEach(course => {
      const term = course.semester || (student ? student.admissionSemester : 'Spring-26');
      if (!semestersMap[term]) {
        semestersMap[term] = [];
      }
      semestersMap[term].push(course);
    });

    return Object.entries(semestersMap).map(([term, courses]) => {
      const historyGPA = student?.gpaHistory?.find(h => h.semester === term)?.gpa;
      const semesterGpa = historyGPA !== undefined ? historyGPA : cgpa;
      return {
        term,
        gpa: semesterGpa,
        courses
      };
    });
  }, [completedCourses, student, cgpa]);

  return (
    <>
      <PrintableTranscript semesters={semesters} />
      <div className="space-y-6 print-hide">
        <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
          <div>
             <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Academic Transcript</h2>
             <p className="text-stone-500 dark:text-stone-400">Cumulative GPA: <span className="font-bold text-stone-900 dark:text-stone-100">{cgpa.toFixed(2)}</span></p>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white px-4 py-2 rounded-xl font-bold transition-colors">
             <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

      {semesters.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950">
          <p className="text-base font-bold text-stone-700 dark:text-stone-300">No Historical Grades Available</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Completed course records and semester GPA evaluations will appear here upon completion of terms.</p>
        </div>
      ) : (
        semesters.map(semester => (
        <Card key={semester.term} className="overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="p-4 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
             <h3 className="font-bold text-stone-900 dark:text-white">{semester.term}</h3>
             <Badge variant="success">Semester GPA: {semester.gpa.toFixed(2)}</Badge>
          </div>
                    <div className="overflow-x-auto custom-scrollbar overscroll-x-contain rounded-b-xl">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-stone-50/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800">
                 <tr>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[12px] sticky left-0 z-10 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur border-r border-stone-200 dark:border-stone-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.2)]">Course Code</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[12px]">Course Title</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[12px] text-center">Credits</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[12px] text-center">Marks</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[12px] text-right">Grade</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                 {semester.courses.map(course => (
                   <tr key={course.code} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-mono font-bold text-stone-900 dark:text-stone-100 sticky left-0 z-10 bg-white/95 dark:bg-stone-950/95 backdrop-blur border-r border-stone-200 dark:border-stone-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.2)]">{course.code}</td>
                      <td className="px-5 py-4 text-sm text-stone-700 dark:text-stone-300 min-w-[200px] whitespace-normal leading-snug">{course.title}</td>
                      <td className="px-5 py-4 text-sm text-center text-stone-600 dark:text-stone-400 font-medium">{course.credits.toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-center font-bold text-stone-900 dark:text-stone-100">{course.marks || getMarksRange(course.grade)}</td>
                      <td className="px-5 py-4 text-sm text-right">
                         <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs border ${
                            course.grade?.toUpperCase() === 'F' 
                              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50'
                         }`}>
                           {course.grade}
                         </span>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </Card>
      )))}
    </div>
    </>
  );
}
