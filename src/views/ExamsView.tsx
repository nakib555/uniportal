import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { 
  Calendar, MapPin, Clock, User, Building, Search, FileText, 
  CheckCircle2, LayoutGrid, List, AlertCircle, RefreshCw, Loader2, 
  Lock, BookOpen, ExternalLink
} from 'lucide-react';
import { usePortalLogic } from '../hooks/usePortalLogic';

export function ExamsView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const currentSemester = portal?.student?.currentSemester || 'Summer-26';
  const exams = portal?.studentData?.exams || [];
  const registeredCourses = portal?.studentData?.registeredCourses || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sync state & password modal
  const [isLocalSyncing, setIsLocalSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [simsPassword, setSimsPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isSyncing = Boolean(portal?.isExamSyncing || isLocalSyncing);

  const handleSync = async (customPass?: string) => {
    if (!portal) return;
    setIsLocalSyncing(true);
    setSyncFeedback(null);

    try {
      const res = await portal.syncExamSchedule(customPass);
      if (res.needsPassword) {
        setIsPasswordModalOpen(true);
        return;
      }

      if (res.success) {
        setIsPasswordModalOpen(false);
        setSimsPassword('');
        setPasswordError(null);
        setSyncFeedback({
          type: 'success',
          message: res.message || 'Exam schedule and admit card synced with Presidency SIMS.'
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: res.message || 'Could not retrieve exam schedule from Presidency SIMS.'
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err?.message || 'Network error while contacting Presidency SIMS portal.'
      });
    } finally {
      setIsLocalSyncing(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simsPassword.trim()) {
      setPasswordError('Please enter your SIMS password.');
      return;
    }
    setPasswordError(null);
    handleSync(simsPassword.trim());
  };

  const daysList = ['ALL', ...Array.from(new Set(exams.map(e => e.day).filter(Boolean)))];

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
          <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
            Official examination timetable, seat plan, and room allocations synchronized with Presidency University SIMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="outline" className="px-3 py-1.5 font-bold text-xs bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700">
            {currentSemester}
          </Badge>

          {exams.length > 0 ? (
            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published ({exams.length})
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Awaiting Publication
            </span>
          )}
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncFeedback && (
        <div 
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            syncFeedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
          <button 
            type="button"
            onClick={() => setSyncFeedback(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Loading Skeletons */}
      {isSyncing && exams.length === 0 ? (
        <Card className="p-8 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
          <div className="flex items-center justify-center gap-3 py-4 text-stone-600 dark:text-stone-300">
            <Loader2 className="w-5 h-5 animate-spin text-[#8c1515]" />
            <span className="font-semibold text-sm">Querying Presidency University SIMS for Exam Routine & Seat Plan...</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-stone-100 dark:bg-stone-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </Card>
      ) : exams.length === 0 ? (
        /* Empty State with Fallback Registered Courses */
        <div className="space-y-6">
          <Card className="p-8 text-center border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">Exam Schedule Awaiting Publication</h3>
              <p className="text-xs max-w-lg mx-auto text-stone-500 dark:text-stone-400 mt-1">
                The Controller of Examinations has not released the examination timetable for {currentSemester} on Presidency University SIMS yet, or your routine has not been posted.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium border border-stone-200 dark:border-stone-700">
                Tip: Click <strong>Smart Refresh</strong> in the top navigation to check for exam routine updates
              </span>
            </div>
          </Card>

          {/* Registered Courses Awaiting Routine */}
          {registeredCourses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <BookOpen className="w-4 h-4 text-[#8c1515]" />
                <h4 className="font-extrabold text-sm uppercase tracking-wider">
                  Your Enrolled Courses ({registeredCourses.length}) — Awaiting Exam Slots
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {registeredCourses.map((c, i) => (
                  <Card key={c.code + i} className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono font-black text-xs text-[#8c1515] dark:text-[#ef4444]">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        Sec {c.section}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1 mb-2">
                      {c.title}
                    </h5>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 pt-2">
                      <span>{c.credits} Credits</span>
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                        <Clock className="w-3 h-3" /> Slot TBA
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
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

      {/* Password Prompt Modal for SIMS Sync */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-[#8c1515] dark:text-[#ef4444]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Presidency SIMS Password</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Required to fetch Exam Admit Card & Schedule</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Presidency University SIMS requires session authentication to retrieve official seat allocations and room details.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  SIMS Portal Password
                </label>
                <input
                  type="password"
                  value={simsPassword}
                  onChange={(e) => setSimsPassword(e.target.value)}
                  placeholder="Enter your student portal password"
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]"
                />
                {passwordError && (
                  <p className="text-rose-600 text-xs font-semibold mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSyncing}
                  className="bg-[#8c1515] hover:bg-[#701010] text-white font-bold"
                >
                  {isSyncing ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Syncing...
                    </span>
                  ) : (
                    'Fetch Schedule'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
