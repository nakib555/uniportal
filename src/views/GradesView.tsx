import React, { useMemo } from 'react';
import { Card, Badge } from '../components/ui';
import { COMPLETED_COURSES } from '../data';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { Download } from 'lucide-react';
import { PrintableTranscript } from '../components/print/PrintableTranscript';

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
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
             {semester.courses.map(course => (
               <div key={course.code} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                     <div className="font-bold text-lg text-stone-900 dark:text-white">{course.code}</div>
                     <div className="text-sm text-stone-500 dark:text-stone-400">{course.title}</div>
                  </div>
                  <div className="flex gap-8 mt-4 md:mt-0 text-right">
                     <div>
                        <div className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-widest">Credits</div>
                        <div className="font-bold text-stone-900 dark:text-stone-100">{course.credits}</div>
                     </div>
                     <div>
                        <div className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-widest">Grade</div>
                        <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{course.grade}</div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </Card>
      )))}
    </div>
    </>
  );
}
