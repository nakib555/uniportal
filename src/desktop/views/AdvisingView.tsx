import React from 'react';
import { Card } from '../components/ui';
import { MessageSquare, Calendar } from 'lucide-react';

export function AdvisingView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Advising & Ticketing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 space-y-4">
            <Card className="p-4 bg-[#8c1515] dark:bg-[#ef4444] text-white border-transparent">
               <h3 className="font-bold mb-1">Your Advisor</h3>
               <p className="text-sm opacity-90 mb-4">Dr. Anisur Rahman</p>
               <button className="w-full bg-white text-[#8c1515] dark:text-[#ef4444] hover:bg-stone-50 dark:hover:bg-stone-100 transition-colors font-bold py-2 rounded-lg text-sm flex justify-center items-center gap-2">
                 <Calendar className="w-4 h-4" /> Book Appointment
               </button>
            </Card>
            <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
               <button className="w-full bg-stone-900 dark:bg-stone-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors">Create New Ticket</button>
            </Card>
         </div>
         <div className="md:col-span-2">
            <Card className="p-0 h-[500px] flex flex-col justify-between overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
               <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                  <h3 className="font-bold text-stone-900 dark:text-white">Chat with Advisor</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col justify-end space-y-4 bg-stone-50/50 dark:bg-stone-950/50 overflow-y-auto">
                  <div className="bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700 max-w-[80%] self-start shadow-sm text-stone-900 dark:text-stone-200">
                     <p className="text-sm">Hello, let me know if you need help with your course enrollment this semester.</p>
                     <span className="text-xs text-stone-400 dark:text-stone-500 mt-1 block">10:00 AM</span>
                  </div>
                  <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-lg max-w-[80%] self-end shadow-sm">
                     <p className="text-sm">Thank you! I was wondering if I can take 21 credits.</p>
                     <span className="text-xs text-indigo-300 dark:text-indigo-200 mt-1 block text-right">10:15 AM</span>
                  </div>
               </div>
               <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex gap-2 bg-white dark:bg-stone-900">
                  <input placeholder="Type your message..." className="flex-1 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1515] dark:focus:ring-[#ef4444]" />
                  <button className="bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] dark:hover:bg-[#dc2626] transition-colors text-white px-4 py-2 rounded-lg"><MessageSquare className="w-4 h-4" /></button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
