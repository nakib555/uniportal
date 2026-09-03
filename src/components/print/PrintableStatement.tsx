import React from 'react';
import { Transaction } from '../../data';

export function PrintableStatement({ student, totalDebit, totalCredit, currentDues, transactions }: { student: any; totalDebit: number; totalCredit: number; currentDues: number; transactions: Transaction[] }) {
  const displayTransactions = transactions || [];
  return (
    <div className="hidden print:block font-serif text-black bg-white w-full print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
       <div className="text-center border-b-2 border-black pb-4 mb-6">
           <h1 className="text-2xl font-bold uppercase tracking-wider print:text-black">PRESIDENCY UNIVERSITY</h1>
           <h2 className="text-xl font-bold mb-1 print:text-black">Statement of Account</h2>
           <p className="text-sm print:text-gray-600 mt-1">Generated on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8 border border-black p-4">
           <div>
              <p><span className="font-bold">Student Name:</span> {student.name}</p>
              <p><span className="font-bold">Student ID:</span> {student.id}</p>
              <p><span className="font-bold">Program:</span> {student.program || student.department || 'Undergraduate'}</p>
           </div>
           <div className="text-right">
              <p><span className="font-bold">Total Billed:</span> Tk {totalDebit.toLocaleString()}</p>
              <p><span className="font-bold">Total Paid:</span> Tk {totalCredit.toLocaleString()}</p>
              <p><span className="font-bold">Current Dues:</span> Tk {currentDues.toLocaleString()}</p>
           </div>
       </div>

       <div className="mb-8">
           <table className="w-full text-left border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100 border-b border-black print:bg-gray-100">
                   <th className="p-2 border-r border-black font-bold text-sm">Date</th>
                   <th className="p-2 border-r border-black font-bold text-sm">Description</th>
                   <th className="p-2 border-r border-black font-bold text-sm">Item</th>
                   <th className="p-2 border-r border-black font-bold text-sm">Voucher</th>
                   <th className="p-2 border-r border-black font-bold text-sm text-right">Debit (Tk)</th>
                   <th className="p-2 border-r border-black font-bold text-sm text-right">Credit (Tk)</th>
                   <th className="p-2 font-bold text-sm text-right">Balance (Tk)</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.map((t, i) => (
                   <tr key={i} className="border-b border-black text-sm">
                      <td className="p-2 border-r border-black">{t.date}</td>
                      <td className="p-2 border-r border-black">{t.description}</td>
                      <td className="p-2 border-r border-black">{t.code || '-'}</td>
                      <td className="p-2 border-r border-black">{t.id || '-'}</td>
                      <td className="p-2 border-r border-black text-right">{t.debit ? t.debit.toLocaleString() : '-'}</td>
                      <td className="p-2 border-r border-black text-right">{t.credit ? t.credit.toLocaleString() : '-'}</td>
                      <td className="p-2 text-right">{t.balance.toLocaleString()}</td>
                   </tr>
                ))}
                {displayTransactions.length > 0 && (
                   <tr className="bg-gray-100 font-bold border-b border-black text-sm">
                      <td colSpan={4} className="p-2 border-r border-black text-right font-bold">Grand Total:</td>
                      <td className="p-2 border-r border-black text-right font-mono font-bold">{totalDebit.toLocaleString()}</td>
                      <td className="p-2 border-r border-black text-right font-mono font-bold text-emerald-800">{totalCredit.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono font-bold">{(displayTransactions[displayTransactions.length - 1].balance).toLocaleString()}</td>
                   </tr>
                )}
              </tbody>
           </table>
       </div>

       <div className="mt-16 pt-4 border-t border-gray-400 text-center text-xs text-gray-500">
            <p>This document is a computer-generated statement and does not require a signature.</p>
            <p className="mt-1 font-mono text-[10px]">Report ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} - {new Date().toISOString()}</p>
       </div>
    </div>
  );
}
