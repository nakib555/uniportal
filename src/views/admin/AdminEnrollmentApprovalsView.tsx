import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

export function AdminEnrollmentApprovalsView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [requestToActOn, setRequestToActOn] = useState<{ req: any, action: 'Approved' | 'Rejected' } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [pendingRequests, setPendingRequests] = useState([
    { id: 'REQ-1042', studentId: '21104104', studentName: 'Al Ibrahim', reason: 'Prerequisite override requested. Taken equivalent course in summer.', course: 'CSE-401', date: '2 hours ago' },
    { id: 'REQ-1043', studentId: '21104105', studentName: 'Sarah Ahmed', reason: 'Credit limit exceeded (requests 24 credits). Needs approval.', course: 'MAT-301', date: '4 hours ago' },
  ]);

  const [resolvedRequests, setResolvedRequests] = useState([
    { id: 'REQ-1040', studentId: '21104102', studentName: 'Fahim Rahman', course: 'CSE-301', status: 'Approved', date: '1 day ago' },
  ]);

  const confirmAction = () => {
    if (!requestToActOn) return;
    const { req, action } = requestToActOn;
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    setResolvedRequests(prev => [{ ...req, status: action, date: 'Just now', rejectReason: action === 'Rejected' ? rejectReason : undefined }, ...prev]);
    setRequestToActOn(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!requestToActOn} onOpenChange={(open) => {
        if (!open) {
          setRequestToActOn(null);
          setRejectReason('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {requestToActOn?.action === 'Approved' ? 'Approval' : 'Rejection'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {requestToActOn?.action === 'Approved' ? 'approve' : 'reject'} this request for {requestToActOn?.req.studentName}?
              This action will notify the student.
            </DialogDescription>
            {requestToActOn?.action === 'Rejected' && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Reason for Rejection <span className="text-stone-400 font-normal">(Optional)</span></label>
                <textarea 
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this request is being rejected..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] h-24 resize-none"
                />
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button 
              variant={requestToActOn?.action === 'Approved' ? 'default' : 'destructive'} 
              className={requestToActOn?.action === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              onClick={confirmAction}
            >
              Confirm {requestToActOn?.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Enrollment Approvals</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage special enrollment requests, overrides, and limit extensions.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-stone-200 dark:border-stone-800">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-1 font-bold text-sm transition-colors border-b-2 ${activeTab === 'pending' ? 'border-[#8c1515] dark:border-[#ef4444] text-[#8c1515] dark:text-[#ef4444]' : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button 
          onClick={() => setActiveTab('resolved')}
          className={`pb-2 px-1 font-bold text-sm transition-colors border-b-2 ${activeTab === 'resolved' ? 'border-[#8c1515] dark:border-[#ef4444] text-[#8c1515] dark:text-[#ef4444]' : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          Resolved Archive
        </button>
      </div>

      <div className="space-y-4">
        {(activeTab === 'pending' ? pendingRequests : resolvedRequests).map((req, idx) => (
          <Card key={idx} className="p-0 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
             <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="font-mono text-xs font-bold bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-600 dark:text-stone-400">{req.id}</span>
                     <span className="text-xs text-stone-500 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {req.date}</span>
                     {activeTab === 'resolved' && (
                        <Badge variant={(req as any).status === 'Approved' ? 'success' : 'danger'} className="ml-auto">{(req as any).status}</Badge>
                     )}
                   </div>
                   <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1"><span className="text-stone-500 font-medium">Student:</span> {req.studentName} ({req.studentId})</h3>
                   <h4 className="font-medium text-stone-700 dark:text-stone-300 mb-4"><span className="text-stone-500">Target Course:</span> <span className="font-bold">{req.course}</span></h4>
                   {activeTab === 'pending' && (
                      <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-500">{req.reason}</p>
                      </div>
                   )}
                </div>
             </div>
              {activeTab === 'pending' && (
               <div className="p-6 md:w-1/3 flex flex-col justify-center gap-3 bg-stone-50/50 dark:bg-stone-900/50">
                  <button onClick={() => setRequestToActOn({ req, action: 'Approved' })} className="w-full py-2.5 bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> Approve Request
                  </button>
                  <button onClick={() => setRequestToActOn({ req, action: 'Rejected' })} className="w-full py-2.5 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                     <XCircle className="w-4 h-4" /> Reject Request
                  </button>
               </div>
             )}
          </Card>
        ))}
        {(activeTab === 'pending' && pendingRequests.length === 0) || (activeTab === 'resolved' && resolvedRequests.length === 0) ? (
          <div className="py-12 text-center text-stone-500 dark:text-stone-400 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
            <p>No requests found in this category.</p>
          </div>
        ) : null}
      </div>

    </div>
  );
}
