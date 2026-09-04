import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { getStudentData, TRANSACTIONS_DATA } from '../data';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Wallet, AlertCircle, Download, CreditCard, ArrowRight, CheckCircle2, Loader2, X, Lock, Printer } from 'lucide-react';
import { PrintableStatement } from '../components/print/PrintableStatement';
import { PaymentPortal } from '../components/PaymentPortal';
import { exportStatementToPdf } from '../utils/statementPdf';

export const StatementView: React.FC<{ portal?: ReturnType<typeof usePortalLogic> }> = ({ portal }) => {
  const { isDarkMode, currentStudentId } = useAppStore();

  const student = portal ? portal.student : getStudentData(currentStudentId).profile;
  const transactions = portal ? portal.studentData.transactions : TRANSACTIONS_DATA;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [extraPaidOnline, setExtraPaidOnline] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    setExtraPaidOnline(0);
  }, [student.id]);

  const portalSummary = portal?.studentData?.statementSummary;
  const portalInstalments = portal?.studentData?.instalments;

  const totalDebit = useMemo(() => {
    if (portalSummary) return portalSummary.toBePaidCurrentSemester;
    const rawDebit = transactions.reduce((acc, t) => acc + Math.abs(t.debit || 0), 0);
    const waiverCredit = transactions
       .filter(t => t.description.toLowerCase().includes('waiver'))
       .reduce((acc, t) => acc + Math.abs(t.credit || 0), 0);
    return rawDebit - waiverCredit;
  }, [transactions, portalSummary]);

  const totalCredit = useMemo(() => {
    if (portalSummary) return portalSummary.totalCashPaid + extraPaidOnline;
    const directCredit = transactions
       .filter(t => !t.description.toLowerCase().includes('waiver'))
       .reduce((acc, t) => acc + Math.abs(t.credit || 0), 0);
    return directCredit + extraPaidOnline;
  }, [transactions, extraPaidOnline, portalSummary]);

  const currentBalance = useMemo(() => {
    if (portalSummary) return portalSummary.totalDues;
    if (transactions.length > 0) {
      return transactions[transactions.length - 1].balance;
    }
    return student.accountBalance || 0;
  }, [transactions, student.accountBalance, portalSummary]);

  const currentDues = useMemo(() => {
    return Math.max(0, currentBalance - extraPaidOnline);
  }, [currentBalance, extraPaidOnline]);

  const statementChartData = useMemo(() => {
    return transactions.map((t, idx) => ({
      name: t.date,
      balance: t.balance,
      index: idx
    })).reverse();
  }, [transactions]);

  const handlePayOnline = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = (amount: number) => {
    setExtraPaidOnline(prev => prev + amount);
    setIsPaymentModalOpen(false);
  };

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      exportStatementToPdf({
        student,
        totalDebit,
        totalCredit,
        currentDues,
        transactions,
      });
    } catch (err) {
      console.error('Failed to export statement PDF:', err);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 500);
    }
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                aria-label="Download Formatted PDF"
                className="flex items-center gap-2 bg-[#8c1515] hover:bg-[#731010] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print Statement"
                className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors border border-stone-200 dark:border-stone-700"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Print</span>
              </button>
            </div>
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
                        <CreditCard className="w-3.5 h-3.5" /> Pay Now
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

      <Card className="overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-stone-100 dark:divide-stone-800">
          {transactions.map((t, i) => (
              <div key={i} className="p-4 flex flex-col gap-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                 <div className="flex flex-col gap-1.5">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">{t.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {t.code && <Badge variant="outline" className="font-mono text-[10px] bg-stone-50 dark:bg-stone-900">{t.code}</Badge>}
                      <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">{t.date}</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 dark:border-stone-800 pt-3 mt-1">
                    <div>
                       <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Fee</div>
                       <div className="font-mono font-medium text-stone-700 dark:text-stone-300">{t.debit ? t.debit.toLocaleString() : '0'}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Paid</div>
                       <div className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{t.credit ? t.credit.toLocaleString() : '0'}</div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center bg-stone-50/50 dark:bg-stone-800/20 px-3 py-2.5 rounded-lg mt-1 border border-stone-100 dark:border-stone-800/50">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Balance</span>
                    <span className="font-mono font-black text-stone-900 dark:text-stone-100">{t.balance.toLocaleString()}</span>
                 </div>
              </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between items-center py-4 px-6 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase rounded-sm border-none px-1.5">
                    {t.code || (t.debit ? 'CHARGE' : 'RECEIPT')}
                  </Badge>
                  <span className="text-xs text-stone-500 font-medium">{t.date}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100">{t.description}</span>
              </div>
              
              <div className="flex items-center gap-8 text-right min-w-[280px] justify-end">
                <div className="flex flex-col items-end w-20">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fee</span>
                  <span className="font-mono font-medium text-stone-700 dark:text-stone-300">
                    {t.debit ? t.debit.toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex flex-col items-end w-20">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Paid</span>
                  <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {t.credit ? t.credit.toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex flex-col items-end w-24">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Balance</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {t.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Authentic Statement Summary Footer */}
        {transactions.length > 0 && (
          <div className="bg-stone-50/70 dark:bg-stone-950/40 p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
               Grand Summary
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 text-sm sm:min-w-[280px]">
               <div className="sm:text-right">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Total Billed</div>
                  <div className="font-mono font-bold text-stone-800 dark:text-stone-200">৳{totalDebit.toLocaleString()}</div>
               </div>
               <div className="text-right sm:border-l sm:border-stone-200 sm:dark:border-stone-700 sm:pl-6">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Total Paid</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">৳{totalCredit.toLocaleString()}</div>
               </div>
               <div className="text-right border-l border-stone-200 dark:border-stone-700 pl-6">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Final Dues</div>
                  <div className="font-mono font-black text-rose-600 dark:text-rose-400">৳{currentBalance.toLocaleString()}</div>
               </div>
            </div>
          </div>
        )}
      </Card>

      {/* Authentic Statement Summary & Instalment Cards */}
      {(portalSummary || portalInstalments) && (
        <>
          <div className="grid grid-cols-1 gap-6 mt-6 sm:hidden">
          {portalSummary && (
            <Card className="p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
              <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center justify-between">
                <span>Statement Summary (Summer-26)</span>
                <Badge variant="secondary" className="font-sans text-[10px] uppercase font-black bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">Official Portal</Badge>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                  <span>Last Semester Balance (A)</span>
                  <span className="font-mono font-bold text-stone-950 dark:text-white">৳{portalSummary.lastSemesterBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                  <span>Total Tuition and Other Fees</span>
                  <span className="font-mono font-bold text-stone-950 dark:text-white">৳{portalSummary.totalTuitionAndFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                  <span>Total Semester Waiver</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-৳{portalSummary.totalSemesterWaiver.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                  <span>Total Other Adjustment</span>
                  <span className="font-mono font-bold text-stone-500">-৳{portalSummary.totalOtherAdjustment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-bold border-t border-stone-100 dark:border-stone-800 pt-2 text-stone-800 dark:text-stone-200">
                  <span>To be Paid in Current Semester</span>
                  <span className="font-mono font-extrabold text-stone-950 dark:text-white">৳{portalSummary.toBePaidCurrentSemester.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400 pl-3 border-l-2 border-stone-200 dark:border-stone-700">
                  <span>Semester Fee (B)</span>
                  <span className="font-mono">৳{portalSummary.semesterFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400 pl-3 border-l-2 border-stone-200 dark:border-stone-700">
                  <span>Total Course Fees (C)</span>
                  <span className="font-mono">৳{portalSummary.totalCourseFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400 pl-3 border-l-2 border-stone-200 dark:border-stone-700">
                  <span>Others Fee (D)</span>
                  <span className="font-mono">৳{portalSummary.othersFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-bold border-t border-stone-100 dark:border-stone-800 pt-2 text-stone-800 dark:text-stone-200">
                  <span>Total Fees To be Paid</span>
                  <span className="font-mono font-extrabold text-stone-950 dark:text-white">৳{portalSummary.totalFeesToBePaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                  <span>Total Cash Paid (Summer-26)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">৳{portalSummary.totalCashPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-black border-t border-stone-200 dark:border-stone-700 pt-2.5 text-stone-900 dark:text-white text-sm">
                  <span>Total Dues</span>
                  <span className={`font-mono font-black ${portalSummary.totalDues > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    ৳{portalSummary.totalDues.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {portalInstalments && portalInstalments.length > 0 && (
            <Card className="p-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm mb-4 border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center justify-between">
                  <span>Instalment Payment Information</span>
                  <Badge variant="outline" className="font-sans text-[10px] uppercase font-bold border-rose-200 text-[#8c1515] bg-rose-50/30 dark:border-stone-700 dark:text-rose-400">Deadlines</Badge>
                </h3>
                <div className="space-y-4">
                  {portalInstalments.map((inst, index) => (
                    <div key={index} className="p-3.5 rounded-xl bg-stone-50/70 dark:bg-stone-950/20 border border-stone-100 dark:border-stone-800/60 flex flex-col gap-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-black text-stone-800 dark:text-stone-200">{inst.no}</div>
                          <div className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-0.5">{inst.deadline}</div>
                        </div>
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${
                          inst.dues > 0 
                            ? "border-rose-100 text-rose-700 bg-rose-50/20" 
                            : inst.dues < 0 
                              ? "border-emerald-100 text-emerald-700 bg-emerald-50/20"
                              : "border-stone-200 text-stone-500"
                        }`}>
                          {inst.dues > 0 ? "Due" : inst.dues < 0 ? "Overpaid" : "Completed"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center border-t border-stone-100 dark:border-stone-800/40 pt-2 text-[11px]">
                        <div>
                          <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Amount</div>
                          <div className="font-mono font-bold text-stone-700 dark:text-stone-300">৳{inst.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Cash Paid</div>
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{inst.cashPaid > 0 ? `৳${inst.cashPaid.toLocaleString()}` : "—"}</div>
                        </div>
                        <div>
                          <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Dues</div>
                          <div className={`font-mono font-black ${inst.dues > 0 ? "text-rose-600 dark:text-rose-400" : inst.dues < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-stone-500"}`}>
                            {inst.dues !== 0 ? `৳${inst.dues.toLocaleString()}` : "৳0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-stone-400 dark:text-stone-500 mt-4 leading-relaxed bg-stone-50/50 dark:bg-stone-950/10 p-3 rounded-lg border border-stone-100 dark:border-stone-800/40">
                <strong>Attention:</strong> The calculation of installment amounts is based on values in the Statement Summary. For any queries, please communicate with the Presidency University Accounts Office.
              </div>
            </Card>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex flex-col items-center max-w-4xl mx-auto w-full gap-8 mt-12 pb-12">
          {portalSummary && (
            <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
               <div className="bg-stone-50 dark:bg-stone-950/50 px-6 py-4 font-bold text-sm text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 text-center">
                 Statement Summary (Summer-26)
               </div>
               <div className="flex justify-center p-6">
                 <table className="w-full max-w-lg text-sm">
                   <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Last Semester Balance (A)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100 w-1/3">{portalSummary.lastSemesterBalance.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Tuition and other Fees</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalTuitionAndFees.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Semester Waiver</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalSemesterWaiver.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Other Adjustment (including Waiver)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalOtherAdjustment.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">To Be Paid in Current Semester</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.toBePaidCurrentSemester.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Semester Fee (B)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.semesterFee.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Tuition/Course Fees (C)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalCourseFees.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Others Fee in Current Semester (D)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.othersFee.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Fees To Be Paid (including Last Semester Balance)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalFeesToBePaid.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-2.5 text-right pr-12 text-stone-600 dark:text-stone-400">Total Cash Paid (Summer-26)</td><td className="py-2.5 text-right font-mono font-medium text-stone-900 dark:text-stone-100">{portalSummary.totalCashPaid.toLocaleString()} Taka</td></tr>
                      <tr><td className="py-4 text-right pr-12 font-bold text-stone-900 dark:text-stone-100 text-base">Total Dues</td><td className="py-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400 text-base">{portalSummary.totalDues.toLocaleString()} Taka</td></tr>
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {portalInstalments && portalInstalments.length > 0 && (
            <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
               <div className="bg-stone-50 dark:bg-stone-950/50 px-6 py-4 font-bold text-sm text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 text-center">
                 Installment Payment
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-center">
                   <thead className="bg-stone-50/50 dark:bg-stone-950/30 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs">
                     <tr>
                       <th className="py-4 px-4 font-medium">No of Installment</th>
                       <th className="py-4 px-4 font-medium">Installment Deadline</th>
                       <th className="py-4 px-4 font-medium">Installment Amount</th>
                       <th className="py-3 px-4 font-medium">
                         <div className="flex flex-col leading-tight">
                           <span>Total Cash Paid</span>
                           <span className="text-[10px] text-stone-400 dark:text-stone-500 font-normal mt-0.5">(Within the<br/>Installment<br/>Deadline)</span>
                         </div>
                       </th>
                       <th className="py-4 px-4 font-medium">Installment Dues</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50 text-stone-900 dark:text-stone-100">
                     {portalInstalments.map((inst, idx) => (
                       <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                         <td className="py-4 px-4">{inst.no}</td>
                         <td className="py-4 px-4">{inst.deadline}</td>
                         <td className="py-4 px-4 font-mono font-medium">{inst.amount.toLocaleString()} Taka</td>
                         <td className="py-4 px-4 font-mono font-medium">{inst.cashPaid.toLocaleString()} Taka</td>
                         <td className="py-4 px-4 font-mono font-medium">{inst.dues.toLocaleString()} Taka</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* Attention Box */}
          <div className="w-full bg-stone-50/50 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 rounded-xl p-5 mt-2">
             <div className="inline-block text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50 px-2.5 py-1 rounded mb-3 border border-rose-200 dark:border-rose-900/50">
               Attention!
             </div>
             <ol className="list-decimal list-inside text-sm text-stone-600 dark:text-stone-400 space-y-1.5 ml-1">
               <li>The calculation of Installment Amount is based on the value in Statement Summary.</li>
               <li>If you have any queries, please feel free to communicate with the Accounts Office.</li>
             </ol>
          </div>
        </div>
        </>
      )}
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
