import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Download, CreditCard, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../../hooks/usePortalLogic';
import { FEES_LIST, TRANSACTIONS_DATA } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

export function AccountsView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const { 
    store, selectedFees, toggleFee, bankSlipTotal, 
    isBankSlipSuccess, isConfirmPaymentOpen, setIsConfirmPaymentOpen, handleConfirmPayment,
    statementChartData, totalDebit, totalCredit
  } = portal;
  
  const isBankSlips = store.activeTab === 'bank-slips';

  if (!isBankSlips) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col justify-center">
            <p className="text-sm text-stone-500 font-medium mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-stone-900 dark:text-white">
              {TRANSACTIONS_DATA[0].balance < 0 ? '-' : ''}৳{Math.abs(TRANSACTIONS_DATA[0].balance).toLocaleString()}
            </p>
            {TRANSACTIONS_DATA[0].balance > 0 && (
              <p className="text-xs font-bold text-red-500 mt-2 flex items-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> 
                <span>Overpaid - Can be refunded</span>
              </p>
            )}
          </Card>
          <Card className="p-5 flex flex-col justify-center">
            <p className="text-sm text-stone-500 font-medium mb-1">Total Billed</p>
            <p className="text-xl font-bold text-rose-600">৳{totalDebit.toLocaleString()}</p>
          </Card>
          <Card className="p-5 flex flex-col justify-center">
            <p className="text-sm text-stone-500 font-medium mb-1">Total Paid</p>
            <p className="text-xl font-bold text-emerald-600">৳{totalCredit.toLocaleString()}</p>
          </Card>
          <Card className="p-5 flex flex-col justify-center gap-3">
             <button onClick={() => window.print()} className="flex items-center justify-center gap-2 w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-sm transition-colors">
               <Download className="w-4 h-4" /> Download PDF
             </button>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Balance Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statementChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8c1515" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8c1515" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `৳${val}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`৳${value}`, 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#8c1515" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="px-6 py-4 font-medium text-stone-500">Date</th>
                  <th className="px-6 py-4 font-medium text-stone-500">Description</th>
                  <th className="px-6 py-4 font-medium text-stone-500 text-right">Debit (Billed)</th>
                  <th className="px-6 py-4 font-medium text-stone-500 text-right">Credit (Paid)</th>
                  <th className="px-6 py-4 font-medium text-stone-500 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {TRANSACTIONS_DATA.map((t, i) => (
                  <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-stone-500">{t.date}</td>
                    <td className="px-6 py-4 font-medium">{t.description}</td>
                    <td className="px-6 py-4 text-right text-rose-600">{t.debit ? `৳${t.debit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-right text-emerald-600">{t.credit ? `৳${t.credit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-right font-semibold">৳{t.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 p-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#8c1515]" /> Select Fees to Pay
          </h3>
          <div className="space-y-3">
            {FEES_LIST.map((fee) => (
              <label 
                key={fee.code} 
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedFees.includes(fee.code) 
                    ? 'border-[#8c1515] bg-[#8c1515]/5' 
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedFees.includes(fee.code) ? 'border-[#8c1515] bg-[#8c1515]' : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {selectedFees.includes(fee.code) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">{fee.description}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100">৳{fee.amount.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="w-full md:w-[320px] shrink-0">
          <div className="sticky top-24">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Payment Summary</h3>
              
              <div className="space-y-3 mb-6">
                {selectedFees.map(code => {
                  const fee = FEES_LIST.find(f => f.code === code)!;
                  return (
                    <div key={code} className="flex justify-between text-sm">
                      <span className="text-stone-600 dark:text-stone-400">{fee.description}</span>
                      <span className="font-medium">৳{fee.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
                {selectedFees.length === 0 && (
                  <p className="text-sm text-stone-500 text-center py-4">No fees selected.</p>
                )}
              </div>
              
              <div className="border-t border-stone-200 dark:border-stone-800 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Total Amount</span>
                  <span className="text-xl font-bold text-[#8c1515] dark:text-[#ef4444]">৳{bankSlipTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => portal.handleBankSlipSubmitClick()}
                disabled={selectedFees.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConfirmPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Confirm Payment</h3>
                <p className="text-stone-500 text-sm mb-6">You are about to generate a bank slip for <strong>৳{bankSlipTotal.toLocaleString()}</strong>.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsConfirmPaymentOpen(false)} className="flex-1 py-2.5 rounded-xl border border-stone-200 font-medium hover:bg-stone-50 transition-colors">Cancel</button>
                  <button onClick={handleConfirmPayment} className="flex-1 py-2.5 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] text-white font-medium transition-colors">Confirm & Generate</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBankSlipSuccess && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-bold">Bank slip generated!</p>
              <p className="opacity-90">You can download it now.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
