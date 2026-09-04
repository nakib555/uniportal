import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Calendar, Clock, BookOpen, Users, MapPin, Activity, 
  CheckCircle2, PieChart, Layers, Grid, AlertCircle, 
  CalendarRange, Info, Sparkles, Hourglass, ArrowRight
} from 'lucide-react';

// Detailed interactive data for Trimesters
const TRIMESTER_DATA = {
  'Summer-26': {
    label: 'Summer 2026 (Current)',
    summary: {
      totalCourses: 5,
      totalCredits: 14,
      totalSessions: 112,
      completedSessions: 78,
      theoreticalHours: 96,
      labHours: 48,
    },
    // Class distribution per day of the week
    dayDistribution: [
      { day: 'Sat', classes: 2, hours: 3 },
      { day: 'Sun', classes: 3, hours: 4.5 },
      { day: 'Mon', classes: 2, hours: 3 },
      { day: 'Tue', classes: 3, hours: 5.5 },
      { day: 'Wed', classes: 1, hours: 1.5 },
      { day: 'Thu', classes: 0, hours: 0 }
    ],
    // Course workload / session distribution
    courses: [
      { code: 'CSE321', title: 'Software Engineering', type: 'Theory', sessions: 24, conducted: 18, hours: 36, color: '#3b82f6', room: 'Room 502', faculty: 'Dr. Md. Ashraful Islam' },
      { code: 'CSE322', title: 'Software Engineering Lab', type: 'Lab', sessions: 12, conducted: 9, hours: 36, color: '#06b6d4', room: 'Lab 3', faculty: 'Lec. Sadia Afrin' },
      { code: 'CSE325', title: 'Database Management Systems', type: 'Theory', sessions: 24, conducted: 17, hours: 36, color: '#6366f1', room: 'Room 401', faculty: 'Prof. Shahadat Hossain' },
      { code: 'CSE326', title: 'Database Systems Lab', type: 'Lab', sessions: 12, conducted: 8, hours: 36, color: '#a855f7', room: 'Lab 4', faculty: 'Lec. Sadia Afrin' },
      { code: 'MAT215', title: 'Linear Algebra & Complex Variables', type: 'Theory', sessions: 28, conducted: 20, hours: 42, color: '#f59e0b', room: 'Room 504', faculty: 'Dr. Kamruzzaman' }
    ],
    // Hourly sessions timeline breakdown
    sessionsTimeline: [
      { id: 1, course: 'CSE321', date: '2026-09-05', time: '09:00 AM - 10:30 AM', status: 'Upcoming', room: 'Room 502' },
      { id: 2, course: 'CSE325', date: '2026-09-05', time: '11:00 AM - 12:30 PM', status: 'Upcoming', room: 'Room 401' },
      { id: 3, course: 'CSE322', date: '2026-09-06', time: '02:00 PM - 05:00 PM', status: 'Upcoming', room: 'Lab 3' },
      { id: 4, course: 'MAT215', date: '2026-09-07', time: '09:00 AM - 10:30 AM', status: 'Conducted', room: 'Room 504' },
      { id: 5, course: 'CSE325', date: '2026-09-07', time: '11:00 AM - 12:30 PM', status: 'Conducted', room: 'Room 401' },
      { id: 6, course: 'CSE326', date: '2026-09-08', time: '02:00 PM - 05:00 PM', status: 'Conducted', room: 'Lab 4' }
    ]
  },
  'Spring-26': {
    label: 'Spring 2026',
    summary: {
      totalCourses: 4,
      totalCredits: 12,
      totalSessions: 96,
      completedSessions: 96,
      theoreticalHours: 108,
      labHours: 0,
    },
    dayDistribution: [
      { day: 'Sat', classes: 2, hours: 3 },
      { day: 'Sun', classes: 2, hours: 3 },
      { day: 'Mon', classes: 2, hours: 3 },
      { day: 'Tue', classes: 2, hours: 3 },
      { day: 'Wed', classes: 0, hours: 0 },
      { day: 'Thu', classes: 0, hours: 0 }
    ],
    courses: [
      { code: 'CSE221', title: 'Algorithms', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#3b82f6', room: 'Room 302', faculty: 'Dr. Md. Ashraful Islam' },
      { code: 'CSE223', title: 'Object Oriented Programming II', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#10b981', room: 'Room 304', faculty: 'Lec. Nafis Ahmed' },
      { code: 'CSE225', title: 'Data Communication', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#f59e0b', room: 'Room 205', faculty: 'Prof. Shahadat Hossain' },
      { code: 'MAT121', title: 'Coordinate Geometry & Calculus', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#ec4899', room: 'Room 102', faculty: 'Dr. Kamruzzaman' }
    ],
    sessionsTimeline: [
      { id: 1, course: 'CSE221', date: '2026-04-12', time: '09:00 AM - 10:30 AM', status: 'Conducted', room: 'Room 302' },
      { id: 2, course: 'CSE223', date: '2026-04-12', time: '11:00 AM - 12:30 PM', status: 'Conducted', room: 'Room 304' },
      { id: 3, course: 'CSE225', date: '2026-04-13', time: '09:00 AM - 10:30 AM', status: 'Conducted', room: 'Room 205' },
      { id: 4, course: 'MAT121', date: '2026-04-13', time: '11:00 AM - 12:30 PM', status: 'Conducted', room: 'Room 102' }
    ]
  },
  'Fall-25': {
    label: 'Fall 2025',
    summary: {
      totalCourses: 5,
      totalCredits: 15,
      totalSessions: 120,
      completedSessions: 120,
      theoreticalHours: 126,
      labHours: 18,
    },
    dayDistribution: [
      { day: 'Sat', classes: 3, hours: 4.5 },
      { day: 'Sun', classes: 2, hours: 3 },
      { day: 'Mon', classes: 3, hours: 4.5 },
      { day: 'Tue', classes: 2, hours: 3 },
      { day: 'Wed', classes: 1, hours: 1.5 },
      { day: 'Thu', classes: 0, hours: 0 }
    ],
    courses: [
      { code: 'CSE111', title: 'Structured Programming Language', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#3b82f6', room: 'Room 105', faculty: 'Lec. Nafis Ahmed' },
      { code: 'CSE112', title: 'Structured Programming Lab', type: 'Lab', sessions: 12, conducted: 12, hours: 36, color: '#06b6d4', room: 'Lab 1', faculty: 'Lec. Nafis Ahmed' },
      { code: 'EEE101', title: 'Basic Electrical Engineering', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#ef4444', room: 'Room 202', faculty: 'Dr. Shafiul Islam' },
      { code: 'MAT115', title: 'Differential & Integral Calculus', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#f59e0b', room: 'Room 103', faculty: 'Dr. Kamruzzaman' },
      { code: 'ENG101', title: 'English Composition', type: 'Theory', sessions: 24, conducted: 24, hours: 36, color: '#8b5cf6', room: 'Room 101', faculty: 'Prof. Zakia Parveen' }
    ],
    sessionsTimeline: [
      { id: 1, course: 'CSE111', date: '2025-12-15', time: '09:00 AM - 10:30 AM', status: 'Conducted', room: 'Room 105' },
      { id: 2, course: 'CSE112', date: '2025-12-15', time: '02:00 PM - 05:00 PM', status: 'Conducted', room: 'Lab 1' },
      { id: 3, course: 'MAT115', date: '2025-12-16', time: '09:00 AM - 10:30 AM', status: 'Conducted', room: 'Room 103' }
    ]
  }
};

export function ClassDistributionView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const [activeTrimester, setActiveTrimester] = useState<keyof typeof TRIMESTER_DATA>('Summer-26');
  const [filterType, setFilterType] = useState<'All' | 'Theory' | 'Lab'>('All');
  const [chartViewMode, setChartViewMode] = useState<'hours' | 'sessions'>('hours');

  const currentTrimester = useMemo(() => {
    return TRIMESTER_DATA[activeTrimester];
  }, [activeTrimester]);

  // Filtered courses based on selected type
  const filteredCourses = useMemo(() => {
    if (filterType === 'All') return currentTrimester.courses;
    return currentTrimester.courses.filter(c => c.type === filterType);
  }, [currentTrimester, filterType]);

  // Preparation for course hours distribution pie chart
  const pieChartData = useMemo(() => {
    return currentTrimester.courses.map(c => ({
      name: c.code,
      value: c.hours,
      color: c.color
    }));
  }, [currentTrimester]);

  // Color mapper for course sessions
  const getSessionColor = (status: string) => {
    switch (status) {
      case 'Conducted':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
      case 'Rescheduled':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
      default:
        return 'bg-stone-50 text-stone-700 dark:bg-stone-900 dark:text-stone-400 border-stone-200 dark:border-stone-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2.5">
            <Grid className="w-6 h-6 text-[#8c1515] dark:text-[#ef4444]" />
            <span>Class Distribution & Session Summary</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Analyze class sessions, contact hours, and credit weight breakdowns for active and historical trimesters.
          </p>
        </div>

        {/* Trimester Select Button Group */}
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 self-start md:self-auto shadow-sm">
          {(Object.keys(TRIMESTER_DATA) as Array<keyof typeof TRIMESTER_DATA>).map((tKey) => (
            <button
              key={tKey}
              onClick={() => setActiveTrimester(tKey)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTrimester === tKey
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200/50 dark:border-stone-700/50'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              {TRIMESTER_DATA[tKey].label.split(' ')[0] + ' ' + TRIMESTER_DATA[tKey].label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border border-stone-200/60 dark:border-stone-800/60 shadow-sm">
          <div className="p-3 bg-[#8c1515]/5 dark:bg-[#ef4444]/10 text-[#8c1515] dark:text-[#ef4444] rounded-xl shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">Total Courses</p>
            <h4 className="text-xl font-bold text-stone-950 dark:text-white mt-0.5">{currentTrimester.summary.totalCourses}</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">{currentTrimester.summary.totalCredits} Credits Registered</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border border-stone-200/60 dark:border-stone-800/60 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">Total Sessions</p>
            <h4 className="text-xl font-bold text-stone-950 dark:text-white mt-0.5">
              {currentTrimester.summary.completedSessions} / {currentTrimester.summary.totalSessions}
            </h4>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
              {Math.round((currentTrimester.summary.completedSessions / currentTrimester.summary.totalSessions) * 100)}% Conducted
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border border-stone-200/60 dark:border-stone-800/60 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">Theory Hours</p>
            <h4 className="text-xl font-bold text-stone-950 dark:text-white mt-0.5">{currentTrimester.summary.theoreticalHours} Hrs</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">Focusing on concepts</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border border-stone-200/60 dark:border-stone-800/60 shadow-sm">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">Lab / Practical</p>
            <h4 className="text-xl font-bold text-stone-950 dark:text-white mt-0.5">{currentTrimester.summary.labHours} Hrs</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">{currentTrimester.summary.labHours > 0 ? 'Hands-on practice sessions' : 'No Lab registered'}</p>
          </div>
        </Card>
      </div>

      {/* Analytics Charts & Class Distribution Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day-by-Day Hour Distribution */}
        <Card className="p-6 lg:col-span-2 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
              <span>Weekly Class Hour Distribution</span>
            </h3>
            <Badge variant="outline" className="text-[10px]">6 Days Weekly Cycle</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentTrimester.dayDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-stone-800/40" />
                <XAxis dataKey="day" tickLine={false} tick={{ fill: '#888888', fontSize: 12, fontWeight: 600 }} />
                <YAxis unit="h" tickLine={false} axisLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 text-white p-3 rounded-xl border border-stone-800 text-xs shadow-xl space-y-1">
                          <p className="font-bold">{data.day}day Routine</p>
                          <p>{data.classes} Classes Scheduled</p>
                          <p className="text-[#ef4444] font-semibold">{data.hours} Contact Hours</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {currentTrimester.dayDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.hours > 4 ? '#8c1515' : entry.hours > 2 ? '#3b82f6' : entry.hours > 0 ? '#10b981' : '#e5e7eb'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Color Indicators Legend */}
          <div className="flex flex-wrap gap-4 items-center justify-center mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/60 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8c1515]" />
              <span>Heavy Day (&gt; 4 hrs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span>Normal Day (2.5 - 4 hrs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span>Light Day (1 - 2 hrs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb] dark:bg-stone-800" />
              <span>Free Day (0 hrs)</span>
            </div>
          </div>
        </Card>

        {/* Course-wise Hour & Session Breakdown */}
        <Card className="p-6 border border-stone-200/60 dark:border-stone-800/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
                <span>Course Metrics</span>
              </h3>
              
              {/* Chart Mode Selector Switcher */}
              <div className="flex bg-stone-100 dark:bg-stone-900 p-0.5 rounded-lg border border-stone-200/60 dark:border-stone-800 text-[10px] font-bold">
                <button
                  onClick={() => setChartViewMode('hours')}
                  className={`px-2 py-1 rounded ${
                    chartViewMode === 'hours'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  Hours Share
                </button>
                <button
                  onClick={() => setChartViewMode('sessions')}
                  className={`px-2 py-1 rounded ${
                    chartViewMode === 'sessions'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  Sessions Progress
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              {chartViewMode === 'hours' 
                ? 'Visualizes percentage shares of academic contact hours allocated to registered courses.'
                : 'Tracks conducted vs planned sessions for each academic course in this trimester.'
              }
            </p>

            {chartViewMode === 'hours' ? (
              <div className="h-44 w-full flex justify-center items-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-stone-900 text-white p-2.5 rounded-lg border border-stone-800 text-xs shadow-md">
                              <span className="font-bold">{payload[0].name}:</span> {payload[0].value} Hours
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-stone-800 dark:text-white">
                    {currentTrimester.summary.theoreticalHours + currentTrimester.summary.labHours}
                  </span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total Hrs</span>
                </div>
              </div>
            ) : (
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentTrimester.courses}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-stone-800/40" />
                    <XAxis type="number" tickLine={false} tick={{ fill: '#888888', fontSize: 10 }} />
                    <YAxis dataKey="code" type="category" tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-stone-900 text-white p-2.5 rounded-lg border border-stone-800 text-xs shadow-md space-y-0.5 animate-fade-in">
                              <p className="font-bold text-stone-100">{data.code} ({data.type})</p>
                              <p className="text-emerald-400 font-semibold">Conducted: {data.conducted} sessions</p>
                              <p className="text-stone-300">Total Planned: {data.sessions} sessions</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="conducted" barSize={12} radius={[0, 4, 4, 0]}>
                      {currentTrimester.courses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-1.5 mt-4 border-t border-stone-100 dark:border-stone-800/60 pt-4">
            {currentTrimester.courses.map((course) => (
              <div key={course.code} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                  <span className="font-bold text-stone-700 dark:text-stone-300">{course.code}</span>
                  <span className="text-[10px] text-stone-400 truncate max-w-[120px]">{course.title}</span>
                </div>
                <span className="font-semibold text-stone-900 dark:text-white">
                  {chartViewMode === 'hours' ? `${course.hours} hrs` : `${course.conducted}/${course.sessions} ses`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Courses Details List */}
      <Card className="p-6 border border-stone-200/60 dark:border-stone-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
              <span>Registered Courses & Conducted Sessions</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Detailed tracking of total contact periods and current faculty assignment details.
            </p>
          </div>

          {/* Filter Type Toggle */}
          <div className="flex bg-stone-50 dark:bg-stone-900 p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-semibold self-start sm:self-auto">
            {(['All', 'Theory', 'Lab'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterType === type
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Sessions Conducted</th>
                <th className="py-3 px-4 text-right">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filteredCourses.map((c) => {
                const percent = Math.round((c.conducted / c.sessions) * 100);
                return (
                  <tr key={c.code} className="hover:bg-stone-50/40 dark:hover:bg-stone-900/10 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#8c1515] dark:text-[#ef4444] font-mono">{c.code}</td>
                    <td className="py-4 px-4 font-semibold text-stone-800 dark:text-stone-200">{c.title}</td>
                    <td className="py-4 px-4">
                      <Badge variant={c.type === 'Lab' ? 'success' : 'brand'}>{c.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-stone-600 dark:text-stone-400">{c.faculty}</td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{c.room}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1.5 max-w-[140px] mx-auto">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">{c.conducted} / {c.sessions}</span>
                          <span className="text-[10px] text-stone-400 font-semibold">{percent}%</span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-stone-800 dark:text-stone-100">{c.hours} hrs</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card Grid */}
        <div className="grid grid-cols-1 md:hidden gap-4">
          {filteredCourses.map((c) => {
            const percent = Math.round((c.conducted / c.sessions) * 100);
            return (
              <div 
                key={c.code} 
                className="bg-stone-50/50 dark:bg-stone-900/20 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/60 space-y-3.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#8c1515] dark:text-[#ef4444] bg-[#8c1515]/5 dark:bg-[#ef4444]/10 px-2.5 py-1 rounded-md">{c.code}</span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mt-2">{c.title}</h4>
                  </div>
                  <Badge variant={c.type === 'Lab' ? 'success' : 'brand'}>{c.type}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-stone-100 dark:border-stone-800/60 py-2.5">
                  <div className="space-y-0.5">
                    <p className="text-stone-400 text-[10px] uppercase font-bold">Faculty</p>
                    <p className="font-semibold text-stone-700 dark:text-stone-300 truncate">{c.faculty.split(' ')[c.faculty.split(' ').length - 1] || c.faculty}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-stone-400 text-[10px] uppercase font-bold">Location</p>
                    <p className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{c.room}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-bold">Conducted sessions</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{c.conducted} / {c.sessions} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-stone-400">Total hours spent:</span>
                  <span className="font-black text-stone-800 dark:text-stone-100">{c.hours} Contact Hours</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Trimester Sessions Timeline */}
      <Card className="p-6 border border-stone-200/60 dark:border-stone-800/60">
        <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
          <span>Detailed Class Session Log</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
          Live feed of historical and upcoming course slots for the selected trimester cycle.
        </p>

        <div className="space-y-3">
          {currentTrimester.sessionsTimeline.map((session) => (
            <div 
              key={session.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:scale-[1.005] ${getSessionColor(session.status)}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-white dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/40 rounded-xl shrink-0">
                  <Clock className="w-4 h-4 text-stone-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs uppercase text-stone-900 dark:text-stone-100 bg-white/80 dark:bg-stone-800/80 px-2 py-0.5 rounded border border-stone-200/30 dark:border-stone-700/30">{session.course}</span>
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">{session.time}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{session.date}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{session.room}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <Badge variant={session.status === 'Conducted' ? 'success' : 'outline'} className="text-[10px] font-bold">
                  {session.status}
                </Badge>
                <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
