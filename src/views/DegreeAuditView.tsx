import React from 'react';
import { Card, Badge } from '../components/ui';
import { COMPLETED_COURSES } from '../data';
import { ChevronRight, GraduationCap, ArrowRight, CheckCircle2, Lock, Download } from 'lucide-react';
import { PrintableDegreeAudit } from '../components/print/PrintableDegreeAudit';

export function DegreeAuditView() {
  const totalRequired = 130;
  const totalCompleted = COMPLETED_COURSES.reduce((sum, c) => sum + c.credits, 0);
  const totalProgress = (totalCompleted / totalRequired) * 100;

  const studentInfo = {
    name: "Al Ibrahim",
    id: "21104104",
    program: "BSc in Computer Science & Engineering",
    cgpa: 3.82,
    creditsReq: totalRequired,
    creditsComp: totalCompleted
  };

  const reqs = [
    { area: 'Core Requirements', req: 60, comp: 45 },
    { area: 'Electives', req: 30, comp: 12 },
    { area: 'Free Electives', req: 34, comp: 20 },
    { area: 'Capstone Project', req: 6, comp: 0 },
  ];

  const pathways = [
    { id: 'math', title: 'Mathematics', courses: [
      { code: 'MAT-101', status: 'completed' },
      { code: 'MAT-102', status: 'completed' },
      { code: 'MAT-201', status: 'current' },
      { code: 'MAT-301', status: 'locked' }
    ]},
    { id: 'core', title: 'Core CS', courses: [
      { code: 'CSE-101', status: 'completed' },
      { code: 'CSE-201', status: 'completed' },
      { code: 'CSE-301', status: 'completed' },
      { code: 'CSE-401', status: 'locked' }
    ]}
  ];

  return (
    <>
      <PrintableDegreeAudit student={studentInfo} requirements={reqs} />
      <div className="space-y-6 print-hide">
        <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <GraduationCap className="w-8 h-8" />
             <h2 className="text-2xl font-bold">Degree Audit</h2>
          </div>
          <div className="text-right">
             <div className="text-sm opacity-80 uppercase tracking-wider">Credits Completed</div>
             <div className="text-3xl font-black">{totalCompleted} / {totalRequired}</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div className="bg-white h-3 rounded-full" style={{ width: `${totalProgress}%` }} />
        </div>
      </Card>
      
      <div className="flex justify-between items-end mt-8 mb-4">
         <h3 className="font-bold text-lg text-stone-900 dark:text-white">Degree Requirement Areas</h3>
         <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold bg-[#8c1515] hover:bg-[#b31b1b] text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" /> View Full Audit Report
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <Card className="p-4 border-l-4 border-l-emerald-500 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
           <h4 className="font-bold mb-2 group-hover:text-emerald-600 transition-colors text-stone-900 dark:text-white">Core Requirements</h4>
           <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-stone-600 dark:text-stone-400">45 / 60 credits</p>
             <span className="text-xs font-bold text-emerald-500">75%</span>
           </div>
           <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 mb-3">
             <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `75%` }} />
           </div>
           <button className="text-emerald-600 dark:text-emerald-500 text-sm font-bold mt-2 flex items-center group-hover:underline">View completion <ChevronRight className="w-4 h-4" /></button>
         </Card>
         
         <Card className="p-4 border-l-4 border-l-amber-500 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
           <h4 className="font-bold mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors text-stone-900 dark:text-white">Electives</h4>
           <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-stone-600 dark:text-stone-400">12 / 30 credits</p>
             <span className="text-xs font-bold text-amber-500">40%</span>
           </div>
           <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 mb-3">
             <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `40%` }} />
           </div>
           <button className="text-amber-600 dark:text-amber-500 text-sm font-bold mt-2 flex items-center group-hover:underline">View options <ChevronRight className="w-4 h-4" /></button>
         </Card>
         
         <Card className="p-4 border-l-4 border-l-blue-500 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
           <h4 className="font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors text-stone-900 dark:text-white">Capstone Project</h4>
           <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-stone-600 dark:text-stone-400">0 / 6 credits</p>
             <span className="text-xs font-bold text-stone-400">0%</span>
           </div>
           <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 mb-3">
             <div className="bg-stone-300 dark:bg-stone-700 h-1.5 rounded-full" style={{ width: `0%` }} />
           </div>
           <div className="flex gap-2">
             <Badge variant="outline" className="mt-1">Locked</Badge>
             <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Requires 100 Cr</Badge>
           </div>
         </Card>
      </div>

      <div className="mt-8">
         <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4">Prerequisite Pathway Map</h3>
         <Card className="p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 overflow-x-auto print:overflow-visible">
            <div className="space-y-8 min-w-[700px]">
               {pathways.map(path => (
                 <div key={path.id}>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">{path.title} Sequence</h4>
                    <div className="flex items-center">
                       {path.courses.map((course, idx) => (
                         <React.Fragment key={course.code}>
                            <div className="relative group">
                               <div className={`w-28 py-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:-translate-y-1 ${
                                 course.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/20' :
                                 course.status === 'current' ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-500/20' :
                                 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:border-stone-300 dark:hover:border-stone-700'
                               }`}>
                                  {course.status === 'completed' && <CheckCircle2 className="w-5 h-5 mb-1" />}
                                  {course.status === 'current' && <div className="w-2 h-2 rounded-full bg-indigo-500 mb-2 relative"><div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping"></div></div>}
                                  {course.status === 'locked' && <Lock className="w-4 h-4 mb-1 opacity-50" />}
                                  <span className="font-bold text-sm tracking-tight">{course.code}</span>
                               </div>
                               
                               {/* Tooltip */}
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl shadow-black/20 z-10 pointer-events-none">
                                 {course.status === 'completed' ? 'Completed (A-)' : course.status === 'current' ? 'Currently Enrolled' : 'Needs Prerequisite'}
                               </div>
                            </div>
                            
                            {idx < path.courses.length - 1 && (
                               <div className="flex-1 flex items-center justify-center px-2">
                                  <div className={`h-0.5 w-full ${path.courses[idx].status === 'completed' ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-stone-800'}`}></div>
                                  <ArrowRight className={`w-4 h-4 flex-shrink-0 -ml-2 ${path.courses[idx].status === 'completed' ? 'text-emerald-500' : 'text-stone-300 dark:text-stone-700'}`} />
                               </div>
                            )}
                         </React.Fragment>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
    </>
  );
}
