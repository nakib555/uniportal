import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
import { FEES_LIST } from '../data';
import { CheckCircle2, Wallet, Printer, ShieldAlert, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BankSlipsView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const {
    student,
    selectedFees,
    setSelectedFees,
    toggleFee,
    bankSlipTotal,
    isBankSlipSuccess,
    setIsBankSlipSuccess,
    isConfirmPaymentOpen,
    setIsConfirmPaymentOpen,
    handleBankSlipSubmitClick,
    handleConfirmPayment
  } = portal;

  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'dbbl'>('bkash');
  const [cashAmount, setCashAmount] = useState<string>('0.00');
  const [cashDesc, setCashDescription] = useState<string>('Cash Payment');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Print Date formatting
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  const timeStr = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Selected fee details helper
  const selectedFeeDetails = FEES_LIST.filter(f => selectedFees.includes(f.code));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex justify-between items-center print:hidden border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Fees for Bank Slip</h2>
          <p className="text-sm text-stone-500 mt-1">Select payable fees to generate official bank deposit slips or proceed with online payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left Side: Fee Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-black text-stone-900 dark:text-white uppercase tracking-wider mb-4">Select Fees</h3>
            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 max-h-[500px] overflow-y-auto no-scrollbar" data-lenis-prevent>
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-bold text-stone-700 dark:text-stone-300">
                    <th className="px-4 py-3 text-center w-12">Select</th>
                    <th className="px-4 py-3 w-28">Code</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right w-32">Amount (TK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {FEES_LIST.map((fee) => {
                    const isSelected = selectedFees.includes(fee.code);
                    return (
                      <tr
                        key={fee.code}
                        onClick={() => toggleFee(fee.code)}
                        className={`cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors ${
                          isSelected ? 'bg-red-50/20 dark:bg-red-950/10' : ''
                        }`}
                      >
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFee(fee.code)}
                            className="w-4.5 h-4.5 rounded border-stone-300 dark:border-stone-700 bg-transparent text-[#8c1515] dark:text-red-600 focus:ring-[#8c1515]"
                          />
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-stone-900 dark:text-white">{fee.code}</td>
                        <td className="px-4 py-4 text-stone-800 dark:text-stone-200 font-medium">
                          {fee.code === 'PAY099' ? (
                            <div className="flex flex-col sm:flex-row gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                              <span className="shrink-0">{fee.description}:</span>
                              <input
                                type="text"
                                value={cashDesc}
                                onChange={(e) => setCashDescription(e.target.value)}
                                className="px-2 py-1 text-xs border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-950 w-full"
                              />
                            </div>
                          ) : fee.code === 'PAY000' ? (
                            <span className="text-stone-500 italic">Others Fee (Custom Entry)</span>
                          ) : (
                            fee.description
                          )}
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-bold text-stone-900 dark:text-white">
                          {fee.code === 'PAY099' ? (
                            <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end">
                              <input
                                type="text"
                                style={{ textAlign: 'right' }}
                                value={cashAmount}
                                onChange={(e) => {
                                  setCashAmount(e.target.value);
                                  const num = parseFloat(e.target.value) || 0;
                                  fee.amount = num;
                                }}
                                className="w-20 px-2 py-1 text-xs border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-950 font-mono font-bold text-right"
                              />
                            </div>
                          ) : (
                            fee.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Slip Summary & Generation */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-black text-stone-900 dark:text-white uppercase tracking-wider mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Student ID:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{student.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Program:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-right truncate max-w-[180px]">{student.program}</span>
                </div>
                <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 dark:text-white">Total Amount:</span>
                  <span className="text-2xl font-black text-[#8c1515] dark:text-red-500 font-mono">
                    TK {selectedFeeDetails.reduce((sum, f) => sum + (f.code === 'PAY099' ? parseFloat(cashAmount) || 0 : f.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {selectedFees.length === 0 ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-900/50 text-center">
                  Please select at least one fee to proceed.
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Trigger online payment flow
                      handleBankSlipSubmitClick();
                    }}
                    className="w-full bg-[#8c1515] hover:bg-[#a11a1a] dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" /> Pay Online (nagad/bkash)
                  </button>

                  <button
                    onClick={() => {
                      setShowPrintPreview(true);
                      setTimeout(() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold py-3 px-4 rounded-xl transition-all border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-5 h-5" /> Generate Printable Slip
                  </button>
                </div>
              )}
            </div>
          </Card>

          {isBankSlipSuccess && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Payment Simulation Succeeded! Dues are cleared.</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Printable Bank Slip Layout (Shown when requested or always visible for print media) */}
      <div className={`${showPrintPreview ? 'block' : 'hidden print:block'} mt-8`}>
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h3 className="text-lg font-bold text-stone-800 dark:text-white">Print Preview (Bank Slip Copy)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handlePrint()}
              className="bg-[#8c1515] hover:bg-[#a11a1a] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" /> Print Bank Slip
            </button>
            <button
              onClick={() => setShowPrintPreview(false)}
              className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-stone-200 dark:border-stone-700"
            >
              Close Preview
            </button>
          </div>
        </div>

        {/* Triple Column CakePHP replication layout */}
        <div className="bg-white dark:bg-white text-black p-6 rounded-2xl border border-stone-200 shadow-sm max-w-6xl mx-auto overflow-x-auto print:shadow-none print:border-none print:p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x divide-dashed divide-stone-400 min-w-[900px] print:grid-cols-3 print:divide-x print:divide-y-0">
            {/* Copy Generator */}
            {['Bank Copy', 'Office Copy', 'Student Copy'].map((copyTitle, colIdx) => (
              <div key={copyTitle} className={`p-4 space-y-4 ${colIdx > 0 ? 'md:pl-6 print:pl-6' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-300">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://wsrv.nl/?url=http://sims.presidency.edu.bd/img/layout/header_logo.png&output=webp"
                      alt="PU"
                      className="h-9 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-[11px] font-black uppercase leading-tight text-stone-950">Presidency University</h4>
                      <p className="text-[8px] font-bold text-stone-500 uppercase leading-none">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-stone-100 border border-stone-300 text-stone-800 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide">
                      {copyTitle}
                    </span>
                  </div>
                </div>

                {/* Bank Branches Info */}
                <div className="bg-stone-50 p-2 rounded border border-stone-200 text-[9px] leading-tight space-y-1 text-stone-800">
                  <div className="font-bold uppercase text-stone-900">DHAKA BANK / BRAC BANK</div>
                  <div>Please deposit at any online branch of Dhaka Bank or BRAC Bank.</div>
                </div>

                {/* Metadata */}
                <div className="space-y-1 text-[10px] text-stone-800">
                  <div className="flex justify-between border-b border-stone-100 pb-0.5">
                    <span className="text-stone-500">Student ID:</span>
                    <span className="font-mono font-bold text-stone-950">{student.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-0.5">
                    <span className="text-stone-500">Student Name:</span>
                    <span className="font-bold text-stone-950 truncate max-w-[150px]">{student.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-0.5">
                    <span className="text-stone-500">Semester:</span>
                    <span className="font-bold text-stone-950">{student.currentSemester}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-0.5">
                    <span className="text-stone-500">Program:</span>
                    <span className="font-bold text-stone-950 truncate max-w-[150px]">{student.program}</span>
                  </div>
                </div>

                {/* Fees Grid */}
                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase text-stone-500 tracking-wider">Requested Fees</div>
                  <div className="border border-stone-300 rounded overflow-hidden">
                    <table className="w-full text-left text-[9px] border-collapse">
                      <thead>
                        <tr className="bg-stone-100 font-bold border-b border-stone-300 text-stone-700">
                          <th className="px-2 py-1 w-12">Code</th>
                          <th className="px-2 py-1">Description</th>
                          <th className="px-2 py-1 text-right w-16">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {selectedFeeDetails.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-2 py-2 text-center text-stone-400 italic">No fees selected</td>
                          </tr>
                        ) : (
                          selectedFeeDetails.map((f) => {
                            const amt = f.code === 'PAY099' ? parseFloat(cashAmount) || 0 : f.amount;
                            const desc = f.code === 'PAY099' ? cashDesc : f.description;
                            return (
                              <tr key={f.code} className="text-stone-900 font-medium">
                                <td className="px-2 py-1 font-mono font-bold text-stone-950">{f.code}</td>
                                <td className="px-2 py-1 truncate max-w-[120px]">{desc}</td>
                                <td className="px-2 py-1 text-right font-mono font-bold">
                                  {amt.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                        <tr className="bg-stone-50 font-bold border-t border-stone-300 text-stone-950">
                          <td colSpan={2} className="px-2 py-1 text-right uppercase tracking-wider text-[8px]">Total</td>
                          <td className="px-2 py-1 text-right font-mono text-[10px] font-black">
                            {selectedFeeDetails.reduce((sum, f) => sum + (f.code === 'PAY099' ? parseFloat(cashAmount) || 0 : f.amount), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-8 grid grid-cols-2 gap-4 text-[8px] text-stone-800">
                  <div className="text-center">
                    <div className="border-t border-stone-400 pt-1 font-bold">Officer / Cashier</div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-stone-400 pt-1 font-bold">Depositor Signature</div>
                  </div>
                </div>

                {/* Print Info */}
                <div className="text-[7px] text-stone-400 font-mono text-center pt-2 flex justify-between border-t border-stone-100">
                  <span>Date: {dateStr} {timeStr}</span>
                  <span>SIMS Online Slip</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      <AnimatePresence>
        {isConfirmPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm print:hidden isolate">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setIsConfirmPaymentOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl overflow-hidden text-stone-900 dark:text-white"
            >
              {/* Top accent line */}
              <div className="h-1.5 bg-gradient-to-r from-[#8c1515] to-[#dc2626]" />

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-black text-stone-900 dark:text-white">Pay Fees Online</h3>
                  <p className="text-xs text-stone-500 mt-1">SIMS Instant Secure Payment Settlement Gateway</p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950/40 p-4 rounded-xl border border-stone-200/50 dark:border-stone-800/80 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Student ID:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">{student.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Student Name:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{student.name}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 dark:border-stone-800/80 pt-2 font-black items-baseline">
                    <span className="text-stone-800 dark:text-stone-100">Payable Total:</span>
                    <span className="text-lg text-emerald-600 dark:text-emerald-400 font-mono">
                      TK {selectedFeeDetails.reduce((sum, f) => sum + (f.code === 'PAY099' ? parseFloat(cashAmount) || 0 : f.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Gateway channels */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Payment Channel</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'bkash'
                          ? 'border-[#e2136e] bg-[#e2136e]/5 text-[#e2136e] font-bold shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <img src="https://wsrv.nl/?url=http://sims.pu.edu.bd/uploads/bKash_Apps_Flow_Chart.pdf&output=webp" alt="bkash" className="h-6 w-auto object-contain hidden" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <span className="text-xs font-black">bKash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'nagad'
                          ? 'border-[#f57224] bg-[#f57224]/5 text-[#f57224] font-bold shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-xs font-black">Nagad</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('dbbl')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'dbbl'
                          ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-xs font-black">Rocket</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsConfirmPaymentOpen(false)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleConfirmPayment();
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
