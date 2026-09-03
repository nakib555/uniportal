import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { getStudentData, TRANSACTIONS_DATA } from '../data';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Wallet, AlertCircle, Download, CreditCard, ArrowRight, CheckCircle2, Loader2, X, Lock } from 'lucide-react';
import { PrintableStatement } from '../components/print/PrintableStatement';
import { PaymentPortal } from '../components/PaymentPortal';

export const StatementView: React.FC<{ portal?: ReturnType<typeof usePortalLogic> }> = ({ portal }) => {
  const { isDarkMode, currentStudentId } = useAppStore();

  const student = portal ? portal.student : getStudentData(currentStudentId).profile;
  const transactions = portal ? portal.studentData.transactions : TRANSACTIONS_DATA;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const statementSummary = useMemo(() => {
    const lastSemesterBalance = 0;
    const totalTuitionAndOtherFees = transactions.reduce((acc, t) => acc + Math.abs(t.credit || 0), 0);
    const totalSemesterWaiver = transactions.filter(t => t.code.startsWith('WAV')).reduce((acc, t) => acc + Math.abs(t.debit || 0), 0);
    const totalOtherAdjustment = totalSemesterWaiver;
    const toBePaidInCurrentSemester = totalTuitionAndOtherFees - totalSemesterWaiver;
    const semesterFee = transactions.filter(t => t.code === 'FEE400' || t.description.toLowerCase().includes('semester fee')).reduce((acc, t) => acc + t.credit, 0);
    const grossCourseFees = transactions.filter(t => !t.code.startsWith('FEE') && !t.code.startsWith('WAV') && !t.code.startsWith('PAY')).reduce((acc, t) => acc + t.credit, 0);
    const totalTuitionCourseFees = Math.max(0, grossCourseFees - totalSemesterWaiver);
    const othersFee = transactions.filter(t => t.code.startsWith('FEE') && t.code !== 'FEE400' && !t.description.toLowerCase().includes('semester fee')).reduce((acc, t) => acc + t.credit, 0);
    const totalFeesToPay = toBePaidInCurrentSemester + lastSemesterBalance;

    const chartData = transactions.map((t, idx) => ({
      name: t.date,
      balance: t.balance,
      index: idx
    })).reverse();

    return {
      lastSemesterBalance,
      totalTuitionAndOtherFees,
      totalSemesterWaiver,
      totalOtherAdjustment,
      toBePaidInCurrentSemester,
      semesterFee,
      totalTuitionCourseFees,
      othersFee,
      totalFeesToPay,
      chartData
    };
  }, [transactions]);

  const [extraPaidOnline, setExtraPaidOnline] = useState(0);

  useEffect(() => {
    setExtraPaidOnline(0);
  }, [student.id]);

  const effectiveCashPaid = useMemo(() => {
    const scrapedCashPaid = transactions.filter(t => t.code.startsWith('PAY')).reduce((acc, t) => acc + t.debit, 0);
    return scrapedCashPaid + extraPaidOnline;
  }, [transactions, extraPaidOnline]);

  const effectiveDues = Math.max(0, statementSummary.totalFeesToPay - effectiveCashPaid);

  const firstInstalmentAmount = Math.round(statementSummary.lastSemesterBalance + statementSummary.semesterFee + (statementSummary.totalTuitionCourseFees * 0.5) + statementSummary.othersFee);
  const secondInstalmentAmount = Math.round(statementSummary.totalTuitionCourseFees * 0.3);
  const thirdInstalmentAmount = Math.round(statementSummary.totalTuitionCourseFees * 0.2);

  const firstInstalmentDues = firstInstalmentAmount - effectiveCashPaid;
  const secondInstalmentDues = secondInstalmentAmount + Math.min(0, firstInstalmentDues);
  const thirdInstalmentDues = thirdInstalmentAmount + Math.min(0, secondInstalmentDues);

  const totalDebit = statementSummary.totalTuitionAndOtherFees;
  const totalCredit = effectiveCashPaid;
  const statementChartData = statementSummary.chartData;
  const currentDues = effectiveDues;

  const handlePayOnline = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = (amount) => {
    setExtraPaidOnline(prev => prev + amount);
    setIsPaymentModalOpen(false);
  };

  return (
    <>
      <PrintableStatement student={student} totalDebit={totalDebit} totalCredit={totalCredit} currentDues={currentDues} transactions={transactions} />
      <div className="space-y-6 max-w-5xl print-hide">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Statement of Account</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Overall financial summary and transaction history.</p>
          </div>
          {transactions.length > 0 && (
            <button onClick={() => window.print()} className="flex w-fit items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
               <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
        </header>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl flex items-center justify-center mb-6 text-stone-400 dark:text-stone-500">
            <Wallet className="w-8 h-8 text-[#8c1515] dark:text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-black text-stone-900 dark:text-white mb-2">No Statement Found</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm leading-relaxed mb-6">
            We couldn't retrieve any billing statements, payments, or outstanding ledgers for this account. Please trigger a real-time portal synchronization to fetch your academic statement.
          </p>
          {portal && (
            <button 
              onClick={() => portal.setIsSyncModalOpen(true)}
              className="flex items-center gap-2 bg-[#8c1515] hover:bg-[#731010] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm"
            >
              Sync with Portal Now
            </button>
          )}
        </div>
      ) : (
        <>
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
                     {currentDues > 0 ? `${currentDues.toLocaleString()}` : Math.abs(currentDues).toLocaleString()} <span className="text-sm font-bold opacity-80">Tk</span>
                  </div>
                  {currentDues > 0 ? (
                     <button onClick={handlePayOnline} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#8c1515] dark:bg-stone-900 dark:text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                        <CreditCard className="w-3.5 h-3.5" /> Pay via ekpay
                     </button>
                  ) : currentDues < 0 ? (
                     <p className="text-xs font-bold text-red-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Overpaid - Can be refunded
                     </p>
                  ) : (
                     <p className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Paid in full
                     </p>
                  )}
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
         <div className="h-48 w-full min-w-0 min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={0} initialDimension={{ width: 320, height: 180 }}>
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
           {transactions.map((t, i) => (
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

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl">
          <Card className="overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
            <div style={{ marginTop: '-16px' }} className="bg-stone-100 dark:bg-stone-900/50 py-2 text-center border-b border-stone-200 dark:border-stone-800">
              <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">Statement Summary (Summer-26)</h4>
            </div>
            <table className="w-full text-right text-sm">
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Last Semester Balance (A)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100 w-32">{statementSummary.lastSemesterBalance.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Tuition and Other fees</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.totalTuitionAndOtherFees.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Semester Waiver</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.totalSemesterWaiver.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Other Adjustment (Including Waiver)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.totalOtherAdjustment.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">To be Paid in Current Semester</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.toBePaidInCurrentSemester.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Semester Fee (B)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.semesterFee.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Tuition(Course) Fees (C)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.totalTuitionCourseFees.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Others Fee in Current Semester (D)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">{statementSummary.othersFee.toLocaleString()} Taka</td>
                </tr>
                <tr className="bg-stone-50/50 dark:bg-stone-800/30">
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Fees To Be Paid (Including Last Semester Balance)</td>
                  <td className="py-1.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">{statementSummary.totalFeesToPay.toLocaleString()} Taka</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-4 text-stone-600 dark:text-stone-400">Total Cash Paid (Summer-26)</td>
                  <td className="py-1.5 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">{effectiveCashPaid.toLocaleString()} Taka</td>
                </tr>
                <tr className="bg-stone-100 dark:bg-stone-800 font-bold border-t-2 border-stone-200 dark:border-stone-700">
                  <td style={{ marginTop: '0px', marginBottom: '0px' }} className="py-2 px-4 text-stone-900 dark:text-stone-100">Total Dues</td>
                  <td style={{ marginBottom: '0px', paddingBottom: '8px' }} className="py-2 px-4 font-mono text-[#8c1515] dark:text-[#ef4444]">{effectiveDues > 0 ? effectiveDues.toLocaleString() : "0"} Taka</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card className="overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
           <div style={{ paddingTop: '8px', marginLeft: '0px', marginBottom: '-17px', marginTop: '-17px' }} className="bg-stone-100 dark:bg-stone-900/50 py-2 text-center border-b border-stone-200 dark:border-stone-800">
              <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">Installment Payment</h4>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-center text-sm whitespace-nowrap">
               <thead className="bg-[#f8f7f5] dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-semibold">
                  <tr>
                     <th className="py-3 px-4 text-left">No of Instalment</th>
                     <th className="py-3 px-4">Instalment Deadline</th>
                     <th className="py-3 px-4">Instalment Amount</th>
                     <th className="py-3 px-4">Total Cash Paid<br/><span className="text-[10px] font-normal">(Within the<br/>Instalment<br/>Deadline)</span></th>
                     <th className="py-3 px-4">Instalment Dues</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  <tr>
                     <td className="py-3 px-4 text-left font-medium text-stone-800 dark:text-stone-300">1st Instalment: A+B+c*(50%)+D(See Statement Summary)</td>
                     <td className="py-3 px-4 text-stone-600 dark:text-stone-400">Academic Calendar</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{firstInstalmentAmount.toLocaleString()} Taka</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{effectiveCashPaid.toLocaleString()} Taka</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{firstInstalmentDues.toLocaleString()} Taka</td>
                  </tr>
                  <tr>
                     <td className="py-3 px-4 text-left font-medium text-stone-800 dark:text-stone-300">2nd Instalment: c *(30%)</td>
                     <td className="py-3 px-4 text-stone-600 dark:text-stone-400">Academic Calendar</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{secondInstalmentAmount.toLocaleString()} Taka</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300"></td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{secondInstalmentDues.toLocaleString()} Taka</td>
                  </tr>
                  <tr>
                     <td className="py-3 px-4 text-left font-medium text-stone-800 dark:text-stone-300">3rd Instalment: c *(20%)</td>
                     <td className="py-3 px-4 text-stone-600 dark:text-stone-400">Academic Calendar</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{thirdInstalmentAmount.toLocaleString()} Taka</td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300"></td>
                     <td className="py-3 px-4 font-mono text-stone-800 dark:text-stone-300">{thirdInstalmentDues.toLocaleString()} Taka</td>
                  </tr>
               </tbody>
             </table>
           </div>
        </Card>
      </div>

      <div className="mt-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl text-sm font-semibold text-[#8c1515] dark:text-[#ef4444]">
         <h4 className="underline mb-2 font-bold">Attention!</h4>
         <ol className="list-decimal pl-5 space-y-1 text-stone-800 dark:text-stone-300 font-medium">
            <li>The calculation of Instalment Amount is based on the value in Statement Summary.</li>
            <li>If you have any queries, please feel free to communicate with the Accounts Office.</li>
         </ol>
      </div>
      </>
      )}

      <PaymentPortal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        outstandingBalance={currentDues} 
        onPaymentSuccess={handlePaymentSuccess} 
      />
      </div>
    </>
  );
};
