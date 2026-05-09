import React from 'react';
import { MapPin, Users, Filter, Calendar, Clock } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../../hooks/usePortalLogic';
import { REGISTERED_COURSES } from '../../data';

export function ScheduleView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const { 
    is24HourFormat, setIs24HourFormat,
    scheduleCourseFilter, setScheduleCourseFilter,
    scheduleDayFilter, setScheduleDayFilter,
    groupedSchedule
  } = portal;
  
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hoursStr, minutesStr] = timeString.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    
    if (is24HourFormat) {
      return `${hoursStr.padStart(2, '0')}:${minutes}`;
    }
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <select 
          value={scheduleCourseFilter} 
          onChange={e => setScheduleCourseFilter(e.target.value)}
          className="bg-stone-100 dark:bg-stone-800 border-none text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#8c1515]/20 cursor-pointer"
        >
          <option value="All">All Courses</option>
          {REGISTERED_COURSES.map(c => (
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>
        
        <select 
          value={scheduleDayFilter} 
          onChange={e => setScheduleDayFilter(e.target.value)}
          className="bg-stone-100 dark:bg-stone-800 border-none text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#8c1515]/20 cursor-pointer"
        >
          <option value="All">All Days</option>
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div className="flex-1" />
        
        <label className="flex items-center gap-3 cursor-pointer select-none bg-stone-50 dark:bg-stone-800/50 px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-800">
           <span className="text-sm font-medium text-stone-600 dark:text-stone-300">24h format</span>
           <div className="relative">
             <input type="checkbox" className="sr-only peer" checked={is24HourFormat} onChange={() => setIs24HourFormat(!is24HourFormat)} />
             <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-stone-600 peer-checked:bg-[#8c1515]"></div>
           </div>
        </label>
      </Card>

      {groupedSchedule.length > 0 ? (
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth hide-scrollbar gap-6 items-start">
          {groupedSchedule.map(([day, classes]) => (
            <div key={day} className="flex-none w-[300px] md:w-[340px] flex flex-col">
              <div className="flex items-center justify-between mb-4 sticky top-0 py-2 bg-[#f9fafb] dark:bg-stone-950 z-10 transition-colors">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-stone-900 dark:text-white tracking-tight">{day}</h3>
                  <Badge variant="outline" className="bg-white dark:bg-stone-900 rounded-full">{classes.length}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-stone-200 dark:bg-stone-800 rounded-full" />
                
                {classes.map((cls, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    {/* Timeline dot */}
                    <div className="absolute left-[11px] top-6 w-[10px] h-[10px] rounded-full bg-stone-300 dark:bg-stone-600 ring-4 ring-[#f9fafb] dark:ring-stone-950 group-hover:bg-[#8c1515] dark:group-hover:bg-[#ef4444] transition-colors" />
                    
                    <Card className="p-5 border-transparent group-hover:border-[#8c1515]/30 dark:group-hover:border-[#ef4444]/30 hover:shadow-lg hover:shadow-[#8c1515]/5 transition-all overflow-hidden relative border border-stone-200/50 dark:border-stone-800/80">
                      {/* Accent line on the left of the card */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8c1515] dark:bg-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                         <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                           <Clock className="w-3.5 h-3.5 text-stone-400" />
                           {formatTime(cls.start)} <span className="text-stone-400 font-medium px-0.5">-</span> <span className="text-stone-500 font-medium">{formatTime(cls.end)}</span>
                         </div>
                         <Badge variant="brand" className="text-[10px] uppercase tracking-wider">{cls.type}</Badge>
                      </div>
                      
                      <h4 className="font-bold text-lg text-[#8c1515] dark:text-[#ef4444] mb-1">{cls.courseCode}</h4>
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-4 line-clamp-2">{cls.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                         <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                           <MapPin className="w-3.5 h-3.5 text-stone-400" /> Room {cls.room}
                         </span>
                         <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                           <Users className="w-3.5 h-3.5 text-stone-400" /> Sec {cls.section}
                         </span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 border-dashed">
           <Calendar className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
           <p className="text-stone-600 dark:text-stone-400 font-medium text-lg">No classes found matching your filters.</p>
           <button 
             onClick={() => { setScheduleCourseFilter('All'); setScheduleDayFilter('All'); }}
             className="mt-4 text-[#8c1515] font-medium hover:underline"
           >
             Clear filters
           </button>
        </div>
      )}
    </div>
  );
}
