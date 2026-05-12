import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Users, BookOpen, Clock, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { STUDENT_DATA } from '../../../data';

export function AdminDashboardView() {
  const chartData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 88 },
    { name: 'Wed', attendance: 92 },
    { name: 'Thu', attendance: 90 },
    { name: 'Fri', attendance: 87 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Overview of department metrics and alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Total Students</p>
          <p className="text-3xl font-black text-stone-900 dark:text-white">1,248</p>
        </Card>
        
        <Card className="p-6 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Active Courses</p>
          <p className="text-3xl font-black text-stone-900 dark:text-white">86</p>
        </Card>

        <Card className="p-6 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Pending Approvals</p>
          <p className="text-3xl font-black text-stone-900 dark:text-white">14</p>
        </Card>

        <Card className="p-6 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Low Attendance Alerts</p>
          <p className="text-3xl font-black text-stone-900 dark:text-white">8</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-0 border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-between items-center">
            <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Department Attendance Trend
            </h3>
          </div>
          <div className="h-64 px-4 pt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                   <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
            <h3 className="font-bold text-stone-900 dark:text-white">Recent Requests</h3>
          </div>
          <ul className="divide-y divide-stone-100 dark:divide-stone-800">
            {[1, 2, 3, 4].map(idx => (
              <li key={idx} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-stone-900 dark:text-white text-sm">Course Enrollment Add/Drop</p>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">REQ-{1000 + idx}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
