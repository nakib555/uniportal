import React, { useState } from 'react';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { Button } from './ui/button';
import { KeyRound, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface SimsReauthModalProps {
  portal: ReturnType<typeof usePortalLogic>;
}

export const SimsReauthModal: React.FC<SimsReauthModalProps> = ({ portal }) => {
  const { 
    isSyncing, 
    syncError, 
    setSyncError, 
    setSyncSuccess, 
    isSyncModalOpen, 
    setIsSyncModalOpen, 
    handleSmartRefresh,
    activeModuleInfo,
    student
  } = portal;

  const [password, setPassword] = useState('');

  const handleClose = () => {
    if (isSyncing) return;
    setIsSyncModalOpen(false);
    setTimeout(() => {
      setSyncError(null);
      setSyncSuccess(false);
      setPassword('');
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    const success = await handleSmartRefresh(password.trim());
    if (success) {
      setPassword('');
      handleClose();
    }
  };

  const sectionName = activeModuleInfo?.displayName || 'Active Section';

  return (
    <Dialog open={isSyncModalOpen} onOpenChange={(open) => {
      if (!open && isSyncing) return;
      if (!open) handleClose();
    }}>
      <DialogContent className="max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-stone-900 dark:text-white text-lg font-bold">
            <KeyRound className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
            SIMS Authentication
          </DialogTitle>
          <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            Enter your SIMS password to refresh <strong className="text-stone-700 dark:text-stone-200 font-semibold">{sectionName}</strong> and maintain your active 30-minute session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
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
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your SIMS password" 
              className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] text-sm"
            />
          </div>

          {syncError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-800 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold">Authentication Error</p>
                <p className="mt-0.5 text-stone-600 dark:text-stone-300">{syncError}</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSyncing} className="border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-xl font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSyncing || !password.trim()} className="bg-[#8c1515] hover:bg-[#731010] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5">
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Refresh {sectionName}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const SyncPortalDialog = SimsReauthModal;
