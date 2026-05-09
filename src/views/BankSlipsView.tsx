import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store';
import { FEES_LIST } from '../data';
import { Wallet, CheckCircle2, X } from 'lucide-react';

export const BankSlipsView: React.FC = () => {
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const toggleFee = (code: string) => {
    setSelectedFees(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };
  const bankSlipTotal = useMemo(() => {
    return FEES_LIST.filter(f => selectedFees.includes(f.code)).reduce((acc, f) => acc + f.amount, 0);
  }, [selectedFees]);

  const [isBankSlipSuccess, setIsBankSlipSuccess] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
  const handleBankSlipSubmitClick = () => {
    if (selectedFees.length === 0) return;
    setIsConfirmPaymentOpen(true);
  };
  
  const handleConfirmPayment = () => {
    setIsConfirmPaymentOpen(false);
    setIsBankSlipSuccess(true);
    setTimeout(() => {
      setIsBankSlipSuccess(false);
      setSelectedFees([]);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Bank Slips</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Select fees for bank slips generation.</p>
      </header>

      <Card className="overflow-hidden">
        <div className="divide-y divide-stone-100/70 dark:divide-stone-800 bg-white dark:bg-stone-900">
          {FEES_LIST.map((fee, i) => (
            <div key={i} className="flex gap-4 p-4 items-center hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
               <input type="checkbox" checked={selectedFees.includes(fee.code)} onChange={() => toggleFee(fee.code)} className="w-5 h-5 shrink-0 rounded border-stone-300 dark:border-stone-700 bg-transparent text-[#8c1515] dark:text-[#ef4444] focus:ring-[#8c1515] dark:focus:ring-[#ef4444]" />
               <div className="flex-1">
                  <div className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500 mb-0.5">{fee.code}</div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">{fee.description}</div>
               </div>
               <div className="font-mono text-sm text-stone-900 dark:text-stone-100 shrink-0 font-bold">{fee.amount.toFixed(2)}</div>
            </div>
          ))}
          <div className="p-4 sm:px-6 bg-stone-50/50 dark:bg-stone-900/50 flex justify-between items-center text-sm border-t border-stone-200 dark:border-stone-800">
             <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[11px]">Total Selected</span>
             <span className="font-mono font-black text-xl text-stone-900 dark:text-stone-100">{bankSlipTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="p-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 flex gap-3">
           <button disabled={selectedFees.length === 0} onClick={handleBankSlipSubmitClick} className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all ${selectedFees.length > 0 ? "bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] text-white" : "bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed"}`}>
              Pay Online
           </button>
           <button onClick={() => setSelectedFees([])} className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 px-6 py-2.5 rounded-lg text-sm font-bold transition-all">Reset</button>
           
           {isBankSlipSuccess && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ml-auto flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
               <CheckCircle2 className="w-4 h-4 mr-2" /> Payment simulation completed!
             </motion.div>
           )}
        </div>
      </Card>

      <AnimatePresence>
        {isConfirmPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center isolate p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsConfirmPaymentOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }} 
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-[#8c1515] dark:text-[#ef4444]" />
                  Confirm Payment
                </h3>
                <button onClick={() => setIsConfirmPaymentOpen(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                You are about to process an online payment for the selected bank slips. Please review the total amount.
              </p>

              <div className="bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl p-5 text-center mb-6 shadow-inner">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8c1515] dark:text-[#ef4444] mb-1 block">Total Amount</span>
                <div className="text-3xl font-black font-mono text-stone-900 dark:text-white">
                  {bankSlipTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-lg font-bold text-stone-400 ml-1">Tk</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsConfirmPaymentOpen(false)} className="flex-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 py-2.5 rounded-lg text-sm font-bold transition-all">
                  Cancel
                </button>
                <button onClick={handleConfirmPayment} className="flex-1 bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all shadow-[#8c1515]/20 dark:shadow-[#ef4444]/20">
                  Proceed to Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
