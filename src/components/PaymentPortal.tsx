import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X, ArrowRight, Loader2, CheckCircle2, Lock, Smartphone, Building2 } from 'lucide-react';

interface PaymentPortalProps {
  isOpen: boolean;
  onClose: () => void;
  outstandingBalance: number;
  onPaymentSuccess: (amount: number) => void;
}

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ isOpen, onClose, outstandingBalance, onPaymentSuccess }) => {
  const [step, setStep] = useState<'amount' | 'processing' | 'success'>('amount');
  const [amountToPay, setAmountToPay] = useState<string>(outstandingBalance > 0 ? outstandingBalance.toString() : '0');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mfs' | 'bank'>('card');

  useEffect(() => {
    if (isOpen) {
      setStep('amount');
      setAmountToPay(outstandingBalance > 0 ? outstandingBalance.toString() : '0');
      setSelectedMethod('card');
    }
  }, [isOpen, outstandingBalance]);

  const processPayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(parseFloat(amountToPay) || 0);
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-sm print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 shadow-inner flex items-center justify-center">
                   <Lock className="w-5 h-5 text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-stone-900 dark:text-white leading-none mb-1">Secure Checkout</h3>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">Payment Portal</p>
                 </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

             {step === 'amount' && (
               <div className="p-6 overflow-y-auto">
                 <div className="mb-6">
                   <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Amount to Pay (Expected)</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">$</span>
                     <input 
                       type="number" 
                       value={amountToPay} 
                       onChange={(e) => setAmountToPay(e.target.value)}
                       className="w-full pl-8 pr-4 py-4 border-2 border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 shadow-sm rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 outline-none transition-all font-mono font-bold text-xl text-stone-900 dark:text-white" 
                     />
                   </div>
                 </div>
                 
                 <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-3">Select Payment Method</label>
                 <div className="space-y-3 mb-8">
                   
                   {/* Card Method */}
                   <div 
                      onClick={() => setSelectedMethod('card')}
                      className={`flex flex-col gap-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                         selectedMethod === 'card' 
                           ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10' 
                           : 'border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900'
                      }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                           selectedMethod === 'card' ? 'border-indigo-600 dark:border-indigo-400' : 'border-stone-300 dark:border-stone-600'
                        }`}>
                           {selectedMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                        </div>
                        <CreditCard className={`w-5 h-5 ${selectedMethod === 'card' ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`} />
                        <div className={`font-bold text-sm ${selectedMethod === 'card' ? 'text-indigo-900 dark:text-indigo-100' : 'text-stone-700 dark:text-stone-300'}`}>Credit / Debit Card</div>
                        <div className="ml-auto flex gap-1">
                           <div className="w-8 h-5 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-red-500 -mr-1 mix-blend-multiply dark:mix-blend-screen opacity-80" />
                              <div className="w-2 h-2 rounded-full bg-orange-500 mix-blend-multiply dark:mix-blend-screen opacity-80" />
                           </div>
                        </div>
                     </div>
                   </div>

                   {/* MFS Method */}
                   <div 
                      onClick={() => setSelectedMethod('mfs')}
                      className={`flex flex-col gap-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                         selectedMethod === 'mfs' 
                           ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10' 
                           : 'border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900'
                      }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                           selectedMethod === 'mfs' ? 'border-indigo-600 dark:border-indigo-400' : 'border-stone-300 dark:border-stone-600'
                        }`}>
                           {selectedMethod === 'mfs' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                        </div>
                        <Smartphone className={`w-5 h-5 ${selectedMethod === 'mfs' ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`} />
                        <div className={`font-bold text-sm ${selectedMethod === 'mfs' ? 'text-indigo-900 dark:text-indigo-100' : 'text-stone-700 dark:text-stone-300'}`}>Mobile Financial Services</div>
                     </div>
                     {selectedMethod === 'mfs' && (
                        <div className="ml-14 mt-2 mb-1 flex items-center gap-3">
                           <div className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-pink-600 dark:text-pink-400 cursor-pointer hover:border-pink-500 transition-colors">bKash</div>
                           <div className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-orange-600 dark:text-orange-500 cursor-pointer hover:border-orange-500 transition-colors">Nagad</div>
                        </div>
                     )}
                   </div>

                   {/* Bank Method */}
                   <div 
                      onClick={() => setSelectedMethod('bank')}
                      className={`flex flex-col gap-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                         selectedMethod === 'bank' 
                           ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10' 
                           : 'border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900'
                      }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                           selectedMethod === 'bank' ? 'border-indigo-600 dark:border-indigo-400' : 'border-stone-300 dark:border-stone-600'
                        }`}>
                           {selectedMethod === 'bank' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                        </div>
                        <Building2 className={`w-5 h-5 ${selectedMethod === 'bank' ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`} />
                        <div className={`font-bold text-sm ${selectedMethod === 'bank' ? 'text-indigo-900 dark:text-indigo-100' : 'text-stone-700 dark:text-stone-300'}`}>Internet Banking</div>
                     </div>
                   </div>
                 </div>

                 <button 
                   onClick={processPayment}
                   disabled={!amountToPay || parseFloat(amountToPay) <= 0}
                   className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                 >
                   Proceed to Checkout <ArrowRight className="w-5 h-5" />
                 </button>
                 
               </div>
            )}

            {step === 'processing' && (
               <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                     <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 rounded-full" />
                     <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Processing Payment...</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">Please do not close this window or press back.</p>
               </div>
            )}

            {step === 'success' && (
               <div className="p-16 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mb-6 relative"
                  >
                     <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full" />
                     <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10" />
                  </motion.div>
                  <h3 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white mb-2">Payment Successful</h3>
                  <p className="text-stone-500 dark:text-stone-400 font-medium max-w-[250px]">Your transaction has been securely processed and recorded.</p>
               </div>
            )}
            
            <div className="px-6 py-4 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-100 dark:border-stone-800 text-center flex items-center justify-center gap-2 text-stone-400 dark:text-stone-500">
               <Lock className="w-3.5 h-3.5" />
               <span className="text-[10px] uppercase font-bold tracking-widest">Secured by 256-bit SSL Encryption</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
