import React from 'react';
import { Card, Badge } from '../components/ui';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function ExamsView() {
  const exams = [
    { code: 'CSE301', title: 'Database Systems', date: 'Dec 12, 2026', time: '10:00 AM', room: 'B-402', seat: 'Row 4, Seat 12' },
    { code: 'MAT123', title: 'Calculus I', date: 'Dec 14, 2026', time: '02:00 PM', room: 'Gymnasium', seat: 'Section C, Seat 45' },
    { code: 'ENG101', title: 'English Reading', date: 'Dec 16, 2026', time: '08:30 AM', room: 'A-101', seat: 'Row 1, Seat 5' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Exam Routine & Seat Plan</h2>
      <Card className="p-0 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm bg-white dark:bg-stone-950">
         <div className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 px-6 py-4">
            <h3 className="font-bold text-stone-700 dark:text-stone-300">Fall 2026 Final Exams</h3>
         </div>
         <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {exams.map(exam => (
              <div key={exam.code} className="p-6 flex flex-col md:flex-row gap-6 justify-between hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                 <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                       <Badge variant="brand">{exam.code}</Badge>
                       <span className="font-bold text-lg text-stone-900 dark:text-white">{exam.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-600 dark:text-stone-400">
                       <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-stone-400 dark:text-stone-500" /> {exam.date}</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-stone-400 dark:text-stone-500" /> {exam.time}</span>
                    </div>
                 </div>
                 <div className="bg-stone-100 dark:bg-stone-900 rounded-xl p-4 flex flex-col justify-center items-end min-w-[200px]">
                    <div className="text-xs uppercase font-bold text-stone-400 dark:text-stone-500 mb-1 tracking-widest">Seat Allocation</div>
                    <div className="font-bold flex items-center justify-end w-full gap-2 text-stone-900 dark:text-white"><MapPin className="w-4 h-4 text-[#8c1515] dark:text-[#ef4444]" /> Room {exam.room}</div>
                    <div className="text-sm font-medium mt-1 bg-white dark:bg-stone-800 px-2 py-1 rounded shadow-sm border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">{exam.seat}</div>
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
}
