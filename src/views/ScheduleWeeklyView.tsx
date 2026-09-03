import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { ScheduleTable } from '../components/ScheduleTable';
import { SCHEDULE_DATA } from '../data';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const START_HOUR = 8;
const END_HOUR = 18;

function timeToPixels(timeString: string): number {
  if (timeString === '-') return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = (hours - START_HOUR) * 60 + minutes;
  return (totalMinutes / 60) * 80; // 80px per hour
}

function formatTime12(time: string) {
  if (time === '-') return '-';
  const [h, m] = time.split(':');
  const hInt = parseInt(h);
  const ampm = hInt >= 12 ? 'PM' : 'AM';
  const h12 = hInt % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function ScheduleWeeklyView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const [view, setView] = useState<'Week' | 'Day'>('Week');
  
  return (
    <Card className="p-0 border-transparent shadow-sm overflow-hidden bg-white dark:bg-stone-900">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-stone-50 border-b border-stone-200 dark:bg-stone-900 dark:border-stone-800 gap-4">
         <div>
           <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">Class Schedule</h2>
           <p className="text-sm text-stone-500 dark:text-stone-400">{portal.student.currentSemester || 'Summer-26'} Semester</p>
         </div>
         <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select 
              value={portal.scheduleCourseFilter} 
              onChange={e => portal.setScheduleCourseFilter(e.target.value)}
              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-[#8c1515]/20 cursor-pointer shadow-sm text-stone-700 dark:text-stone-300 print:hidden"
            >
              <option value="All">All Courses</option>
              {Array.from(new Set(SCHEDULE_DATA.map(s => s.courseCode))).filter(c => c !== '-').map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            
            <select 
              value={portal.scheduleDayFilter} 
              onChange={e => portal.setScheduleDayFilter(e.target.value)}
              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-[#8c1515]/20 cursor-pointer shadow-sm text-stone-700 dark:text-stone-300 print:hidden"
            >
              <option value="All">All Days</option>
              {DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-sm font-bold transition-colors border border-stone-200 dark:border-stone-700 shadow-sm print:hidden">
              <Calendar className="w-4 h-4" /> Print PDF
            </button>
            <div className="flex gap-2 p-1 bg-stone-200/50 dark:bg-stone-800 rounded-lg print:hidden">
              <button 
                onClick={() => setView('Day')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'Day' ? 'bg-white dark:bg-stone-700 text-[#8c1515] dark:text-[#ef4444] shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
              >Day List</button>
              <button 
                onClick={() => setView('Week')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'Week' ? 'bg-white dark:bg-stone-700 text-[#8c1515] dark:text-[#ef4444] shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
              >Week Grid</button>
            </div>
         </div>
      </div>
      
      {view === 'Day' ? (
        <div className="p-4 sm:p-6 bg-white dark:bg-stone-950">
          <ScheduleTable schedule={portal.filteredSchedule} />
        </div>
      ) : (
        <div className="overflow-x-auto print:overflow-visible">
          <div className="min-w-[800px] print:min-w-full">
            {/* Header */}
            <div className="flex border-b border-stone-100 dark:border-stone-800">
              <div className="w-16 flex-shrink-0 border-r border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50"></div>
              {DAYS.map(day => (
                <div key={day} className="flex-1 py-3 text-center border-r border-stone-100 dark:border-stone-800 font-bold text-sm tracking-wide text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grid */}
            <div className="flex relative bg-white dark:bg-stone-950" style={{ height: `${(END_HOUR - START_HOUR) * 80}px` }}>
              {/* Time labels */}
              <div className="w-16 flex-shrink-0 border-r border-stone-100 dark:border-stone-800 relative bg-stone-50/50 dark:bg-stone-900/20">
                {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                  <div key={i} className="absolute w-full text-right pr-2 text-xs text-stone-400 dark:text-stone-500 font-medium" style={{ top: `${i * 80}px`, transform: 'translateY(-50%)' }}>
                    {START_HOUR + i > 12 ? START_HOUR + i - 12 : START_HOUR + i}:00
                    <span className="text-[9px] ml-0.5">{START_HOUR + i >= 12 ? 'PM' : 'AM'}</span>
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {DAYS.map(day => (
                <div key={day} className="flex-1 border-r border-stone-100 dark:border-stone-800 relative">
                  {/* Horizontal grid lines */}
                  {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                    <div key={i} className="absolute w-full border-t border-stone-100 dark:border-stone-800/50" style={{ top: `${i * 80}px` }}></div>
                  ))}
                  
                  {/* Events */}
                  {portal.filteredSchedule
                    .filter(c => c.day === day && c.start !== '-')
                    .map((cls, idx) => {
                      const top = timeToPixels(cls.start);
                      const bottom = timeToPixels(cls.end);
                      const height = Math.max(bottom - top, 20); // enforce min-height just in case
                      
                      return (
                        <div 
                          key={idx} 
                          className="absolute left-1 right-1 rounded-xl border border-[#8c1515]/30 dark:border-[#ef4444]/30 bg-[#8c1515]/10 dark:bg-[#ef4444]/10 p-2.5 overflow-hidden transition-all duration-200 cursor-pointer group shadow-sm z-10 hover:shadow-md hover:bg-[#8c1515]/20 dark:hover:bg-[#ef4444]/20 hover:-translate-y-0.5 hover:scale-[1.01]"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                           <div className="font-bold text-[#8c1515] dark:text-[#ef4444] text-xs leading-tight mb-1 break-words">{cls.courseCode}</div>
                           {height >= 60 && (
                              <>
                                <div className="flex items-center gap-1 text-[10px] lg:text-xs text-stone-600 dark:text-stone-300 mb-1 font-medium truncate">
                                   <Clock className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                                   {portal.is24HourFormat ? cls.start.substring(0, 5) : formatTime12(cls.start)} - {portal.is24HourFormat ? cls.end.substring(0, 5) : formatTime12(cls.end)}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] lg:text-xs text-stone-600 dark:text-stone-300 font-medium truncate">
                                   <MapPin className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                                   Room {cls.room}
                                </div>
                              </>
                           )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
