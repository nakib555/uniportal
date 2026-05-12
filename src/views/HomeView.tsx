import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { STUDENT_DATA } from '../data';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { 
  GraduationCap, CheckCircle2, Wallet, BookMarked, TrendingUp, ChevronRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { registeredCourses, isDarkMode } = useAppStore();
  const student = STUDENT_DATA;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">Welcome back, {student.name.split(' ')[0]}</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Here is what's happening with your academics today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-5 md:p-6 relative group transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => useAppStore.getState().setActiveTab('transcript')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-stone-500 dark:text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Current CGPA</div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.cgpa.toFixed(2)}</div>
        </Card>
        
        <Card className="p-5 md:p-6 relative group transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => useAppStore.getState().setActiveTab('degree-audit')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-stone-500 dark:text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Credits Earned</div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.creditsCompleted} <span className="text-base font-medium text-stone-400 dark:text-stone-600">/ 140</span></div>
        </Card>
        
        <Card className="p-5 md:p-6 relative group transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => useAppStore.getState().setActiveTab('registered-courses')}>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
            <BookMarked className="w-5 h-5" />
          </div>
          <div className="text-stone-500 dark:text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Enrolled Courses</div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">{registeredCourses.length}</div>
        </Card>
        
        <Card className="p-5 md:p-6 relative group transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => useAppStore.getState().setActiveTab('statement')}>
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 flex items-center justify-center mb-4 text-[#8c1515] dark:text-[#ef4444]">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-stone-500 dark:text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Balance</div>
          <div className={`text-2xl md:text-3xl font-extrabold tracking-tight ${student.accountBalance < 0 ? 'text-[#8c1515] dark:text-[#ef4444]' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {Math.abs(student.accountBalance).toLocaleString()} <span className="text-base font-semibold opacity-50 tracking-normal">Tk</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {student.gpaHistory && student.gpaHistory.length > 0 && (
          <Card className="p-0 col-span-full lg:col-span-2 flex flex-col">
             <div className="px-6 py-4 md:py-5 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/30 dark:bg-stone-900/30">
                <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-indigo-500" /> Academic Progression
                </h3>
             </div>
             <div className="p-4 md:p-6 h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={0}>
                   <AreaChart data={student.gpaHistory}>
                      <defs>
                         <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <XAxis dataKey="semester" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} stroke="#888" />
                      <YAxis domain={['dataMin - 0.2', 4.0]} hide />
                      <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1c1917' : '#fff', color: isDarkMode ? '#fff' : '#000', borderRadius: '12px', border: isDarkMode ? '1px solid #292524' : '1px solid #f5f5f4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [v.toFixed(2), 'Semester GPA']} />
                      <Area type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
        )}

        <Card className="p-0 flex flex-col h-full">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
            <h3 className="font-bold text-stone-900 dark:text-white">Latest Notices</h3>
            {useAppStore.getState().notices.length > 0 && <Badge variant="brand">{useAppStore.getState().notices.length} New</Badge>}
          </div>
          <ul className="divide-y divide-stone-100 dark:divide-stone-800 flex-1">
            {useAppStore(state => state.notices).length === 0 ? (
               <li className="p-6 text-center text-stone-500 text-sm">No new notices.</li>
            ) : (
               useAppStore(state => state.notices).map((notice) => (
                 <li key={notice.id} className="p-4 px-6 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group cursor-pointer flex gap-4 items-start" onClick={() => useAppStore.getState().dismissNotice(notice.id)}>
                   <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notice.important ? 'bg-[#8c1515] dark:bg-[#ef4444]' : 'bg-stone-300 dark:bg-stone-600'}`} />
                   <div className="flex-1 min-w-0 pr-4">
                     <h4 className={`text-sm font-semibold mb-1 leading-snug line-clamp-2 transition-colors ${notice.important ? 'text-stone-900 dark:text-stone-100 group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444]' : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white'}`}>
                       {notice.title}
                     </h4>
                     <div className="text-[11px] font-bold uppercase tracking-widest text-stone-400">{notice.date}</div>
                   </div>
                   <div className="text-xs text-stone-300 dark:text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity mt-1">Dismiss</div>
                 </li>
               ))
            )}
          </ul>
        </Card>

        <Card className="p-0 flex flex-col h-full">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
            <h3 className="font-bold text-stone-900 dark:text-white">Upcoming Classes</h3>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Today</span>
          </div>
          <div className="flex-1 flex flex-col">
            {registeredCourses.length === 0 ? (
               <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                 <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800/50 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                 </div>
                 <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1">No more classes today</h4>
                 <p className="text-sm text-stone-500 dark:text-stone-400 max-w-[200px]">You're all caught up for the day. Great job!</p>
               </div>
            ) : (
               <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                 {registeredCourses.slice(0, 3).map((course, idx) => (
                    <li key={course.code + idx} className="p-4 px-6 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 items-center">
                       <div className="w-12 shrink-0 text-center">
                          <p className="text-sm font-bold text-stone-900 dark:text-white">{idx === 0 ? '08:00' : idx === 1 ? '10:00' : '13:00'}</p>
                          <p className="text-xs text-stone-400">AM</p>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-stone-900 dark:text-white truncate">{course.code}</h4>
                          <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{course.title}</p>
                       </div>
                    </li>
                 ))}
               </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
