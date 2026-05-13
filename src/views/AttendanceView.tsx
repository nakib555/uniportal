import React from 'react';
import { Card } from '../components/ui';
import { REGISTERED_COURSES } from '../data';
import { CheckCircle2, XCircle } from 'lucide-react';

export function AttendanceView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Attendance Tracking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {REGISTERED_COURSES.map(course => {
            const totalClasses = 24;
            const attended = Math.floor(Math.random() * 5) + 18;
            const percentage = (attended / totalClasses) * 100;
            const isWarning = percentage < 80;

            return (
              <Card key={course.code} className="p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors">{course.code}</h3>
                       <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-1">{course.title}</p>
                    </div>
                    <div className={`text-xl font-black ${isWarning ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                       {percentage.toFixed(0)}%
                    </div>
                 </div>
                 
                 <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2.5 mb-4">
                    <div className={`h-2.5 rounded-full ${isWarning ? 'bg-rose-500 dark:bg-rose-400' : 'bg-emerald-500 dark:bg-emerald-400'}`} style={{ width: `${percentage}%` }}></div>
                 </div>

                 <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><CheckCircle2 className="w-4 h-4" /> {attended} Present</span>
                    <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-medium"><XCircle className="w-4 h-4" /> {totalClasses - attended} Absent</span>
                 </div>
              </Card>
            )
         })}
      </div>
    </div>
  );
}
