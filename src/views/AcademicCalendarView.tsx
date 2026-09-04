import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, AlertCircle, CreditCard, BookOpen, GraduationCap, Info, Search, Map, CalendarDays, Clock } from 'lucide-react';
import { Card, Badge } from '../components/ui';

interface CalendarEvent {
  activity: string;
  date: string;
  day: string;
  duration?: string;
  type: 'academic' | 'administrative' | 'financial' | 'holiday' | 'exam';
  highlight?: boolean;
  month: string;
}

const CALENDAR_DATA: CalendarEvent[] = [
  { activity: "Fall 2026 (Trimester start)", date: "6 Sep 2026", day: "Sunday", type: "academic", highlight: true, month: "September 2026" },
  { activity: "Advising & Registration for Day/Evening Students", date: "7 - 9 Sep 2026", day: "Mon - Wed", duration: "3 days", type: "administrative", month: "September 2026" },
  { activity: "Classes start for Day & Evening Students", date: "8 Sep 2026", day: "Tuesday", type: "academic", highlight: true, month: "September 2026" },
  { activity: "Advising & Registration for Weekend Students (Friday Batch)", date: "11 - 18 Sep 2026", day: "Fri - Fri", duration: "8 days", type: "administrative", month: "September 2026" },
  { activity: "Classes start for Weekend Students (Friday Batch)", date: "11 Sep 2026", day: "Friday", type: "academic", month: "September 2026" },
  { activity: "Advising & Registration for Weekend Students (Saturday Batch)", date: "12 - 19 Sep 2026", day: "Sat - Sat", duration: "8 days", type: "administrative", month: "September 2026" },
  { activity: "Classes start for Weekend Students (Saturday Batch)", date: "12 Sep 2026", day: "Saturday", type: "academic", month: "September 2026" },
  { activity: "Late registration starts for All Students (with Tk. 1000/- late fee)", date: "20 Sep 2026", day: "Sunday", type: "administrative", month: "September 2026" },
  
  { activity: "Last day to remove 'I' grade / Submit Summer 2026 Thesis & Projects", date: "2 Oct 2026", day: "Friday", type: "academic", month: "October 2026" },
  { activity: "Last day of Late Registration / Add or Drop with full refund (Existing Students)", date: "9 Oct 2026", day: "Friday", type: "administrative", month: "October 2026" },
  { activity: "Waiver Review and System Update", date: "11 Oct 2026", day: "Sunday", type: "administrative", month: "October 2026" },
  { activity: "Deadline: 1st Installment (50% of tuition fees)", date: "16 Oct 2026", day: "Friday", type: "financial", highlight: true, month: "October 2026" },
  { activity: "Holiday: Durga Puja", date: "20 - 21 Oct 2026", day: "Tue - Wed", duration: "2 days", type: "holiday", month: "October 2026" },
  { activity: "Last date of Admission for Freshers", date: "23 Oct 2026", day: "Friday", type: "administrative", month: "October 2026" },
  { activity: "Last day of Add or Drop with full refund (Freshers)", date: "27 Oct 2026", day: "Tuesday", type: "administrative", month: "October 2026" },
  { activity: "Midterm Exams (No regular classes during this period)", date: "28 Oct - 7 Nov 2026", day: "Wed - Sat", duration: "11 days", type: "exam", highlight: true, month: "October 2026" }, 
  
  { activity: "Course & Teacher Evaluation by students", date: "9 - 13 Nov 2026", day: "Mon - Fri", duration: "5 days", type: "academic", month: "November 2026" },
  { activity: "Deadline: 2nd Installment (30% of tuition fees)", date: "13 Nov 2026", day: "Friday", type: "financial", highlight: true, month: "November 2026" },
  { activity: "Last day to withdraw course(s) without refund", date: "27 Nov 2026", day: "Friday", type: "administrative", month: "November 2026" },
  { activity: "Classes end for Weekend Students", date: "27 Nov 2026", day: "Friday", type: "academic", month: "November 2026" },
  
  { activity: "Final Exams for Weekend Students", date: "4, 11 & 18 Dec 2026", day: "Fridays", duration: "3 days", type: "exam", month: "December 2026" },
  { activity: "Deadline: 3rd Installment (Remaining tuition fees)", date: "7 Dec 2026", day: "Monday", type: "financial", highlight: true, month: "December 2026" },
  { activity: "Classes end for Day and Evening Students", date: "9 Dec 2026", day: "Wednesday", type: "academic", month: "December 2026" },
  { activity: "Final Exams for Day & Evening Students", date: "10 - 20 Dec 2026", day: "Thu - Sun", duration: "10 days", type: "exam", highlight: true, month: "December 2026" },
  { activity: "Holiday: Victory Day", date: "16 Dec 2026", day: "Wednesday", duration: "1 day", type: "holiday", month: "December 2026" },
  { activity: "Publication of Results & Final Grade Submission", date: "24 Dec 2026", day: "Thursday", type: "academic", month: "December 2026" },
  { activity: "Holiday: Christmas Day", date: "25 Dec 2026", day: "Friday", duration: "1 day", type: "holiday", month: "December 2026" },
  { activity: "Holiday: Winter Vacation", date: "26 Dec 2026 - 3 Jan 2027", day: "Sat - Sun", duration: "9 days", type: "holiday", month: "December 2026" },
  
  { activity: "Spring 2027 (Trimester start)", date: "4 Jan 2027", day: "Monday", type: "academic", highlight: true, month: "January 2027" },
];

