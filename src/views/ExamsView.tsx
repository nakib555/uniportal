import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { Calendar, MapPin, Clock, User, Building, Search, FileText, CheckCircle2, LayoutGrid, List, CalendarPlus, X, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { exportExamsToICS, generateICSString, openICSInApp, getGoogleCalendarUrl } from '../utils/icsExporter';

export function ExamsView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const currentSemester = portal?.student?.currentSemester || 'Summer-26';
  const exams = portal?.studentData?.exams || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

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
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exams.length > 0 && setIsSyncDialogOpen(true)}
            disabled={exams.length === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 shadow-sm ${
              exams.length > 0
                ? 'bg-[#8c1515] hover:bg-[#9c1c1c] text-white hover:shadow active:scale-95 cursor-pointer'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed opacity-60'
            }`}
            title={exams.length > 0 ? "Open Calendar App or sync schedule directly" : "No exams available to sync"}
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Sync / Open in Calendar App</span>
          </button>
          <Badge variant="outline" className="px-3 py-1.5 font-bold text-xs bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700">
            {currentSemester}
          </Badge>
          {exams.length > 0 ? (
            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published ({exams.length})
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800/80 dark:text-stone-400 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Awaiting Publication
            </span>
          )}
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
      {exams.length === 0 ? (
        <Card className="p-12 text-center text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-2">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30 text-stone-400" />
          <p className="font-bold text-base text-stone-800 dark:text-stone-200">No Exam Routine Published Yet</p>
          <p className="text-xs max-w-md mx-auto text-stone-500 dark:text-stone-400">
            The exam timetable for {currentSemester} has not been published or synced from the Presidency University portal yet. Once published, your schedule and room allocations will appear here automatically.
          </p>
        </Card>
      ) : filteredExams.length === 0 ? (
        <Card className="p-12 text-center text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-2">
          <Search className="w-12 h-12 mx-auto mb-2 opacity-30 text-stone-400" />
          <p className="font-bold text-base text-stone-800 dark:text-stone-200">No matching exams found</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">Try clearing your search query or adjusting the selected day filter.</p>
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

      {/* Calendar Sync & Direct App Connection Modal */}
      {isSyncDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <Card className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden rounded-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#8c1515]/10 dark:bg-[#8c1515]/20 text-[#8c1515] dark:text-red-400">
                  <CalendarPlus className="w-5 h-5" />
                </span>
                <div className="text-left">
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-white leading-tight">Sync Calendar with App</h3>
                  <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Presidency University Exam Timetable</p>
                </div>
              </div>
              <button
                onClick={() => setIsSyncDialogOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Option 1: Direct Native App Launch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-400">Method 1: Direct OS App Integration</span>
                  <Badge className="bg-[#8c1515]/10 text-[#8c1515] dark:bg-red-950/40 dark:text-red-400 text-[10px] font-extrabold border-none px-2 py-0.5">Recommended for Mobile/OS</Badge>
                </div>
                <div 
                  onClick={() => {
                    const icsString = generateICSString(exams, currentSemester);
                    openICSInApp(icsString);
                    setIsSyncDialogOpen(false);
                  }}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 hover:bg-[#8c1515]/5 hover:border-[#8c1515]/30 dark:bg-stone-950/30 dark:hover:bg-[#8c1515]/10 dark:hover:border-[#8c1515]/40 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.99] duration-150"
                >
                  <div className="p-2.5 rounded-xl bg-[#8c1515] text-white shrink-0 shadow-md shadow-[#8c1515]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white group-hover:text-[#8c1515] dark:group-hover:text-red-400 transition-colors">
                      Open Directly in Calendar App
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-semibold">
                      Directly opens iOS Calendar, macOS Calendar, or Outlook on your device to import all exam dates in one sweep without saving intermediate files.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: 1-Click Google Calendar */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-stone-400 block text-left">Method 2: Google Calendar (Add 1-by-1)</span>
                
                <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-950/20">
                  <div className="bg-stone-50/50 dark:bg-stone-950/40 p-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">Select Exam to Open in Google Calendar:</span>
                  </div>
                  <div className="divide-y divide-stone-100 dark:divide-stone-800/60 max-h-56 overflow-y-auto">
                    {exams.map((ex, i) => (
                      <div key={i} className="p-3 flex items-center justify-between gap-4 text-xs font-medium hover:bg-stone-50/60 dark:hover:bg-stone-800/20 transition-colors">
                        <div className="text-left">
                          <div className="font-extrabold font-mono text-stone-900 dark:text-white flex items-center gap-1.5">
                            {ex.courseCode}
                            <span className="text-[10px] text-stone-400 font-semibold">Sec {ex.section}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-semibold line-clamp-1 mt-0.5">{ex.title}</div>
                        </div>
                        <a
                          href={getGoogleCalendarUrl(ex, currentSemester)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-black text-[11px] shadow-sm active:scale-95 transition-all duration-100"
                        >
                          <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          <span>Open & Save</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Option 3: Fallback File Download */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="font-bold text-xs text-stone-700 dark:text-stone-300">Method 3: Download ICS File</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Classic option for manual import on older devices.</p>
                </div>
                <button
                  onClick={() => {
                    exportExamsToICS(exams, currentSemester);
                    setIsSyncDialogOpen(false);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-extrabold rounded-lg transition-colors whitespace-nowrap active:scale-95 duration-100"
                >
                  Download .ics File
                </button>
              </div>

            </div>

            {/* Footer help notice */}
            <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-950/40 border-t border-stone-100 dark:border-stone-800 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold leading-relaxed text-left">
                Direct app integrations are instant and offline-friendly. Google Calendar links will take you directly to your online Google account to register the dates smoothly.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
