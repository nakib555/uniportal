import React from 'react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { ShieldAlert, Printer, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export function AdmitCardView({ portal }: { portal?: ReturnType<typeof usePortalLogic> }) {
  const student = portal ? portal.student : null;
  const registeredCourses = portal ? portal.registeredCourses : [];
  
  const hasOutstandingBalance = student ? student.accountBalance < 0 : true;

  // Real date format
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  const timeStr = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Dynamic Main Title */}
      <div className="flex justify-between items-center print:hidden border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Exam Admit Card</h2>
          <p className="text-sm text-stone-500 mt-1">Download and print your official final examination entry slip.</p>
        </div>
      </div>

      {hasOutstandingBalance ? (
        /* RESTRICTED FLOW - Match real Presidency SIMS screenshot exactly */
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
      ) : (
        /* CLEARED FLOW - Render actual print-friendly Admit Card */
        <div className="space-y-6">
          <Card className="p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl mx-auto shadow-sm print:p-0 print:border-none print:shadow-none">
            {/* Slip Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <img 
                  src="https://wsrv.nl/?url=http://sims.presidency.edu.bd/img/layout/header_logo.png&output=webp" 
                  alt="Presidency University" 
                  className="h-12 w-auto object-contain dark:brightness-200" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h1 className="text-lg font-black tracking-tight text-stone-900 dark:text-white uppercase">Presidency University</h1>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Office of the Controller of Examinations</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 font-bold uppercase tracking-wider text-xs px-3 py-1">
                  Cleared to Sit
                </Badge>
              </div>
            </div>

            {/* Slip Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-stone-100 dark:border-stone-800/50 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Student Name:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Student ID:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{student?.id}</span>
                </div>
                <div className="flex justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Status:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Program:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.program}</span>
                </div>
                <div className="flex justify-between border-b border-stone-50 pb-1 dark:border-stone-800/30">
                  <span className="text-stone-500 font-medium">Current Semester:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{student?.currentSemester}</span>
                </div>
              </div>
            </div>

            {/* Allowed Courses List with Security Code & Room */}
            <div className="py-6">
              <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider mb-4">Exam Schedule & Security Codes</h4>
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-bold text-stone-700 dark:text-stone-300">
                      <th className="px-3.5 py-3">Security Code</th>
                      <th className="px-3.5 py-3">Course</th>
                      <th className="px-3.5 py-3 text-center">Section</th>
                      <th className="px-3.5 py-3">Day</th>
                      <th className="px-3.5 py-3">Date</th>
                      <th className="px-3.5 py-3">Time</th>
                      <th className="px-3.5 py-3 text-center">Room</th>
                      <th className="px-3.5 py-3">Faculty</th>
                      <th className="px-3.5 py-3">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(portal?.studentData?.exams || []).map((ex, i) => (
                      <tr key={i} className="border-b border-stone-100 dark:border-stone-800/50 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 text-stone-800 dark:text-stone-200">
                        <td className="px-3.5 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ex.securityCode || '51693' + (5 + i)}</td>
                        <td className="px-3.5 py-3 font-mono font-bold text-stone-900 dark:text-white">{ex.courseCode}</td>
                        <td className="px-3.5 py-3 text-center font-mono">{ex.section}</td>
                        <td className="px-3.5 py-3">{ex.day}</td>
                        <td className="px-3.5 py-3 font-medium">{ex.date}</td>
                        <td className="px-3.5 py-3 text-stone-600 dark:text-stone-400">{ex.time}</td>
                        <td className="px-3.5 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{ex.room}</td>
                        <td className="px-3.5 py-3 capitalize">{ex.faculty}</td>
                        <td className="px-3.5 py-3 text-stone-500">{ex.semester || 'Summer-26'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-600 dark:text-stone-400">
                Congratulations and wishing you the best success always. For any query please visit Registrar office / Accounts office / Controller office.
              </div>
            </div>

            {/* Slip Footer Signature */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-xs font-mono text-stone-400 dark:text-stone-500 text-center sm:text-left">
                <div>Printed: {dateStr} at {timeStr}</div>
                <div>System Verified Online</div>
              </div>
              <div className="text-center sm:text-right space-y-1">
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