const TYPE_CONFIG: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
  academic: { label: 'Academic', icon: BookOpen, color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  administrative: { label: 'Admin & Deadlines', icon: CalendarDays, color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  financial: { label: 'Financial', icon: CreditCard, color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  holiday: { label: 'Holiday', icon: Map, color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  exam: { label: 'Exam', icon: AlertCircle, color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
};

export function AcademicCalendarView() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and group data by month
  const groupedData = useMemo(() => {
    const filtered = CALENDAR_DATA.filter(event => {
      const matchesFilter = filterType === 'all' || event.type === filterType;
      const matchesSearch = event.activity.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.date.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return filtered.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [filterType, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Academic Calendar</h2>
          <p className="text-sm text-stone-500 mt-1">Fall 2026 Trimester Agenda & Deadlines</p>
        </div>
      </div>

      {/* Student-Centric Summary Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-stone-900 border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-3 text-blue-900 dark:text-blue-100 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Trimester Timeline</h3>
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mt-1">
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">Classes Start</span><strong className="text-stone-900 dark:text-white">8 Sep 2026</strong></div>
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">Classes End</span><strong className="text-stone-900 dark:text-white">9 Dec 2026</strong></div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200/50 dark:border-blue-800/50"><span className="text-stone-500 dark:text-stone-400">Spring '27 Starts</span><strong className="text-stone-900 dark:text-white">4 Jan 2027</strong></div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-stone-900 border-red-100 dark:border-red-900/50">
          <div className="flex items-center gap-3 text-red-900 dark:text-red-100 mb-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Exam Periods</h3>
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mt-1">
            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-1"><span className="text-stone-500 dark:text-stone-400">Midterm Exams</span><strong className="text-stone-900 dark:text-white text-right">28 Oct - 7 Nov</strong></div>
            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-1"><span className="text-stone-500 dark:text-stone-400">Finals (Day/Eve)</span><strong className="text-stone-900 dark:text-white text-right">10 - 20 Dec</strong></div>
            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-1"><span className="text-stone-500 dark:text-stone-400">Finals (Weekend)</span><strong className="text-stone-900 dark:text-white text-right">4, 11, 18 Dec</strong></div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-stone-900 border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-100 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Tuition Deadlines</h3>
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mt-1">
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">1st Installment (50%)</span><strong className="text-stone-900 dark:text-white">16 Oct</strong></div>
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">2nd Installment (30%)</span><strong className="text-stone-900 dark:text-white">13 Nov</strong></div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50"><span className="text-stone-500 dark:text-stone-400">3rd Installment (Rest)</span><strong className="text-stone-900 dark:text-white">7 Dec</strong></div>
          </div>
        </Card>
      </div>

      {/* Controls: Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-stone-900 p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm sticky top-0 z-20">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar" data-lenis-prevent>
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filterType === 'all' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
          >
            All Events
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <button 
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${filterType === key ? `${config.bg} ${config.color} shadow-sm border border-transparent` : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'}`}
            >
              <config.icon className="w-4 h-4 opacity-70" />
              {config.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search calendar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 transition-all placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Agenda/List View Grouped by Month */}
      <div className="space-y-10">
        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([month, events]) => (
            <motion.div 
              key={month} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24"
            >
              <h3 className="text-xl font-black text-stone-900 dark:text-white mb-4 flex items-center gap-3">
                {month}
                <div className="h-px bg-stone-200 dark:bg-stone-800 flex-1 mt-1"></div>
              </h3>
              <Card className="overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-stone-100 dark:divide-stone-800/60">
                  {(events as CalendarEvent[]).map((event, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                         <div className={`font-black text-lg leading-tight ${event.highlight ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                           {event.date}
                         </div>
                         <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${TYPE_CONFIG[event.type].bg} ${TYPE_CONFIG[event.type].color} border-none`}>
                           {React.createElement(TYPE_CONFIG[event.type].icon, { className: 'w-3 h-3' })}
                           {TYPE_CONFIG[event.type].label}
                         </span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <p className={`text-sm ${event.highlight ? 'font-bold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                           {event.activity}
                         </p>
                         <div className="flex items-center gap-3 text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1">
                           <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-60" /> {event.day}</span>
                           {event.duration && (
                             <>
                               <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                               <span>{event.duration}</span>
                             </>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Clean Rows */}
                <div className="hidden md:flex flex-col divide-y divide-stone-100 dark:divide-stone-800/60">
                  {(events as CalendarEvent[]).map((event, i) => (
                    <div key={i} className="flex justify-between items-center py-3.5 px-6 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors group">
                      
                      <div className="flex items-center w-[160px] shrink-0 gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-black text-sm ${event.highlight ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100'}`}>
                            {event.date.replace(/ 202\d/, '')}
                          </span>
                          <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{event.day}</span>
                        </div>
                      </div>

                      <div className="flex-1 px-4 border-l border-stone-100 dark:border-stone-800/60 py-1">
                        <span className={`text-sm ${event.highlight ? 'font-bold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-200'} transition-colors`}>
                          {event.activity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-right justify-end shrink-0 pl-4">
                        {event.duration && (
                          <div className="flex flex-col items-end">
                             <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Duration</span>
                             <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                               {event.duration}
                             </span>
                          </div>
                        )}
                        <div className="w-[120px] flex justify-end">
                          <Badge variant="outline" className={`font-sans text-[10px] uppercase font-bold rounded border-none px-2 py-1 ${TYPE_CONFIG[event.type].bg} ${TYPE_CONFIG[event.type].color}`}>
                            <div className="flex items-center gap-1.5">
                               {React.createElement(TYPE_CONFIG[event.type].icon, { className: 'w-3 h-3 shrink-0' })}
                               <span className="whitespace-nowrap">{TYPE_CONFIG[event.type].label}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">No events found</h3>
            <p className="text-stone-500 dark:text-stone-400">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
      
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200/60 dark:border-yellow-800/60 rounded-2xl">
        <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 dark:text-yellow-400/90 leading-relaxed">
          <strong>Note:</strong> Additional or optional holidays not mentioned in this calendar are subject to announcement by the Vice-Chancellor. The University Authority reserves the right to change dates and deadlines if required.
        </p>
      </div>
    </div>
  );
}
