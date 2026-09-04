import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { ShieldCheck, LogIn } from 'lucide-react';

export function LogoutView() {
  const { setShowLogoutSplash } = useAppStore();

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Logged Out Successfully</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          Your session has been securely closed. For your security, please close your browser window if you are using a shared computer.
        </p>

        <button
          onClick={() => setShowLogoutSplash(false)}
          className="w-full flex items-center justify-center gap-2 bg-[#8c1515] hover:bg-[#7a1212] text-white py-3.5 px-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-md"
        >
          <LogIn className="w-5 h-5" />
          Sign In Again
        </button>
      </motion.div>
    </div>
  );
}
