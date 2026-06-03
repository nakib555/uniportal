import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Search, AlertTriangle, Users, Filter, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

export function AdminAttendanceManagementView() {
  const [search, setSearch] = useState('');
  const [warningStudent, setWarningStudent] = useState<any | null>(null);

  const chartData = [
    { name: 'Week 1', attendance: 95 },
    { name: 'Week 2', attendance: 92 },
    { name: 'Week 3', attendance: 88 },
    { name: 'Week 4', attendance: 85 },
    { name: 'Week 5', attendance: 89 },
    { name: 'Week 6', attendance: 91 },
  ];

  const [flaggedStudents, setFlaggedStudents] = useState([
    { id: '21104104', name: 'Al Ibrahim', course: 'CSE-305', percentage: 65, missed: 4, consecutive: 3 },
    { id: '21104106', name: 'Fahim Rahman', course: 'MAT-201', percentage: 58, missed: 5, consecutive: 5 },
  ]);

  const sendWarning = () => {
    if (warningStudent) {
      setFlaggedStudents(prev => prev.filter(s => s.id !== warningStudent.id));
      setWarningStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!warningStudent} onOpenChange={(open) => !open && setWarningStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Automated Warning</DialogTitle>
            <DialogDescription>
              Are you sure you want to send a low attendance warning to {warningStudent?.name}? This will send an email and SMS to the student.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={sendWarning}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Attendance Management</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Monitor campus-wide attendance trends and review flagged students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Global Attendance</p>
               <p className="text-2xl font-black text-stone-900 dark:text-white">88.5%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
               <CheckCircle2 className="w-6 h-6" />
            </div>
         </Card>
         <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Active Classes</p>
               <p className="text-2xl font-black text-stone-900 dark:text-white">42</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Users className="w-6 h-6" />
            </div>
         </Card>
         <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Flagged Students</p>
               <p className="text-2xl font-black text-red-600 dark:text-red-400">{flaggedStudents.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
               <AlertTriangle className="w-6 h-6" />
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
            <h3 className="font-bold text-stone-900 dark:text-white">Overall Trend</h3>
          </div>
          <div className="h-64 px-4 pt-4 w-full bg-white dark:bg-stone-950">
            <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                   <linearGradient id="colorAttd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} stroke="#a8a29e" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fill="url(#colorAttd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-between items-center">
            <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Action Required: Low Attendance
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-950 p-4 space-y-3">
             {flaggedStudents.map((s, i) => (
                <div key={i} className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                   <div>
                      <h4 className="font-bold text-stone-900 dark:text-white">{s.name} <span className="font-mono text-xs text-stone-500 font-normal ml-1">({s.id})</span></h4>
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mt-1">Course: {s.course} • Missed: <span className="text-red-600 dark:text-red-400 font-bold">{s.consecutive} consecutive</span></p>
                   </div>
                   <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1">
                      <div className="w-12 h-12 rounded-full border-4 border-red-100 dark:border-red-900/30 flex items-center justify-center font-bold text-red-600 dark:text-red-400 text-sm">
                         {s.percentage}%
                      </div>
                      <button onClick={() => setWarningStudent(s)} className="text-xs font-bold text-[#8c1515] dark:text-[#ef4444] hover:underline whitespace-nowrap">Send Warning</button>
                   </div>
                </div>
             ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
