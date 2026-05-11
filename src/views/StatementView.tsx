import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { STUDENT_DATA, TRANSACTIONS_DATA } from '../data';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Wallet, AlertCircle, Download, CreditCard, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';

export const StatementView: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const student = STUDENT_DATA;
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amountToPay, setAmountToPay] = useState(Math.abs(student.accountBalance).toString());
  const [paymentStep, setPaymentStep] = useState<'amount' | 'processing' | 'success'>('amount');

  const handlePayOnline = () => {
    setPaymentStep('amount');
    setIsPaymentModalOpen(true);
  };

  const processPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
      }, 3000);
    }, 2000);
  };

  const { totalDebit, totalCredit, statementChartData } = useMemo(() => {
    const debit = TRANSACTIONS_DATA.reduce((acc, t) => acc + Math.abs(t.debit || 0), 0);
    const credit = TRANSACTIONS_DATA.reduce((acc, t) => acc + Math.abs(t.credit || 0), 0);
    const chartData = TRANSACTIONS_DATA.map((t, idx) => ({
      name: t.date,
      balance: t.balance,
      index: idx
    })).reverse();
    return { totalDebit: debit, totalCredit: credit, statementChartData: chartData };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Statement of Account</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Overall financial summary and transaction history.</p>
        </div>
        <button onClick={() => window.print()} className="flex w-fit items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
           <Download className="w-4 h-4" /> Download PDF
        </button>
      </header>

      {/* Beautiful Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-5 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
               <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">Total Billed</p>
               <div className="text-2xl font-black text-stone-900 dark:text-white">{totalDebit.toLocaleString()} <span className="text-sm font-bold opacity-60">Tk</span></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
               <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
         </Card>
         <Card className="p-5 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
               <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">Total Paid</p>
               <div className="text-2xl font-black text-stone-900 dark:text-white">{totalCredit.toLocaleString()} <span className="text-sm font-bold opacity-60">Tk</span></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
               <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
         </Card>
         <div className="rounded-2xl p-5 shadow-lg border border-[#6b0f0f] dark:border-stone-700 bg-[#8c1515] dark:bg-stone-800 flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.1] group-hover:scale-110 transition-transform">
               <Wallet className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex items-start justify-between w-full h-full">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#ffcfcf] dark:text-stone-400 mb-1">Current Dues</p>
                  <div className="text-2xl font-black mb-3">
                     {student.accountBalance > 0 ? `-${student.accountBalance.toLocaleString()}` : Math.abs(student.accountBalance).toLocaleString()} <span className="text-sm font-bold opacity-80">Tk</span>
                  </div>
                  {student.accountBalance < 0 ? (
                     <button onClick={handlePayOnline} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#8c1515] dark:bg-stone-900 dark:text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                        <CreditCard className="w-3.5 h-3.5" /> Pay via ekpay
                     </button>
                  ) : student.accountBalance > 0 ? (
                     <p className="text-xs font-bold text-red-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Overpaid - Can be refunded
                     </p>
                  ) : null}
               </div>
            </div>
         </div>
      </div>

      {/* Balance History Chart */}
      <Card className="p-6 overflow-hidden bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
         <h3 className="font-extrabold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-stone-400" />
            Balance History
         </h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={0}>
              <AreaChart data={statementChartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDarkMode ? '#ef4444' : '#8c1515'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isDarkMode ? '#ef4444' : '#8c1515'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} stroke="#888" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#1c1917' : '#fff', color: isDarkMode ? '#fff' : '#000', borderRadius: '12px', border: isDarkMode ? '1px solid #292524' : '1px solid #f5f5f4', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                  formatter={(value: number) => [`${value} Tk`, 'Balance']}
                />
                <Area type="step" dataKey="balance" stroke={isDarkMode ? '#ef4444' : '#8c1515'} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
           {TRANSACTIONS_DATA.map((t, i) => (
              <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                 <div className="flex-1">
                    <div className="flex justify-between sm:justify-start sm:items-center gap-3 mb-2">
                       <Badge variant="outline" className="font-mono text-[10px] bg-stone-50 dark:bg-stone-950">{t.code}</Badge>
                       <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">{t.date}</span>
                    </div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">{t.description}</h4>
                 </div>
                 <div className="flex items-center justify-between sm:justify-end gap-6 text-sm sm:min-w-[280px]">
                    <div className="sm:text-right">
                       <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest sm:mb-0.5">Fee</div>
                       <div className="font-mono font-medium text-stone-700 dark:text-stone-300">{t.debit ? t.debit.toLocaleString() : '0'}</div>
                    </div>
                    <div className="text-right sm:border-l sm:border-stone-200 sm:dark:border-stone-700 sm:pl-6">
                       <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest sm:mb-0.5">Paid</div>
                       <div className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{t.credit ? t.credit.toLocaleString() : '0'}</div>
                    </div>
                    <div className="hidden sm:block text-right border-l border-stone-200 dark:border-stone-700 pl-6">
                       <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Balance</div>
                       <div className="font-mono font-black text-stone-900 dark:text-stone-100">{t.balance.toLocaleString()}</div>
                    </div>
                 </div>
                 <div className="sm:hidden flex justify-between items-center bg-stone-50/50 dark:bg-stone-800/20 px-3 py-2 rounded-lg mt-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Balance</span>
                    <span className="font-mono font-black text-stone-900 dark:text-stone-100 text-sm">{t.balance.toLocaleString()}</span>
                 </div>
              </div>
           ))}
        </div>
      </Card>

      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm print:hidden">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-[#8c1515] flex items-center justify-center">
                     <CreditCard className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-bold text-lg text-stone-900 dark:text-white leading-none">Online Payment (ekpay)</h3>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {paymentStep === 'amount' && (
                 <div className="p-6 overflow-y-auto">
                   <div className="mb-6">
                     <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Amount to Pay</label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">৳</span>
                       <input 
                         type="number" 
                         value={amountToPay} 
                         onChange={(e) => setAmountToPay(e.target.value)}
                         className="w-full pl-8 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-[#8c1515] focus:border-transparent outline-none transition-all font-bold text-lg" 
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-3 mb-8">
                     <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10 cursor-pointer text-emerald-900 dark:text-emerald-100">
                       <div className="w-5 h-5 rounded-full border-[6px] border-emerald-500 bg-white" />
                       <div className="font-bold text-sm">Pay via ekpay gateway</div>
                       <img src="https://wsrv.nl/?url=https://ekpay.gov.bd/images/ekpay-logo.png&output=webp" alt="ekpay" className="h-6 ml-auto object-contain" />
                     </div>
                   </div>

                   <button 
                     onClick={processPayment}
                     disabled={!amountToPay || parseFloat(amountToPay) <= 0}
                     className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] text-white font-bold transition-colors shadow-md disabled:opacity-50"
                   >
                     Proceed to Checkout <ArrowRight className="w-4 h-4" />
                   </button>
                 </div>
              )}

              {paymentStep === 'processing' && (
                 <div className="p-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-12 h-12 text-[#8c1515] animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Connecting to ekpay...</h3>
                    <p className="text-stone-500 dark:text-stone-400 max-w-[250px]">Please complete the payment in the secure gateway window.</p>
                 </div>
              )}

              {paymentStep === 'success' && (
                 <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                       <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">Payment Successful</h3>
                    <p className="text-stone-500 dark:text-stone-400 mb-6">Your payment of <strong>৳{amountToPay}</strong> has been received and processed.</p>
                    <button 
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl font-bold transition-colors"
                    >
                      Close
                    </button>
                 </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
