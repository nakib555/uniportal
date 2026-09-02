import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, FileText, CheckCircle2, FileSpreadsheet } from 'lucide-react';
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

export function AdminGradeManagementView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [gradeToApprove, setGradeToApprove] = useState<any | null>(null);
  const [gradeToReturn, setGradeToReturn] = useState<any | null>(null);
  const [gradeDetails, setGradeDetails] = useState<any | null>(null);

  const [pendingGrades, setPendingGrades] = useState([
    { course: 'CSE-101', section: 'A', instructor: 'Dr. Rahman', submittedAt: '2 hours ago', students: 45, average: '3.42' },
    { course: 'MAT-201', section: 'C', instructor: 'Prof. Islam', submittedAt: '1 day ago', students: 38, average: '3.15' },
  ]);

  const [approvedGrades, setApprovedGrades] = useState([
    { course: 'PHY-101', section: 'A', instructor: 'Dr. Hasan', submittedAt: '3 days ago', approvedAt: '1 day ago', students: 40, average: '3.60' },
  ]);

  const confirmApprove = () => {
    if (gradeToApprove) {
      setPendingGrades(prev => prev.filter(p => `${p.course}-${p.section}` !== `${gradeToApprove.course}-${gradeToApprove.section}`));
      setApprovedGrades(prev => [{ ...gradeToApprove, approvedAt: 'Just now' }, ...prev]);
      setGradeToApprove(null);
    }
  };

  const confirmReturn = () => {
    if (gradeToReturn) {
      setPendingGrades(prev => prev.filter(p => `${p.course}-${p.section}` !== `${gradeToReturn.course}-${gradeToReturn.section}`));
      setGradeToReturn(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!gradeToApprove} onOpenChange={(open) => !open && setGradeToApprove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Grades: {gradeToApprove?.course} - Sec {gradeToApprove?.section}</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve these grades submitted by {gradeToApprove?.instructor}? Once approved, grades will be published to the respective students.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button className="bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white" onClick={confirmApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!gradeToReturn} onOpenChange={(open) => !open && setGradeToReturn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return for Revision: {gradeToReturn?.course}</DialogTitle>
            <DialogDescription>
              Provide feedback for the instructor explaining why these grades are being returned.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea placeholder="e.g. Please review the unusually low average for Section C..." className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] h-24 resize-none" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={confirmReturn}>Send Revision Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!gradeDetails} onOpenChange={(open) => !open && setGradeDetails(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Grade Evaluation Sheet: {gradeDetails?.doc?.course}</DialogTitle>
            <DialogDescription>
              Instructor: {gradeDetails?.doc?.instructor} | Section: {gradeDetails?.doc?.section} | Term: Summer-26
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                   <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-bold text-stone-700 dark:text-stone-300">
                      <tr>
                         <th className="py-2.5 px-3">Student ID</th>
                         <th className="py-2.5 px-3">Name</th>
                         <th className="py-2.5 px-3 text-center">Continuous (40)</th>
                         <th className="py-2.5 px-3 text-center">Final Exam (60)</th>
                         <th className="py-2.5 px-3 text-center">Total (100)</th>
                         <th className="py-2.5 px-3 text-center">Grade</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                      <tr>
                         <td className="py-2.5 px-3 font-mono">2610329040</td>
                         <td className="py-2.5 px-3 font-bold text-stone-900 dark:text-white">Nakib Hassan Prince</td>
                         <td className="py-2.5 px-3 text-center font-mono">36</td>
                         <td className="py-2.5 px-3 text-center font-mono">50</td>
                         <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">86</td>
                         <td className="py-2.5 px-3 text-center"><Badge variant="default" className="bg-emerald-600">A-</Badge></td>
                      </tr>
                   </tbody>
                </table>
             </div>
             <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 px-1">
                <span>Class Average: 82.4%</span>
                <span>Passing Rate: 100%</span>
             </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button />}>
              Close Preview
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Grade Submissions</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Review and approve final grades submitted by faculty.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-stone-200 dark:border-stone-800">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-1 font-bold text-sm transition-colors border-b-2 ${activeTab === 'pending' ? 'border-[#8c1515] dark:border-[#ef4444] text-[#8c1515] dark:text-[#ef4444]' : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          Pending Review ({pendingGrades.length})
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`pb-2 px-1 font-bold text-sm transition-colors border-b-2 ${activeTab === 'approved' ? 'border-[#8c1515] dark:border-[#ef4444] text-[#8c1515] dark:text-[#ef4444]' : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          Approved History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'pending' ? pendingGrades : approvedGrades).map((submission, idx) => (
          <Card key={idx} className="p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">{submission.course}</h3>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-0.5">Section {submission.section}</p>
              </div>
              <Badge variant={activeTab === 'pending' ? 'warning' : 'success'}>
                {activeTab === 'pending' ? 'Pending Review' : 'Approved'}
              </Badge>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 dark:text-stone-400">Instructor:</span>
                <span className="font-bold text-stone-900 dark:text-white">{submission.instructor}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 dark:text-stone-400">Students Graded:</span>
                <span className="font-bold text-stone-900 dark:text-white">{submission.students} / {submission.students}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 dark:text-stone-400">Class Average:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">{submission.average}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 dark:text-stone-400">Submitted:</span>
                <span className="font-medium text-stone-700 dark:text-stone-300">{submission.submittedAt}</span>
              </div>
              {activeTab === 'approved' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Approved:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{(submission as any).approvedAt}</span>
                </div>
              )}
            </div>

            {activeTab === 'pending' ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={() => setGradeToApprove(submission)} className="flex-1 py-1.5 font-bold text-sm bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white rounded-lg transition-colors">
                    Approve
                  </button>
                  <button onClick={() => setGradeToReturn(submission)} className="flex-1 py-1.5 font-bold text-sm bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors">
                    Return
                  </button>
                </div>
                <button onClick={() => setGradeDetails({ doc: submission, action: 'details' })} className="w-full py-1.5 font-medium text-sm border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  View Details
                </button>
              </div>
            ) : (
                <button onClick={() => setGradeDetails({ doc: submission, action: 'sheet' })} className="w-full flex items-center justify-center gap-2 py-2 font-bold text-sm border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                 <FileText className="w-4 h-4" /> View Grade Sheet
                </button>
            )}
          </Card>
        ))}
      </div>
      
      {(activeTab === 'pending' && pendingGrades.length === 0) || (activeTab === 'approved' && approvedGrades.length === 0) ? (
        <div className="py-12 text-center text-stone-500 dark:text-stone-400 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
          <p>No grades found in this category.</p>
        </div>
      ) : null}
    </div>
  );
}
