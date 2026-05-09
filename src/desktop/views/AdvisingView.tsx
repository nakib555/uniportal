import React from 'react';
import { Card } from '../components/ui';
import { MessageSquare, Calendar } from 'lucide-react';

export function AdvisingView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Advising & Ticketing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 space-y-4">
            <Card className="p-4 bg-[#8c1515] text-white">
               <h3 className="font-bold mb-1">Your Advisor</h3>
               <p className="text-sm opacity-90 mb-4">Dr. Anisur Rahman</p>
               <button className="w-full bg-white text-[#8c1515] font-bold py-2 rounded-lg text-sm flex justify-center items-center gap-2">
                 <Calendar className="w-4 h-4" /> Book Appointment
               </button>
            </Card>
            <Card className="p-4">
               <button className="w-full bg-stone-900 text-white font-bold py-2 rounded-lg text-sm">Create New Ticket</button>
            </Card>
         </div>
         <div className="md:col-span-2">
            <Card className="p-0 h-[500px] flex flex-col justify-between">
               <div className="p-4 border-b bg-stone-50">
                  <h3 className="font-bold">Chat with Advisor</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col justify-end space-y-4 bg-stone-50/50">
                  <div className="bg-white p-3 rounded-lg border max-w-[80%] self-start shadow-sm">
                     <p className="text-sm">Hello, let me know if you need help with your course enrollment this semester.</p>
                     <span className="text-xs text-stone-400 mt-1 block">10:00 AM</span>
                  </div>
                  <div className="bg-indigo-600 text-white p-3 rounded-lg max-w-[80%] self-end shadow-sm">
                     <p className="text-sm">Thank you! I was wondering if I can take 21 credits.</p>
                     <span className="text-xs text-indigo-300 mt-1 block text-right">10:15 AM</span>
                  </div>
               </div>
               <div className="p-4 border-t flex gap-2 bg-white">
                  <input placeholder="Type your message..." className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1515]" />
                  <button className="bg-[#8c1515] text-white px-4 py-2 rounded-lg"><MessageSquare className="w-4 h-4" /></button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
