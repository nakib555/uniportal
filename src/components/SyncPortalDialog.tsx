import React from 'react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from './ui/dialog';
import { Button } from './ui/button';
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SyncPortalDialogProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export const SyncPortalDialog: React.FC<SyncPortalDialogProps> = ({ portal }) => {
  const { 
    isSyncing, 
    syncError, 
    setSyncError, 
    syncSuccess, 
    setSyncSuccess, 
    isSyncModalOpen, 
    setIsSyncModalOpen, 
    handleManualSync,
    student
  } = portal;

  const handleClose = () => {
    if (isSyncing) return;
    setIsSyncModalOpen(false);
    // Reset sync states on close so next open is clean
    setTimeout(() => {
      setSyncError(null);
      setSyncSuccess(false);
    }, 200);
  };

  return (
    <Dialog open={isSyncModalOpen} onOpenChange={(open) => {
      if (!open && isSyncing) return;
      if (!open) handleClose();
    }}>
      <DialogContent className="max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-stone-900 dark:text-white text-lg font-bold">
            <RefreshCw className={`w-5 h-5 text-[#8c1515] dark:text-[#ef4444] ${isSyncing ? 'animate-spin' : ''}`} />
            SIMS Portal Synchronizer
          </DialogTitle>
          <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            Verify and fetch real-time academic records, class routines, exams, and billing statements directly from the university's portal.
          </DialogDescription>
        </DialogHeader>

        {syncSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-extrabold text-stone-900 dark:text-white text-base">Portal Sync Completed!</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
              All courses, transcripts, and financial ledgers have been successfully synchronized.
            </p>
            <div className="mt-6 w-full">
              <Button type="button" onClick={handleClose} className="w-full bg-[#8c1515] hover:bg-[#731010] text-white font-bold py-2 rounded-xl">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const passwordInput = form.elements.namedItem('syncPassword') as HTMLInputElement;
            if (passwordInput && passwordInput.value) {
              await handleManualSync(passwordInput.value);
              passwordInput.value = '';
            }
          }} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Student ID</label>
              <input 
                type="text" 
                disabled 
                value={student.id} 
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950/50 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 rounded-xl cursor-not-allowed font-mono text-sm shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">SIMS Portal Password</label>
              <input 
                type="password" 
                name="syncPassword"
                required
                placeholder="Enter your SIMS password" 
                className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] text-sm"
              />
            </div>

            {syncError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-800 dark:text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">Sync Error</p>
                  <p className="mt-0.5 text-stone-600 dark:text-stone-300">{syncError}</p>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSyncing} className="border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-xl font-semibold">
                Cancel
              </Button>
              <Button type="submit" disabled={isSyncing} className="bg-[#8c1515] hover:bg-[#731010] text-white font-bold rounded-xl shadow-md transition-all">
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Syncing...
                  </>
                ) : (
                  'Synchronize'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
