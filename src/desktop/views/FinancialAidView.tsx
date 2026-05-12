import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { FileText, CheckCircle2 } from 'lucide-react';
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

export function FinancialAidView() {
  const [applyingFor, setApplyingFor] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleApply = () => {
    setSuccessMsg(`Successfully applied for "${applyingFor}"`);
    setApplyingFor(null);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {successMsg && (
        <div className="absolute top-0 right-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 z-10">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {successMsg}
        </div>
      )}

      <Dialog open={!!applyingFor} onOpenChange={(open) => !open && setApplyingFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Financial Aid</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply for "{applyingFor}"? 
              You may need to upload supporting documents in the next steps.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleApply}>
              Begin Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Financial Aid & Scholarships</h2>
      <Card className="p-6 bg-stone-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
         <div className="flex justify-between items-start">
            <div>
               <Badge variant="success" className="mb-2">Active</Badge>
               <h3 className="text-xl font-bold text-stone-900 dark:text-white">Merit Scholarship (Dean's List)</h3>
               <p className="text-stone-600 dark:text-stone-400 mt-1">Based on maintaining a CGPA above 3.80</p>
            </div>
            <div className="text-right">
               <div className="text-sm text-stone-500 dark:text-stone-400 uppercase font-bold tracking-widest">Waiver Percentage</div>
               <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">50%</div>
            </div>
         </div>
         <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" /> Applied automatically to your tuition fees
         </div>
      </Card>

      <h3 className="font-bold text-lg mt-8 text-stone-900 dark:text-white">Available Applications</h3>
      <Card className="p-0 overflow-hidden shadow-sm border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
         <div className="divide-y divide-stone-200 dark:divide-stone-800 relative">
            <div className="p-4 flex justify-between items-center hover:bg-stone-50 dark:hover:bg-stone-900/50 cursor-pointer transition-colors group">
               <div>
                  <h4 className="font-bold group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors text-stone-900 dark:text-white">Need-Based Financial Aid</h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Requires tax documents and income statements.</p>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setApplyingFor('Need-Based Financial Aid'); }} className="px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-900 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">Apply Now</button>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-stone-50 dark:hover:bg-stone-900/50 cursor-pointer transition-colors group">
               <div>
                  <h4 className="font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors text-stone-900 dark:text-white">Sibling Discount</h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400">For students who have a currently enrolled sibling.</p>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setApplyingFor('Sibling Discount'); }} className="px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-900 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">Apply Now</button>
            </div>
         </div>
      </Card>
    </div>
  );
}
