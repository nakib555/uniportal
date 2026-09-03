import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Hourglass } from 'lucide-react';
import { Card, Badge } from './ui';
import { useAppStore } from '../store';

interface Exam {
  courseCode: string;
  title: string;
  section: string;
  type: string;
  day: string;
  date: string;
  time: string;
  room: string;
  campus: string;
  faculty: string;
  semester?: string;
}

// Robust parser to extract exam date-time
function parseExamDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    const cleanDate = dateStr.replace(/,/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const parts = cleanDate.split(' ');
    
    let day = 1;
    let monthIdx = 8; // Default to Sept
    let year = 2026;
    
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    for (const part of parts) {
      const lower = part.toLowerCase();
      const mIdx = months.findIndex(m => lower.startsWith(m));
      if (mIdx !== -1) {
        monthIdx = mIdx;
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) {
          if (num > 31) {
            year = num < 100 ? 2000 + num : num;
          } else if (num > 0) {
            if (day === 1 && parts.indexOf(part) === 0) {
              day = num;
            } else if (parts.indexOf(part) === parts.length - 1) {
              year = num < 100 ? 2000 + num : num;
            } else {
              day = num;
            }
          }
        }
      }
    }

    let hours = 9;
    let minutes = 0;
    const firstTimePart = timeStr.split('-')[0].trim().toLowerCase();
    const ampm = firstTimePart.includes('pm') ? 'pm' : 'am';
    const timeNumStr = firstTimePart.replace(/[apm\s]/g, '');
    const [hStr, mStr] = timeNumStr.split(':');
    let parsedH = parseInt(hStr, 10);
    const parsedM = parseInt(mStr, 10);
    
    if (!isNaN(parsedH)) {
      if (ampm === 'pm' && parsedH < 12) parsedH += 12;
      if (ampm === 'am' && parsedH === 12) parsedH = 0;
      hours = parsedH;
    }
    if (!isNaN(parsedM)) {
      minutes = parsedM;
    }

    return new Date(year, monthIdx, day, hours, minutes, 0);
  } catch (err) {
    console.error("Error parsing date/time for exam:", dateStr, timeStr, err);
    return null;
  }
}

export function ExamCountdownWidget({ portalExams }: { portalExams?: Exam[] }) {
  const store = useAppStore();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const exams = portalExams || [];

  // If no exams exist in portal data, do not render the widget
  if (exams.length === 0) {
    return null;
  }

  // Find the next upcoming exam chronologically
  const nextExamInfo = useMemo(() => {
    const parsed = exams.map(ex => {
      const targetDate = parseExamDateTime(ex.date, ex.time);
      if (!targetDate) return null;
      return { exam: ex, targetDate };
    }).filter(Boolean) as { exam: Exam; targetDate: Date }[];

    if (parsed.length === 0) return null;

    // Filter to show only future exams
    const futureExams = parsed.filter(item => item.targetDate.getTime() > Date.now());

    if (futureExams.length === 0) {
      // If all are in the past, return null to allow showing the completed state
      return null;
    }

    // Sort chronologically to get the absolute nearest future one
    futureExams.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
    return futureExams[0];
  }, [exams]);

  // Live timer tick
  useEffect(() => {
    if (!nextExamInfo) return;

    const updateTimer = () => {
      const diffMs = nextExamInfo.targetDate.getTime() - Date.now();
      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [nextExamInfo]);

  if (!nextExamInfo || !timeLeft) {
    return null;
  }

  const { exam, targetDate } = nextExamInfo;

  // Format dynamic date display string, e.g. "Monday, Sep 7, 2026"
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-stone-50 to-white dark:from-stone-900/60 dark:to-stone-950 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8c1515]/5 dark:bg-[#8c1515]/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#8c1515]/10 dark:bg-[#8c1515]/20 text-[#8c1515] dark:text-red-400">
              <Hourglass className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#8c1515] dark:text-red-400">
              Next Upcoming Exam
            </span>
            <Badge variant="outline" className="text-[10px] font-bold border-stone-200 dark:border-stone-800 px-2 py-0.5">
              {exam.type}
            </Badge>
          </div>

          <div>
            <h4 className="text-xl font-black text-stone-900 dark:text-white flex items-baseline gap-2 leading-none">
              {exam.courseCode}
              <span className="text-xs font-bold text-stone-400">Section {exam.section}</span>
            </h4>
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1 line-clamp-1">
              {exam.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {exam.time.split('-')[0].trim()}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              Room {exam.room} ({exam.campus})
            </span>
          </div>
        </div>

        {/* Countdown Ticker Cards */}
        <div className="flex items-center gap-2.5 sm:gap-4 self-center lg:self-auto shrink-0 select-none">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 sm:w-20 py-2.5 sm:py-3.5 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/80 dark:border-stone-800/80 flex flex-col items-center justify-center min-w-[64px] sm:min-w-[80px]">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums tracking-tight leading-none">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-stone-400 mt-1.5 tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-xs font-bold">
        <span className="text-stone-400 dark:text-stone-500">
          Instructor: <span className="text-stone-600 dark:text-stone-300 font-bold">{exam.faculty}</span>
        </span>
        <button
          onClick={() => store.setActiveTab('exam-routine')}
          className="flex items-center gap-1 text-[#8c1515] dark:text-red-400 hover:underline transition-all"
        >
          View Full Exam Schedule <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
}
