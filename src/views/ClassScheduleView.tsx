import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { SCHEDULE_DATA } from '../data';
import { formatTime } from '../lib/utils';
import { Calendar, Users, MapPin, Download } from 'lucide-react';

export const ClassScheduleView: React.FC = () => {
  const { is24HourFormat } = useAppStore();
  const [scheduleCourseFilter, setScheduleCourseFilter] = useState("All");
  const [scheduleDayFilter, setScheduleDayFilter] = useState("All");

  const filteredSchedule = useMemo(() => {
    return SCHEDULE_DATA.filter(s => {
      const matchCourse = scheduleCourseFilter === "All" || s.courseCode === scheduleCourseFilter;
      const matchDay = scheduleDayFilter === "All" || s.day === scheduleDayFilter;
      return matchCourse && matchDay;
    });
  }, [scheduleCourseFilter, scheduleDayFilter]);

  const groupedSchedule = useMemo(() => {
    const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const groups: Record<string, typeof SCHEDULE_DATA> = {};
    daysOrder.forEach(day => groups[day] = []);
    
    filteredSchedule.forEach(s => {
      groups[s.day]?.push(s);
    });
    
    Object.values(groups).forEach(group => {
      group.sort((a, b) => a.start.localeCompare(b.start));
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredSchedule]);

  const uniqueCourses = Array.from(new Set(SCHEDULE_DATA.map(s => s.courseCode)));
  const uniqueDays = Array.from(new Set(SCHEDULE_DATA.map(s => s.day)));

  return (
    <div className="space-y-6 max-w-4xl max-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Class Schedule</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Your weekly academic routine.</p>
        </div>
        <button onClick={() => window.print()} className="flex w-fit items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Print PDF
        </button>
      </header>

      <Card className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-4 mb-4">
         <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5 ml-1">Day</label>
            <select 
              value={scheduleDayFilter} 
              onChange={(e) => setScheduleDayFilter(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-sm rounded-xl py-2 px-3 outline-none"
            >
              <option value="All">All Days</option>
              {uniqueDays.map(day => (
                 <option key={day} value={day}>{day}</option>
              ))}
            </select>
         </div>
         <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5 ml-1">Course</label>
            <select 
              value={scheduleCourseFilter} 
              onChange={(e) => setScheduleCourseFilter(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-sm rounded-xl py-2 px-3 outline-none"
            >
              <option value="All">All Courses</option>
              {uniqueCourses.map(code => (
                 <option key={code} value={code}>{code}</option>
              ))}
            </select>
         </div>
      </Card>

      {groupedSchedule.length === 0 ? (
         <Card className="p-10 flex flex-col items-center justify-center text-center">
            <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-700 mb-3" />
            <h3 className="font-bold text-stone-900 dark:text-white text-lg">No classes found</h3>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Try adjusting your filters.</p>
         </Card>
      ) : (
         <div className="space-y-6">
           {groupedSchedule.map(([day, classes]) => (
             <Card key={day} className="overflow-hidden bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-stone-50/80 dark:bg-stone-950 px-5 sm:px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                   <h3 className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#8c1515]/10 dark:bg-[#ef4444]/10 flex items-center justify-center">
                         <Calendar className="w-4 h-4 text-[#8c1515] dark:text-[#ef4444]" />
                      </div>
                      {day}
                   </h3>
                   <Badge variant="outline" className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold">{classes.length} {classes.length === 1 ? 'Class' : 'Classes'}</Badge>
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                   {classes.map((s, i) => (
                      <div key={i} className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors group">
                         <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="bg-stone-100/80 dark:bg-stone-800/80 shrink-0 px-3 py-2 rounded-xl text-center min-w-[100px] border border-stone-200/60 dark:border-stone-700/60 shadow-sm group-hover:border-stone-300 dark:group-hover:border-stone-600 transition-colors">
                               <div className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight">{formatTime(s.start, is24HourFormat)}</div>
                               <div className="text-[9px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-widest my-0.5">to</div>
                               <div className="font-mono font-bold text-stone-600 dark:text-stone-400 text-sm tracking-tight">{formatTime(s.end, is24HourFormat)}</div>
                            </div>
                            <div className="pt-0.5">
                               <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono bg-[#8c1515]/5 dark:bg-[#ef4444]/10 font-bold text-[#8c1515] dark:text-[#ef4444] border-[#8c1515]/20 dark:border-[#ef4444]/20 shadow-sm">{s.courseCode}</Badge>
                                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full ring-1 ring-stone-200 dark:ring-stone-700 uppercase tracking-wider">Sec 5</span>
                               </div>
                               <div className="font-medium text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2 bg-stone-50 dark:bg-stone-800/50 w-fit px-2.5 py-1 rounded-md border border-stone-100 dark:border-stone-800/50">
                                  <div className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                                     <Users className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                                  </div>
                                  {s.faculty}
                               </div>
                            </div>
                         </div>
                         <div className="sm:text-right flex items-center gap-3 sm:block bg-stone-50 dark:bg-stone-800/30 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none border border-stone-100 sm:border-none dark:border-stone-800/50">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 sm:hidden flex items-center justify-center shrink-0">
                               <MapPin className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div>
                               <div className="text-[10px] hidden sm:block font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1"><MapPin className="w-3 h-3" /> Room</div>
                               <div className="font-bold text-stone-900 dark:text-white sm:text-2xl tracking-tight">{s.room}</div>
                               <div className="text-xs text-stone-500 font-medium block sm:hidden mt-0.5">{s.campus}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>
           ))}
         </div>
      )}
    </div>
  );
};
