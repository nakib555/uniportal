import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, BookOpen, Clock, AlertTriangle, ChevronRight, TrendingUp, Check, X } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { STUDENT_DATA } from '../../data';
import { useAppStore } from '../../store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

export function AdminDashboardView() {
  const store = useAppStore();
  const [requestToActOn, setRequestToActOn] = useState<{ reqId: string, action: 'Approve' | 'Reject' } | null>(null);
  
  const chartData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 88 },
    { name: 'Wed', attendance: 92 },
    { name: 'Thu', attendance: 90 },
    { name: 'Fri', attendance: 87 },
  ];

  const confirmAction = () => {
    if (requestToActOn) {
      store.resolveApproval(requestToActOn.reqId);
      setRequestToActOn(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!requestToActOn} onOpenChange={(open) => !open && setRequestToActOn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {requestToActOn?.action === 'Approve' ? 'Approval' : 'Rejection'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {requestToActOn?.action === 'Approve' ? 'approve' : 'reject'} this request?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button 
              variant={requestToActOn?.action === 'Approve' ? 'default' : 'destructive'} 
              className={requestToActOn?.action === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              onClick={confirmAction}
            >
              Confirm {requestToActOn?.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <p className="text-3xl font-black text-stone-900 dark:text-white">{store.pendingApprovals.length}</p>
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
        <Card className="col-span-2 p-0 border-stone-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-between items-center">
            <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Department Attendance Trend
            </h3>
          </div>
          <div className="h-64 px-4 pt-4 w-full flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                   <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: store.isDarkMode ? '#1c1917' : '#fff', color: store.isDarkMode ? '#fff' : '#000', borderRadius: '12px', border: store.isDarkMode ? '1px solid #292524' : '1px solid #f5f5f4' }} />
                <Area type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 border-stone-200 flex flex-col h-full">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-between items-center">
            <h3 className="font-bold text-stone-900 dark:text-white">Recent Requests</h3>
            {store.pendingApprovals.length > 0 && (
               <Badge variant="brand">{store.pendingApprovals.length} Pending</Badge>
            )}
          </div>
          <ul className="divide-y divide-stone-100 dark:divide-stone-800 flex-1 overflow-y-auto">
            {store.pendingApprovals.length === 0 ? (
               <li className="p-8 text-center text-stone-500 dark:text-stone-400">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="font-bold text-stone-900 dark:text-stone-100">All caught up!</p>
                  <p className="text-sm mt-1">No pending requests right now.</p>
               </li>
            ) : (
               store.pendingApprovals.map(req => (
                 <li key={req.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                   <div className="flex justify-between items-start mb-3">
                     <div className="pr-4">
                       <p className="font-bold text-stone-900 dark:text-white text-sm">{req.type}</p>
                       <p className="text-xs text-stone-500 font-mono mt-0.5">{req.reqId}</p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button
                       onClick={() => setRequestToActOn({ reqId: req.id, action: 'Approve' })}
                       className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-md transition-colors"
                     >
                       <Check className="w-3.5 h-3.5" /> Approve
                     </button>
                     <button
                       onClick={() => setRequestToActOn({ reqId: req.id, action: 'Reject' })}
                       className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 rounded-md transition-colors"
                     >
                       <X className="w-3.5 h-3.5" /> Reject
                     </button>
                   </div>
                 </li>
               ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
