import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, AlertCircle, CreditCard, BookOpen, GraduationCap, Info, Search, Map, CalendarDays, Clock, ChevronLeft, ChevronRight, LayoutList, CheckCircle2, ChevronDown, Sparkles, Layers, ListFilter } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { useAppStore } from '../store';
import { getStudentData } from '../data';

interface CalendarEvent {
  activity: string;
  details?: string;
  date: string;
  day: string;
  duration?: string;
  type: 'academic' | 'administrative' | 'financial' | 'holiday' | 'exam';
  highlight?: boolean;
  month: string;
  dateKeys: string[];
}

const CALENDAR_DATA: CalendarEvent[] = [
  // September 2026
  { 
    activity: "Fall 2026 (Trimester start)", 
    date: "6 Sep 2026", 
    day: "Sunday", 
    type: "academic", 
    highlight: true, 
    month: "September 2026", 
    dateKeys: ['2026-09-06'] 
  },
  { 
    activity: "Advising/Registration for Day and Evening Students of Trimester", 
    details: "With payment of Semester Fee",
    date: "7 - 9 Sep 2026", 
    day: "Monday - Wednesday", 
    duration: "3 days", 
    type: "administrative", 
    month: "September 2026", 
    dateKeys: ['2026-09-07', '2026-09-08', '2026-09-09'] 
  },
  { 
    activity: "Classes start for Day and Evening Students", 
    date: "8 Sep 2026", 
    day: "Tuesday", 
    type: "academic", 
    highlight: true, 
    month: "September 2026", 
    dateKeys: ['2026-09-08'] 
  },
  { 
    activity: "Advising/Registration for Weekend students (Friday Batch) of Trimester", 
    details: "With payment of Semester Fee",
    date: "11 - 18 Sep 2026", 
    day: "Friday - Friday", 
    duration: "8 days", 
    type: "administrative", 
    month: "September 2026", 
    dateKeys: ['2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18'] 
  },
  { 
    activity: "Classes start for Weekend Students (Friday Batch)", 
    date: "11 Sep 2026", 
    day: "Friday", 
    type: "academic", 
    month: "September 2026", 
    dateKeys: ['2026-09-11'] 
  },
  { 
    activity: "Advising/Registration for Weekend students (Saturday Batch) of Trimester", 
    details: "With payment of Semester Fee",
    date: "12 - 19 Sep 2026", 
    day: "Saturday - Saturday", 
    duration: "8 days", 
    type: "administrative", 
    month: "September 2026", 
    dateKeys: ['2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'] 
  },
  { 
    activity: "Classes start for Weekend Students (Saturday Batch)", 
    date: "12 Sep 2026", 
    day: "Saturday", 
    type: "academic", 
    month: "September 2026", 
    dateKeys: ['2026-09-12'] 
  },
  { 
    activity: "Late registration starts for All Students", 
    details: "Late registration fee Tk. 1000/- will be included",
    date: "20 Sep 2026", 
    day: "Sunday", 
    type: "administrative", 
    month: "September 2026", 
    dateKeys: ['2026-09-20'] 
  },
  
  // October 2026
  { 
    activity: "Last day to remove 'I' grade for the Summer 2026 semester / Last date of grade submission of Thesis/Project/Internship/Dissertation for Summer 2026", 
    details: "Applicable for Summer 2026 semester final records and dissertation submissions",
    date: "2 Oct 2026", 
    day: "Friday", 
    type: "academic", 
    month: "October 2026", 
    dateKeys: ['2026-10-02'] 
  },
  { 
    activity: "Last day of Late Registration / Add or Drop with full refund / Section change for Existing Students", 
    details: "Final deadline for existing students course adds, drops, or section changes with full refund",
    date: "9 Oct 2026", 
    day: "Friday", 
    type: "administrative", 
    month: "October 2026", 
    dateKeys: ['2026-10-09'] 
  },
  { 
    activity: "Waiver Review and System Update based on the results of the Summer 2026 semester examinations", 
    details: "Automatic scholarship and tuition waiver updates based on Summer 2026 published CGPA",
    date: "11 Oct 2026", 
    day: "Sunday", 
    type: "administrative", 
    month: "October 2026", 
    dateKeys: ['2026-10-11'] 
  },
  { 
    activity: "Last date of payment of 1st installment: 50% of total tuition fees", 
    details: "If payment is made after 16 October Tk. 500/- Late Fee will be added",
    date: "16 Oct 2026", 
    day: "Friday", 
    type: "financial", 
    highlight: true, 
    month: "October 2026", 
    dateKeys: ['2026-10-16'] 
  },
  { 
    activity: "Holiday: Durga Puja", 
    date: "20 - 21 Oct 2026", 
    day: "Tuesday - Wednesday", 
    duration: "2 days", 
    type: "holiday", 
    month: "October 2026", 
    dateKeys: ['2026-10-20', '2026-10-21'] 
  },
  { 
    activity: "Last date of Admission for Freshers students", 
    details: "Final admissions cut-off date for incoming new students",
    date: "23 Oct 2026", 
    day: "Friday", 
    type: "administrative", 
    month: "October 2026", 
    dateKeys: ['2026-10-23'] 
  },
  { 
    activity: "Last day of Add or Drop with full refund / Section change for Fresher students", 
    details: "Final deadline for Fresher students course adjustments with full refund",
    date: "27 Oct 2026", 
    day: "Tuesday", 
    type: "administrative", 
    month: "October 2026", 
    dateKeys: ['2026-10-27'] 
  },
  { 
    activity: "Midterm exam (All Students)", 
    details: "No classes will be held during the Midterm Examination period. Department offices must submit the schedule of make-up classes for this period to the Registrar's Office",
    date: "28 Oct - 7 Nov 2026", 
    day: "Wednesday - Saturday", 
    duration: "11 days", 
    type: "exam", 
    highlight: true, 
    month: "October 2026", 
    dateKeys: ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07'] 
  }, 
  
  // November 2026
  { 
    activity: "Course & Teacher Evaluation (online) by students", 
    details: "Mandatory student feedback submission via online portal for each enrolled course",
    date: "9 - 13 Nov 2026", 
    day: "Monday - Friday", 
    duration: "5 days", 
    type: "academic", 
    month: "November 2026", 
    dateKeys: ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13'] 
  },
  { 
    activity: "Last date of payment of 2nd installment: 30% of total tuition fees", 
    details: "If payment is made after 13 November Tk. 500/- Late Fee will be added",
    date: "13 Nov 2026", 
    day: "Friday", 
    type: "financial", 
    highlight: true, 
    month: "November 2026", 
    dateKeys: ['2026-11-13'] 
  },
  { 
    activity: "Department to submit the Courses offering for next semester to the Registrar's Office", 
    details: "Academic departments prepare and transmit course offerings list for Spring 2027",
    date: "20 Nov 2026", 
    day: "Friday", 
    type: "administrative", 
    month: "November 2026", 
    dateKeys: ['2026-11-20'] 
  },
  { 
    activity: "Department to submit the schedule of the Final Exam to the Controller of Examinations office", 
    details: "Departments finalize and transmit final examination time and room slots",
    date: "21 Nov 2026", 
    day: "Saturday", 
    type: "administrative", 
    month: "November 2026", 
    dateKeys: ['2026-11-21'] 
  },
  { 
    activity: "Department to submit the Class Schedule for next semester to the Registrar's Office", 
    details: "Final routine and faculty room allocation submission for Spring 2027",
    date: "26 Nov 2026", 
    day: "Thursday", 
    type: "administrative", 
    month: "November 2026", 
    dateKeys: ['2026-11-26'] 
  },
  { 
    activity: "Last day to withdraw course (s) without refund / Reinstate withdrawn course (s)", 
    details: "'W' grade will be assigned for withdrawn courses. Non-refundable.",
    date: "27 Nov 2026", 
    day: "Friday", 
    type: "administrative", 
    month: "November 2026", 
    dateKeys: ['2026-11-27'] 
  },
  { 
    activity: "Classes end for weekend students", 
    date: "27 Nov 2026", 
    day: "Friday", 
    type: "academic", 
    month: "November 2026", 
    dateKeys: ['2026-11-27'] 
  },
  
  // December 2026
  { 
    activity: "Final Exam for Weekend Students", 
    details: "Held on three consecutive Fridays for Weekend Friday & Saturday batches",
    date: "4, 11 & 18 Dec 2026", 
    day: "Fridays", 
    duration: "3 days", 
    type: "exam", 
    highlight: true, 
    month: "December 2026", 
    dateKeys: ['2026-12-04', '2026-12-11', '2026-12-18'] 
  },
  { 
    activity: "Last date of payment of 3rd installment: Remaining amount of tuition fees", 
    details: "If payment is made after 07 December Tk. 500/- Late Fee will be added",
    date: "7 Dec 2026", 
    day: "Monday", 
    type: "financial", 
    highlight: true, 
    month: "December 2026", 
    dateKeys: ['2026-12-07'] 
  },
  { 
    activity: "Classes end for Day and Evening Students", 
    date: "9 Dec 2026", 
    day: "Wednesday", 
    type: "academic", 
    month: "December 2026", 
    dateKeys: ['2026-12-09'] 
  },
  { 
    activity: "Final Exam for Day And Evening Students (Excluding Fridays)", 
    details: "Excluding Fridays (4, 11 & 18 Dec reserved exclusively for Weekend Final Exams)",
    date: "10 - 20 Dec 2026", 
    day: "Thursday - Sunday", 
    duration: "10 days", 
    type: "exam", 
    highlight: true, 
    month: "December 2026", 
    // Excluding Dec 11 & Dec 18 (Fridays reserved for Weekend batch)
    dateKeys: ['2026-12-10', '2026-12-12', '2026-12-13', '2026-12-14', '2026-12-15', '2026-12-16', '2026-12-17', '2026-12-19', '2026-12-20'] 
  },
  { 
    activity: "Holiday: Victory day", 
    date: "16 Dec 2026", 
    day: "Wednesday", 
    duration: "1 day", 
    type: "holiday", 
    month: "December 2026", 
    dateKeys: ['2026-12-16'] 
  },
  { 
    activity: "Last date of grade submission and publication of results", 
    details: "Submission in SIMS and to the Controller of Examinations office",
    date: "24 Dec 2026", 
    day: "Thursday", 
    type: "academic", 
    month: "December 2026", 
    dateKeys: ['2026-12-24'] 
  },
  { 
    activity: "Holiday: Christmas day", 
    date: "25 Dec 2026", 
    day: "Friday", 
    duration: "1 day", 
    type: "holiday", 
    month: "December 2026", 
    dateKeys: ['2026-12-25'] 
  },
  { 
    activity: "Holiday: Winter Vacation", 
    date: "26 Dec 2026 - 3 Jan 2027", 
    day: "Saturday - Sunday", 
    duration: "9 days", 
    type: "holiday", 
    month: "December 2026", 
    dateKeys: ['2026-12-26', '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03'] 
  },
  
  // January 2027
  { 
    activity: "Spring 2027 (Trimester start)", 
    date: "4 Jan 2027", 
    day: "Monday", 
    type: "academic", 
    highlight: true, 
    month: "January 2027", 
    dateKeys: ['2027-01-04'] 
  },
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  
  // Custom interactive states for Trimester Class Distribution summary
  const [statsMode, setStatsMode] = useState<'trimester' | 'personal'>('trimester');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  
  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, dateKey: dayKey });
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = `${monthNames[currentMonth]} ${currentYear}`;

  const selectedDateEvents = useMemo(() => {
    if (!selectedDateKey) return [];
    return CALENDAR_DATA.filter(ev => ev.dateKeys.includes(selectedDateKey));
  }, [selectedDateKey]);

  // Filter and group data by month
  const groupedData = useMemo(() => {
    const filtered = CALENDAR_DATA.filter(event => {
      const matchesFilter = filterType === 'all' || event.type === filterType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        event.activity.toLowerCase().includes(q) || 
        (event.details && event.details.toLowerCase().includes(q)) ||
        event.date.toLowerCase().includes(q) ||
        event.day.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return filtered.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [filterType, searchQuery]);

  // Fetch active student's schedule from store to calculate personal schedule load
  const { currentStudentId } = useAppStore();
  const studentData = useMemo(() => getStudentData(currentStudentId), [currentStudentId]);
  const personalSchedule = studentData?.schedule || [];

  const personalCounts = useMemo(() => {
    const counts = { ST: 0, MW: 0, A: 0, R: 0, F: 0 };
    personalSchedule.forEach(item => {
      const d = item.day.toLowerCase();
      if (d === 'sunday' || d === 'tuesday') {
        counts.ST += 1;
      } else if (d === 'monday' || d === 'wednesday') {
        counts.MW += 1;
      } else if (d === 'saturday') {
        counts.A += 1;
      } else if (d === 'thursday') {
        counts.R += 1;
      } else if (d === 'friday') {
        counts.F += 1;
      }
    });
    return counts;
  }, [personalSchedule]);

  // Standard Trimester session slots definition for interactive detailing
  const daySlotDetails: Record<string, { title: string; time: string; type: string }[]> = {
    ST: [
      { title: "Slot 1 (ST)", time: "08:30 AM - 10:00 AM", type: "90 min" },
      { title: "Slot 2 (ST)", time: "10:10 AM - 11:40 AM", type: "90 min" },
      { title: "Slot 3 (ST)", time: "11:50 AM - 01:20 PM", type: "90 min" },
      { title: "Slot 4 (ST)", time: "01:30 PM - 03:00 PM", type: "90 min" },
      { title: "Slot 5 (ST)", time: "03:10 PM - 04:40 PM", type: "90 min" },
      { title: "Slot 6 (ST)", time: "04:50 PM - 06:20 PM", type: "90 min" },
    ],
    MW: [
      { title: "Slot 1 (MW)", time: "08:30 AM - 10:00 AM", type: "90 min" },
      { title: "Slot 2 (MW)", time: "10:10 AM - 11:40 AM", type: "90 min" },
      { title: "Slot 3 (MW)", time: "11:50 AM - 01:20 PM", type: "90 min" },
      { title: "Slot 4 (MW)", time: "01:30 PM - 03:00 PM", type: "90 min" },
      { title: "Slot 5 (MW)", time: "03:10 PM - 04:40 PM", type: "90 min" },
      { title: "Slot 6 (MW)", time: "04:50 PM - 06:20 PM", type: "90 min" },
    ],
    A: [
      { title: "Slot 1 (A) - Morning", time: "09:00 AM - 12:00 PM", type: "180 min" },
      { title: "Slot 2 (A) - Midday", time: "12:00 PM - 03:00 PM", type: "180 min" },
      { title: "Slot 3 (A) - Afternoon", time: "03:00 PM - 06:00 PM", type: "180 min" },
      { title: "Slot 4 (A) - Evening", time: "06:00 PM - 09:00 PM", type: "180 min" },
    ],
    R: [
      { title: "Special Makeup & Overflow", time: "Arranged by departments as required", type: "Flexible" },
    ],
    F: [
      { title: "Slot 1 (F) - Morning", time: "09:00 AM - 12:00 PM", type: "180 min" },
      { title: "Slot 2 (F) - Afternoon", time: "03:00 PM - 06:00 PM", type: "180 min" },
      { title: "Slot 3 (F) - Evening", time: "06:00 PM - 09:00 PM", type: "180 min" },
    ],
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Academic Calendar</h2>
            <Badge variant="outline" className="text-xs font-bold text-[#8c1515] dark:text-rose-400 border-[#8c1515]/30 dark:border-rose-800/40 bg-[#8c1515]/5">
              Fall 2026
            </Badge>
          </div>
          <p className="text-sm text-stone-500 mt-1">Presidency University Trimester Schedule, Regulatory Deadlines & Examination Matrix</p>
        </div>
      </div>

      {/* Official Classes & Routine Summary Banner - Beautifully Re-designed with Interactive UX */}
      <div className="bg-stone-50/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5 text-[#8c1515] dark:text-rose-400 font-extrabold text-base tracking-tight">
              <Clock className="w-5 h-5 text-[#8c1515] dark:text-rose-400 animate-pulse" />
              <span>Trimester Class Distribution & Sessions Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Per Class Duration: <strong className="font-semibold text-stone-800 dark:text-stone-200">90 min</strong> (twice a week) & <strong className="font-semibold text-stone-800 dark:text-stone-200">180 min</strong> (once a week for weekend). Additional/Makeup classes arranged by departments as required.
            </p>
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center self-start sm:self-center shrink-0 bg-stone-100/80 dark:bg-stone-950 p-1 rounded-xl border border-stone-200/50 dark:border-stone-800/60">
            <button
              onClick={() => {
                setStatsMode('trimester');
                setSelectedCard(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statsMode === 'trimester'
                  ? 'bg-white dark:bg-stone-850 text-[#8c1515] dark:text-rose-400 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trimester Plan</span>
            </button>
            <button
              onClick={() => {
                setStatsMode('personal');
                setSelectedCard(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statsMode === 'personal'
                  ? 'bg-white dark:bg-stone-850 text-[#8c1515] dark:text-rose-400 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>My Class Load</span>
            </button>
          </div>
        </div>

        {/* Responsive Grid Layout (Matches Image 1 on Mobile, Image 2 on Desktop) */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3.5">
          {/* Card 1: SUN/TUE (ST) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(selectedCard === 'ST' ? null : 'ST')}
            className={`cursor-pointer flex flex-col justify-between items-center text-center p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
              selectedCard === 'ST'
                ? 'border-[#8c1515] dark:border-rose-500 ring-1 ring-[#8c1515]/20 dark:ring-rose-500/20'
                : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
            }`}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">SUN/TUE</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">(ST)</p>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white">
                {statsMode === 'trimester' ? 26 : personalCounts.ST}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">Classes</p>
          </motion.div>

          {/* Card 2: MON/WED (MW) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(selectedCard === 'MW' ? null : 'MW')}
            className={`cursor-pointer flex flex-col justify-between items-center text-center p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
              selectedCard === 'MW'
                ? 'border-[#8c1515] dark:border-rose-500 ring-1 ring-[#8c1515]/20 dark:ring-rose-500/20'
                : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
            }`}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">MON/WED</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">(MW)</p>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white">
                {statsMode === 'trimester' ? 27 : personalCounts.MW}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">Classes</p>
          </motion.div>

          {/* Card 3: SATURDAY (A) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(selectedCard === 'A' ? null : 'A')}
            className={`cursor-pointer flex flex-col justify-between items-center text-center p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
              selectedCard === 'A'
                ? 'border-[#8c1515] dark:border-rose-500 ring-1 ring-[#8c1515]/20 dark:ring-rose-500/20'
                : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
            }`}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">SATURDAY</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">(A)</p>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white">
                {statsMode === 'trimester' ? 12 : personalCounts.A}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">Classes</p>
          </motion.div>

          {/* Card 4: THURSDAY (R) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(selectedCard === 'R' ? null : 'R')}
            className={`cursor-pointer col-span-1 flex flex-col justify-between items-center text-center p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
              selectedCard === 'R'
                ? 'border-[#8c1515] dark:border-rose-500 ring-1 ring-[#8c1515]/20 dark:ring-rose-500/20'
                : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
            }`}
          >
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">THURSDAY</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">(R)</p>
            </div>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white">
                {statsMode === 'trimester' ? 13 : personalCounts.R}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">Classes</p>
          </motion.div>

          {/* Card 5: FRIDAY (F) - Spans all 3 columns on mobile, 1 column on desktop */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCard(selectedCard === 'F' ? null : 'F')}
            className={`cursor-pointer col-span-3 md:col-span-1 flex flex-row md:flex-col justify-between items-center text-center p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
              selectedCard === 'F'
                ? 'border-[#8c1515] dark:border-rose-500 ring-1 ring-[#8c1515]/20 dark:ring-rose-500/20'
                : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
            }`}
          >
            <div className="text-left md:text-center">
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">FRIDAY</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">(F)</p>
            </div>
            <div className="my-0 md:my-3">
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-stone-800 dark:text-white">
                {statsMode === 'trimester' ? 12 : personalCounts.F}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">Classes</p>
          </motion.div>
        </div>

        {/* Detailed Dropdown Panel with Smooth Animation */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 md:p-5 shadow-inner">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#8c1515]/5 text-[#8c1515] dark:text-rose-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-extrabold text-stone-900 dark:text-white">
                      {selectedCard === 'ST' ? "Sunday & Tuesday" :
                       selectedCard === 'MW' ? "Monday & Wednesday" :
                       selectedCard === 'A' ? "Saturday" :
                       selectedCard === 'R' ? "Thursday" : "Friday"} Pattern Schedule Slots
                    </h4>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold bg-[#8c1515]/5 border-[#8c1515]/10 text-[#8c1515] dark:text-rose-400">
                    {selectedCard} Active
                  </Badge>
                </div>

                {statsMode === 'personal' && personalSchedule.filter(item => {
                  const d = item.day.toLowerCase();
                  if (selectedCard === 'ST') return d === 'sunday' || d === 'tuesday';
                  if (selectedCard === 'MW') return d === 'monday' || d === 'wednesday';
                  if (selectedCard === 'A') return d === 'saturday';
                  if (selectedCard === 'R') return d === 'thursday';
                  if (selectedCard === 'F') return d === 'friday';
                  return false;
                }).length > 0 ? (
                  /* Show actual registered classes for the pattern */
                  <div className="space-y-3">
                    <p className="text-xs font-extrabold text-stone-400 uppercase tracking-widest mb-2">My Registered Classes</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {personalSchedule.filter(item => {
                        const d = item.day.toLowerCase();
                        if (selectedCard === 'ST') return d === 'sunday' || d === 'tuesday';
                        if (selectedCard === 'MW') return d === 'monday' || d === 'wednesday';
                        if (selectedCard === 'A') return d === 'saturday';
                        if (selectedCard === 'R') return d === 'thursday';
                        if (selectedCard === 'F') return d === 'friday';
                        return false;
                      }).map((course, idx) => (
                        <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 rounded-lg flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <Badge className="text-[10px] font-black bg-[#8c1515] text-white dark:bg-rose-950 dark:text-rose-200">
                                {course.courseCode}
                              </Badge>
                              <span className="text-[10px] font-medium text-stone-400 dark:text-stone-500">
                                Room {course.room}
                              </span>
                            </div>
                            <p className="text-xs font-extrabold text-stone-800 dark:text-stone-200 line-clamp-1">{course.day}</p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{course.start} - {course.end}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Show standard University slots */
                  <div>
                    <p className="text-xs font-extrabold text-stone-400 uppercase tracking-widest mb-3">University Class Slots & Durations</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {daySlotDetails[selectedCard]?.map((slot, idx) => (
                        <div key={idx} className="p-3 bg-stone-50/50 dark:bg-stone-900/30 border border-stone-200/40 dark:border-stone-800/40 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-stone-700 dark:text-stone-300">{slot.title}</p>
                            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{slot.time}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-bold border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500">
                            {slot.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            <h3 className="font-bold">Exams Schedule</h3>
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mt-1">
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">Midterm (All)</span><strong className="text-stone-900 dark:text-white">28 Oct - 7 Nov</strong></div>
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">Finals (Day/Eve)</span><strong className="text-stone-900 dark:text-white">10 - 20 Dec</strong></div>
            <div className="flex justify-between items-center pt-2 border-t border-red-200/50 dark:border-red-800/50"><span className="text-stone-500 dark:text-stone-400">Finals (Weekend)</span><strong className="text-stone-900 dark:text-white">4, 11, 18 Dec</strong></div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-stone-900 border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-100 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Cut-off Dates of Payment</h3>
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mt-1">
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">1st Installment (50%)</span><strong className="text-stone-900 dark:text-white">16 Oct 2026</strong></div>
            <div className="flex justify-between items-center"><span className="text-stone-500 dark:text-stone-400">2nd Installment (30%)</span><strong className="text-stone-900 dark:text-white">13 Nov 2026</strong></div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50"><span className="text-stone-500 dark:text-stone-400">3rd Installment (Rest)</span><strong className="text-stone-900 dark:text-white">7 Dec 2026</strong></div>
          </div>
        </Card>
      </div>

      {/* Controls: Filter & Search */}
      <div className="flex flex-col gap-4 bg-white dark:bg-stone-900 p-3 sm:p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm sticky top-0 z-20">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          {/* View Toggle */}
          <div className="flex border border-stone-200 dark:border-stone-800 rounded-xl p-1 bg-stone-50 dark:bg-stone-950 w-full sm:w-auto shrink-0">
             <button 
               onClick={() => setViewMode('list')}
               className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
             >
               <LayoutList className="w-4 h-4" /> Agenda
             </button>
             <button 
               onClick={() => setViewMode('calendar')}
               className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${viewMode === 'calendar' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
             >
               <Calendar className="w-4 h-4" /> Calendar
             </button>
          </div>

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
        {viewMode === 'list' && (
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
        )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid Section */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-stone-900 dark:text-white">{currentMonthName}</h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-stone-500 uppercase tracking-widest">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-stone-50/50 dark:bg-stone-950/20 border border-stone-100 dark:border-stone-800/50"></div>;
                  }
                  
                  // Find all events for this specific date
                  const eventsForDay = CALENDAR_DATA.filter(ev => ev.dateKeys.includes(cell.dateKey));
                  const isSelected = selectedDateKey === cell.dateKey;
                  const hasEvents = eventsForDay.length > 0;
                  
                  return (
                    <button
                      key={cell.dateKey}
                      onClick={() => setSelectedDateKey(cell.dateKey)}
                      className={`
                        aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-start pt-2 sm:pt-3 pb-1 gap-1 relative overflow-hidden transition-all
                        border
                        ${isSelected 
                          ? 'border-[#8c1515] dark:border-rose-500 bg-[#8c1515] text-white shadow-md' 
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/80'
                        }
                      `}
                    >
                      <span className={`text-sm sm:text-base font-bold ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                        {cell.day}
                      </span>
                      {hasEvents && (
                        <div className="flex gap-1 flex-wrap justify-center mt-auto pb-1 sm:pb-2 px-1">
                          {eventsForDay.slice(0, 3).map((ev, i) => (
                            <span 
                              key={i} 
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSelected ? 'bg-white/90' : TYPE_CONFIG[ev.type].color.split(' ')[0].replace('text-', 'bg-')}`} 
                            />
                          ))}
                          {eventsForDay.length > 3 && (
                            <span className={`text-[8px] sm:text-[10px] font-bold leading-none ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                              +{eventsForDay.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest pl-1 border-l-2 border-stone-300 dark:border-stone-700">
              {selectedDateKey ? new Date(selectedDateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
            </h3>
            
            {!selectedDateKey ? (
              <Card className="p-8 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shadow-sm text-center flex flex-col items-center justify-center gap-4 text-stone-400">
                <CalendarDays className="w-12 h-12 opacity-50" />
                <p className="text-sm font-medium">Click on any date in the calendar to view its scheduled events.</p>
              </Card>
            ) : selectedDateEvents.length === 0 ? (
              <Card className="p-8 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm text-center flex flex-col items-center justify-center gap-3 text-stone-500">
                <p className="font-bold">No Events</p>
                <p className="text-xs">There are no academic or administrative events scheduled for this day.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event, i) => (
                  <Card key={i} className="overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm p-4 sm:p-5 hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${TYPE_CONFIG[event.type].bg} ${TYPE_CONFIG[event.type].color} border-none`}>
                          {React.createElement(TYPE_CONFIG[event.type].icon, { className: 'w-3 h-3' })}
                          {TYPE_CONFIG[event.type].label}
                        </span>
                        {event.highlight && <Badge variant="default" className="bg-[#8c1515] text-white text-[9px] uppercase tracking-wider">Important</Badge>}
                      </div>
                      
                      <p className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                        {event.activity}
                      </p>
                      {event.details && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed -mt-1">
                          {event.details}
                        </p>
                      )}
                      
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
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <div className="space-y-10">
        {/* Agenda/List View Grouped by Month */}
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
                      <div className="flex flex-col gap-1.5">
                         <p className={`text-sm ${event.highlight ? 'font-bold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                           {event.activity}
                         </p>
                         {event.details && (
                           <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                             {event.details}
                           </p>
                         )}
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
                    <div key={i} className="flex justify-between items-start py-3.5 px-6 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors group">
                      
                      <div className="flex items-center w-[160px] shrink-0 gap-4 pt-0.5">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-black text-sm ${event.highlight ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100'}`}>
                            {event.date.replace(/ 202\d/, '')}
                          </span>
                          <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{event.day}</span>
                        </div>
                      </div>

                      <div className="flex-1 px-4 border-l border-stone-100 dark:border-stone-800/60 py-0.5 flex flex-col gap-1">
                        <span className={`text-sm ${event.highlight ? 'font-bold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-200'} transition-colors`}>
                          {event.activity}
                        </span>
                        {event.details && (
                          <span className="text-xs text-stone-500 dark:text-stone-400 leading-normal">
                            {event.details}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-right justify-end shrink-0 pl-4 pt-0.5">
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
      )}
      
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