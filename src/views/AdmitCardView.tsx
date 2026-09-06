import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { ShieldAlert, Printer, AlertTriangle, FileQuestion, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { PuSyncService } from '../services/puSyncService';
import { tempAuthService } from '../services/tempAuthService';
import { AdmitCardSkeleton } from '../components/AdmitCardSkeleton';

export function AdmitCardView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const student = portal ? portal.student : null;
  const currentStudentId = portal?.store?.currentStudentId || student?.id || '';
  
  // State for lazy on-demand fetch
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [manualPassword, setManualPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [localExams, setLocalExams] = useState<any[] | null>(null);
  const [serverHasRestriction, setServerHasRestriction] = useState<boolean | null>(null);

  const existingExams = localExams ?? (portal?.studentData?.exams || []);
  // An admit card is officially verified if localExams was populated
  const hasOfficialAdmitCardData = Boolean(localExams !== null);

  const hasOutstandingBalance = existingExams.length > 0
    ? false
    : (serverHasRestriction !== null
        ? serverHasRestriction
        : (student ? student.accountBalance < 0 : false));

  // Lazy fetch handler using session credentials or manual prompt
  const performFetch = useCallback(async (customPassword?: string) => {
    if (!currentStudentId) return;

    // Check temporary session credentials first
    const creds = tempAuthService.getTempCredentials(currentStudentId);
    const passwordToUse = (customPassword || creds?.password || '').trim();

    if (!passwordToUse) {
      // Need user to enter password if session was refreshed or credentials expired
      setShowPasswordPrompt(true);
      setHasAttemptedFetch(true);
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setShowPasswordPrompt(false);

    try {
      const result = await PuSyncService.fetchAdmitCardOnly(currentStudentId, passwordToUse);
      setHasAttemptedFetch(true);

      if (result.success) {
        setLocalExams(result.exams);
        setServerHasRestriction(result.hasRestriction);
        // Also save credentials to session if provided manually
        if (customPassword) {
          tempAuthService.setTempCredentials(currentStudentId, customPassword);
        }
      } else {
        setFetchError(result.message || 'Failed to fetch Admit Card.');
      }
    } catch (err: any) {
      setFetchError(err?.message || 'Error communicating with Presidency SIMS.');
      setHasAttemptedFetch(true);
    } finally {
      setIsFetching(false);
    }
  }, [currentStudentId]);

  // Trigger lazy fetch on initial mount if admit card hasn't been retrieved yet for this session
  useEffect(() => {
    if (currentStudentId && !hasOfficialAdmitCardData && !hasAttemptedFetch && !isFetching) {
      performFetch();
    }
  }, [currentStudentId, hasOfficialAdmitCardData, hasAttemptedFetch, isFetching, performFetch]);

  // Real date format
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  const timeStr = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Exam Admit Card</h2>
          <p className="text-sm text-stone-500 mt-1">Download and print your official final examination entry slip.</p>
        </div>

        {/* Action button to re-fetch from SIMS on demand */}
        {!isFetching && (
          <button
            onClick={() => performFetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800/60 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-2 rounded-xl transition-all"
            title="Refresh Admit Card from Presidency University SIMS"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Re-check SIMS</span>
          </button>
        )}
      </div>

      {/* 1. GHOST SKELETON + REAL-TIME PROMPT WHILE FETCHING */}
      {isFetching && (
        <div className="space-y-6">
          {/* Informative Status Banner with Radar Pulse */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40" />
                <Loader2 className="w-5 h-5 animate-spin relative" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Retrieving Examination Clearance & Routine...
                </h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                  Connecting directly to the Presidency University SIMS exam database for Student ID <strong className="font-mono">{currentStudentId}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Realistic Official Ghost Skeleton */}
          <AdmitCardSkeleton />
        </div>
      )}

      {/* 2. PASSWORD PROMPT (if session was cleared / page reloaded without active session password) */}
      {!isFetching && showPasswordPrompt && (
        <Card className="p-8 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-2xl max-w-xl mx-auto shadow-sm text-center">
          <div className="w-14 h-14 bg-[#8c1515]/10 dark:bg-red-950/40 text-[#8c1515] dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
            SIMS Authentication Required
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-md mx-auto">
            To query official exam routine and financial clearance from Presidency University SIMS, please provide your portal password for verification.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualPassword) performFetch(manualPassword);
            }}
            className="space-y-4 max-w-sm mx-auto"
          >
            <div className="text-left">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300 mb-1 block">
                SIMS Portal Password
              </label>
              <input
                type="password"
                required
                value={manualPassword}
                onChange={(e) => setManualPassword(e.target.value)}
                placeholder="Enter your SIMS password"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
              />
            </div>
            <button
              type="submit"
              disabled={!manualPassword || isFetching}
              className="w-full bg-[#8c1515] hover:bg-[#a11a1a] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              Fetch Examination Routine
            </button>
          </form>
        </Card>
      )}

      {/* 3. RESTRICTED FLOW - Match real Presidency SIMS screenshot exactly */}
      {!isFetching && !showPasswordPrompt && hasOutstandingBalance && (
        <div className="space-y-6">
          <Card className="p-8 border-2 border-dashed border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center rounded-2xl max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">Access Restricted</h3>
            <p className="text-stone-700 dark:text-stone-300 font-semibold mb-6 max-w-md mx-auto text-base">
              Your account has restriction to view this information. Please contact Accounts Office.
            </p>

            <div className="py-4 border-t border-red-100 dark:border-red-900/30 flex flex-col md:flex-row justify-around items-center gap-4 text-xs font-mono text-stone-500 dark:text-stone-400">
              <div>Admit Card Print Date: <span className="font-bold text-stone-700 dark:text-stone-300">{dateStr}</span></div>
              <div>Time: <span className="font-bold text-stone-700 dark:text-stone-300">{timeStr}</span></div>
            </div>
          </Card>

          {/* Controller of Examinations signature footer (Matching real screenshot exactly) */}
          <div className="pt-10 max-w-2xl mx-auto flex justify-end">
            <div className="text-right space-y-1">
              <div className="inline-block border-b border-stone-300 dark:border-stone-700 pb-2">
                <img 
                  src="https://wsrv.nl/?url=http://sims.presidency.edu.bd/img/layout/Signature_of_Exam_Controller.png&output=webp" 
                  alt="Signature" 
                  className="h-10 w-auto object-contain mx-auto mix-blend-multiply dark:brightness-200 dark:contrast-100" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">(Mohammad Zahedur Rahman)</div>
              <div className="text-xs font-bold text-stone-500 dark:text-stone-400">Controller of Examinations</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOT FOUND PROMPT (When cleared of financial restriction, but no routine published yet) */}
      {!isFetching && !showPasswordPrompt && !hasOutstandingBalance && existingExams.length === 0 && (
        <Card className="p-8 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-2xl max-w-2xl mx-auto shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
            No Exam Routine or Admit Card Found
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            The Office of the Controller of Examinations has not published the official schedule for your registered courses yet, or the final routine is still being finalized.
          </p>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800 max-w-md mx-auto mb-6 text-xs text-stone-600 dark:text-stone-300 text-left space-y-1.5">
            <div className="font-semibold text-stone-800 dark:text-stone-200">Notice for Students:</div>
            <div>• Admit cards are generally published 7-10 days prior to term finals.</div>
            <div>• Ensure all semester fee installments are cleared in the Accounts Office.</div>
            <div>• If your routine was recently published, click below to re-check SIMS.</div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              onClick={() => performFetch()}
              className="flex items-center gap-2 font-bold bg-[#8c1515] hover:bg-[#a11a1a] text-white px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Re-check Presidency SIMS
            </button>
          </div>
        </Card>
      )}

      {/* 5. CLEARED FLOW - Render actual print-friendly Admit Card */}
      {!isFetching && !showPasswordPrompt && !hasOutstandingBalance && existingExams.length > 0 && (
        <div className="space-y-6">
          <Card className="p-4 sm:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl mx-auto shadow-sm print:p-0 print:border-none print:shadow-none">
            {/* Slip Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 sm:pb-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <img 
                  src="https://wsrv.nl/?url=http://sims.presidency.edu.bd/img/layout/header_logo.png&output=webp" 
                  alt="Presidency University" 
                  className="h-10 sm:h-12 w-auto object-contain dark:brightness-200 shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h1 className="text-sm sm:text-lg font-black tracking-tight text-stone-900 dark:text-white uppercase leading-tight">Presidency University</h1>
                  <p className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-widest leading-tight">Office of the Controller of Examinations</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 font-bold uppercase tracking-wider text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1">
                  Cleared to Sit
                </Badge>
              </div>
            </div>

            {/* Slip Meta - 2 Column Document Layout on all screens */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 py-4 sm:py-6 border-b border-stone-100 dark:border-stone-800/50 text-xs sm:text-sm">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Student Name:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 truncate">{student?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Student ID:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{student?.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Status:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Program:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 truncate">{student?.program}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Current Semester:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.currentSemester}</span>
                </div>
              </div>
            </div>

            {/* Allowed Courses List with Room - Unified Table View for Mobile and Desktop */}
            <div className="py-4 sm:py-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">Exam Schedule</h4>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium sm:hidden">Swipe horizontally to view full table →</span>
              </div>
              
              {/* Universal Examination Routine Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 custom-scrollbar overscroll-x-contain">
                <table className="w-full min-w-[640px] border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-bold text-stone-700 dark:text-stone-300">
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px] sticky left-0 z-10 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur border-r border-stone-200 dark:border-stone-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.2)]">Course</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px] text-center">Section</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px]">Day</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px]">Date</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px]">Time</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px] text-center">Room</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-[13px]">Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingExams.map((ex, i) => (
                      <tr key={i} className="border-b border-stone-100 dark:border-stone-800/50 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 text-stone-800 dark:text-stone-200">
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-mono font-bold text-stone-900 dark:text-white sticky left-0 z-10 bg-white/95 dark:bg-stone-950/95 backdrop-blur border-r border-stone-200 dark:border-stone-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.2)]">{ex.courseCode}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-center font-mono">{ex.section}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">{ex.day}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium">{ex.date}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-stone-600 dark:text-stone-400">{ex.time}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-center font-bold text-emerald-600 dark:text-emerald-400">{ex.room}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm capitalize">{ex.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-lg text-[11px] sm:text-xs text-stone-600 dark:text-stone-400">
                Congratulations and wishing you the best success always. For any query please visit Registrar office / Accounts office / Controller office.
              </div>
            </div>

            {/* Slip Footer Signature */}
            <div className="pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-row justify-between items-end gap-3 sm:gap-6">
              <div className="text-[10px] sm:text-xs font-mono text-stone-400 dark:text-stone-500 text-left">
                <div>Printed: {dateStr} at {timeStr}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ System Verified Online</div>
              </div>
              <div className="text-right space-y-0.5 sm:space-y-1 shrink-0">
                <div className="inline-block border-b border-stone-300 dark:border-stone-700 pb-1 sm:pb-2">
                  <img 
                    src="https://wsrv.nl/?url=http://sims.presidency.edu.bd/img/layout/Signature_of_Exam_Controller.png&output=webp" 
                    alt="Signature" 
                    className="h-8 sm:h-10 w-auto object-contain ml-auto mix-blend-multiply dark:brightness-200 dark:contrast-100" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">(Mohammad Zahedur Rahman)</div>
                <div className="text-[10px] sm:text-xs font-bold text-stone-500 dark:text-stone-400">Controller of Examinations</div>
              </div>
            </div>
          </Card>

          {/* Printing Action */}
          <div className="flex justify-center mt-6 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 font-bold bg-[#8c1515] hover:bg-[#a11a1a] dark:bg-red-600 dark:hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow-lg shadow-red-500/10 transition-all active:scale-95"
            >
              <Printer className="w-5 h-5" /> Print Admit Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
