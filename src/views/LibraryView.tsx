import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { BookMarked, Search, Clock, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

export function LibraryView() {
  const [actionItem, setActionItem] = useState<{ type: 'renew' | 'hold', title: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirm = () => {
    setSuccessMsg(`Successfully ${actionItem?.type === 'renew' ? 'renewed' : 'placed hold on'} "${actionItem?.title}"`);
    setActionItem(null);
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

      <Dialog open={!!actionItem} onOpenChange={(open) => !open && setActionItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionItem?.type === 'renew' ? 'renew' : 'place a hold on'} "{actionItem?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Library Management</h2>
         <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input placeholder="Search catalog..." className="pl-9 pr-4 py-2 border border-stone-200 dark:border-stone-700 rounded-full text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#8c1515] dark:focus:ring-[#ef4444]" />
         </div>
      </div>
      
      <h3 className="font-bold text-lg mt-8 text-stone-900 dark:text-white">Currently Borrowed</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="p-4 flex gap-4 items-center hover:shadow-md transition-all group border-stone-200 dark:border-stone-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 bg-white dark:bg-stone-950">
            <div className="w-16 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
               <BookMarked className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-stone-900 dark:text-white">Introduction to Algorithms</h4>
               <p className="text-sm text-stone-500 dark:text-stone-400">Thomas H. Cormen</p>
               <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-amber-500 dark:text-amber-500" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-500">Due in 3 days</span>
               </div>
            </div>
            <button onClick={() => setActionItem({ type: 'renew', title: 'Introduction to Algorithms' })} className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-300 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">Renew</button>
         </Card>
      </div>

      <h3 className="font-bold text-lg mt-8 mb-4 text-stone-900 dark:text-white">Catalog Results</h3>
      <div className="grid grid-cols-1 gap-4">
         {[1,2,3].map(i => {
           const title = i === 1 ? 'Artificial Intelligence: A Modern Approach' : i === 2 ? 'Introduction to the Theory of Computation' : 'Clean Code';
           return (
             <div key={i} className="p-4 flex gap-4 items-center border rounded-lg hover:shadow-sm transition-all group hover:-translate-y-0.5 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                <div className="w-16 h-20 bg-stone-100 dark:bg-stone-800 rounded flex items-center justify-center group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                   <BookMarked className="w-8 h-8 text-stone-300 dark:text-stone-500 group-hover:text-stone-400 group-hover:scale-105 transition-all" />
                </div>
                <div className="flex-1">
                   <h4 className="font-bold group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors">{title}</h4>
                   <p className="text-sm text-stone-500 dark:text-stone-400">{i === 1 ? 'Stuart Russell' : i === 2 ? 'Michael Sipser' : 'Robert C. Martin'}</p>
                   <Badge variant="outline" className="mt-2 text-xs opacity-75 group-hover:opacity-100 transition-opacity">Available</Badge>
                </div>
                <button onClick={() => setActionItem({ type: 'hold', title })} className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer group-hover:border-stone-300 dark:group-hover:border-stone-600">Place Hold</button>
             </div>
           );
         })}
      </div>
    </div>
  );
}
