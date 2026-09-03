import React, { useState } from 'react';
import { Download, Share2, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function PWAInstallButton({ className = '' }: { className?: string }) {
  const { canInstall, isIOS, isInstalled, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || !canInstall) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install UniPortal App"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#8c1515] hover:bg-[#731010] shadow-sm transition-all active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute right-3.5 top-3.5 p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src="/icon.svg" alt="UniPortal" className="w-11 h-11 rounded-xl shadow-xs" />
              <div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-white">Install UniPortal</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Add to your iPhone / iPad Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <div className="flex items-start gap-2.5 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#8c1515] text-white flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                <span>Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> <strong>Share</strong> icon in Safari's bottom toolbar.</span>
              </div>
              <div className="flex items-start gap-2.5 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#8c1515] text-white flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-[#8c1515] text-white flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner to launch as a standalone app!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
