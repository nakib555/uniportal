import React from 'react';
import { Card, Badge } from '../components/ui';
import { Calendar, MapPin, Clock, Lock, AlertCircle } from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';

export function ExamsView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  // If accounts restriction is active (i.e. accountBalance is negative / outstanding dues)
  if (portal && portal.student.accountBalance < 0) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Exam Routine & Seat Plan</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Your personalized final examinations schedule.</p>
        </div>
        <Card className="p-10 flex flex-col items-center justify-center text-center border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl shadow-sm">
           <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-800 animate-pulse">
              <Lock className="w-8 h-8 text-[#8c1515] dark:text-[#ef4444]" />
           </div>
           <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Access Restricted</h3>
           <p className="text-stone-700 dark:text-stone-300 max-w-md mb-6 leading-relaxed">
              Your account has restriction to view this information. Please contact Accounts Office.
           </p>
           <div className="flex items-center gap-2 text-sm bg-rose-100/50 dark:bg-rose-950/30 text-[#8c1515] dark:text-[#ef4444] px-4 py-2 rounded-xl font-bold border border-rose-200/50 dark:border-rose-800/30">
              <AlertCircle className="w-4 h-4" /> Outstanding Balance: ৳{Math.abs(portal.student.accountBalance).toLocaleString()} Tk
           </div>
        </Card>
      </div>
    );
  }

  const exams = portal ? portal.studentData.exams : [
    { courseCode: 'CSE301', title: 'Database Systems', section: '1', type: 'Final Exam', day: 'Saturday', date: '12-12-2026', time: '10:00 AM - 12:00 PM', room: 'B-402', campus: 'Gulshan', faculty: 'TBA' },
    { courseCode: 'MAT123', title: 'Calculus I', section: '1', type: 'Final Exam', day: 'Monday', date: '14-12-2026', time: '02:00 PM - 04:00 PM', room: 'Gymnasium', campus: 'Gulshan', faculty: 'TBA' },
    { courseCode: 'ENG101', title: 'English Reading & Composition', section: '1', type: 'Final Exam', day: 'Wednesday', date: '16-12-2026', time: '08:30 AM - 10:30 AM', room: 'A-101', campus: 'Gulshan', faculty: 'TBA' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Exam Routine & Seat Plan</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Your personalized final examinations schedule.</p>
      </div>
      <Card className="p-0 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm bg-white dark:bg-stone-950">
         <div className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 px-6 py-4">
            <h3 className="font-bold text-stone-700 dark:text-stone-300">Summer-26 Final Exams</h3>
         </div>
         <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {exams.map(exam => (
              <div key={exam.courseCode} className="p-6 flex flex-col md:flex-row gap-6 justify-between hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                 <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                       <Badge variant="brand">{exam.courseCode}</Badge>
                       <span className="font-bold text-lg text-stone-900 dark:text-white">{exam.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-600 dark:text-stone-400">
                       <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-stone-400 dark:text-stone-500" /> {exam.day}, {exam.date}</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-stone-400 dark:text-stone-500" /> {exam.time}</span>
                    </div>
                 </div>
                 <div className="bg-stone-100 dark:bg-stone-900 rounded-xl p-4 flex flex-col justify-center items-end min-w-[200px]">
                    <div className="text-xs uppercase font-bold text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Seat Allocation</div>
                    <div className="font-bold flex items-center justify-end w-full gap-2 text-stone-900 dark:text-white"><MapPin className="w-4 h-4 text-[#8c1515] dark:text-[#ef4444]" /> Room {exam.room}</div>
                    <div className="text-sm font-medium mt-1 bg-white dark:bg-stone-800 px-2 py-1 rounded shadow-sm border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">Section {exam.section}</div>
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
}
