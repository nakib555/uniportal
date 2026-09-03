import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { Calendar, MapPin, Clock, User, Building, Search, FileText, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';

export function ExamsView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const currentSemester = portal?.student?.currentSemester || 'Summer-26';
  const exams = portal?.studentData?.exams && portal.studentData.exams.length > 0
    ? portal.studentData.exams
    : [
        { courseCode: 'PHY108', title: 'Physics II Lab', section: '6', type: 'Final Examination', day: 'Monday', date: '17 Aug, 26', time: '03:00 pm - 05:00 pm', room: '410', campus: 'Gulshan', faculty: 'Alif', semester: 'Summer-26' },
        { courseCode: 'EEE203', title: 'Electrical Circuits', section: '5', type: 'Final Examination', day: 'Saturday', date: '22 Aug, 26', time: '03:00 pm - 05:00 pm', room: '204', campus: 'Gulshan', faculty: 'mushfika', semester: 'Summer-26' },
        { courseCode: 'MAT123', title: 'Calculus & Analytical Geometry', section: '6', type: 'Final Examination', day: 'Monday', date: '24 Aug, 26', time: '03:00 pm - 05:00 pm', room: '204', campus: 'Gulshan', faculty: 'ibrahim', semester: 'Summer-26' },
        { courseCode: 'PHY107', title: 'Physics II', section: '6', type: 'Final Examination', day: 'Tuesday', date: '25 Aug, 26', time: '03:00 pm - 05:00 pm', room: '204', campus: 'Gulshan', faculty: 'Alif', semester: 'Summer-26' },
        { courseCode: 'ENG101', title: 'English Reading & Composition', section: '21', type: 'Final Examination', day: 'Thursday', date: '27 Aug, 26', time: '03:00 pm - 05:00 pm', room: '204', campus: 'Gulshan', faculty: 'Harisun', semester: 'Summer-26' },
      ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const daysList = ['ALL', ...Array.from(new Set(exams.map(e => e.day)))];

  const filteredExams = exams.filter(e => {
    const matchesSearch = 
      e.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDay === 'ALL' || e.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Exam Routine & Seat Plan</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Official examination timetable and room allocations for the running semester.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-bold text-xs bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700">
            {currentSemester}
          </Badge>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </span>
        </div>
      </div>

      {/* Filter / Search Bar & View Mode Switcher */}
      <Card className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by course code, title, room, or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {daysList.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDay === d
                    ? 'bg-[#8c1515] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher: List vs. Grid */}
        <div className="flex items-center self-end sm:self-auto bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List View"
            aria-pressed={viewMode === 'list'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-800 text-[#8c1515] dark:text-[#ef4444] shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid View"
            aria-pressed={viewMode === 'grid'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-stone-800 text-[#8c1515] dark:text-[#ef4444] shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </Card>

      {/* Empty State */}
      {filteredExams.length === 0 ? (
        <Card className="p-12 text-center text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold text-base text-stone-800 dark:text-stone-200">No scheduled exams found</p>
          <p className="text-sm mt-1">Try clearing your search query or day filter.</p>
        </Card>
      ) : viewMode === 'list' ? (
        /* Structured Routine Table (List View) */
        <Card className="p-0 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm bg-white dark:bg-stone-900">
          <div className="bg-stone-50/80 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8c1515] dark:text-[#ef4444]" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Presidency University - Final Exam Schedule ({filteredExams.length} Courses)
              </h3>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              Campus: Gulshan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-stone-100/70 dark:bg-stone-800/60 text-[11px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800">
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-3">Sec</th>
                  <th className="py-3.5 px-4">Day</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-3">Room</th>
                  <th className="py-3.5 px-3">Campus</th>
                  <th className="py-3.5 px-4">Faculty</th>
                  <th className="py-3.5 px-4">Semester</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                {filteredExams.map((e, idx) => (
                  <tr
                    key={e.courseCode + idx}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold font-mono text-[#8c1515] dark:text-[#ef4444]">
                        {e.courseCode}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-300 font-semibold line-clamp-1">
                        {e.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-700 dark:text-stone-300">
                      {e.section || '-'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-700 dark:text-stone-300">
                      {e.day}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-800 dark:text-stone-200">
                      {e.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {e.time}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono font-black text-xs text-[#8c1515] dark:text-[#ef4444] bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded border border-red-200/50 dark:border-red-900/40">
                        <MapPin className="w-3 h-3" />
                        {e.room}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-stone-600 dark:text-stone-400">
                      {e.campus || 'Gulshan'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-700 dark:text-stone-300 capitalize text-xs">
                      {e.faculty ? (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          {e.faculty}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-stone-500 dark:text-stone-400">
                      {e.semester || currentSemester}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Seat Allocation & Room Cards (Grid View) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((e, idx) => (
            <Card key={'card-' + e.courseCode + idx} className="p-5 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[#8c1515] dark:text-[#ef4444]">
                    {e.courseCode}
                  </span>
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-2 py-0.5 rounded">
                    Section {e.section}
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-white line-clamp-1 mb-3">
                  {e.title}
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{e.day}, {e.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{e.time}</span>
                  </div>
                  {e.faculty && (
                    <div className="flex items-center gap-2 capitalize">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Faculty: {e.faculty}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Building className="w-3.5 h-3.5" /> {e.campus || 'Gulshan'}
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-black text-[#8c1515] dark:text-[#ef4444] bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded border border-red-200/50 dark:border-red-900/40">
                  <MapPin className="w-3 h-3" /> Room {e.room}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
