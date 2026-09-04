import React, { useState } from 'react';
import { Card } from '../components/ui';
import { MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

export function AdvisingView() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, let me know if you need help with your course enrollment this semester.', time: '10:00 AM', sender: 'advisor' },
    { id: 2, text: 'Thank you! I was wondering if I can take 21 credits.', time: '10:15 AM', sender: 'student' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([...messages, { id: Date.now(), text: newMessage, time: timeString, sender: 'student' }]);
    setNewMessage('');
    
    // Auto reply
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: Date.now(), text: 'I have received your message. I will check your curriculum and get back to you shortly.', time: replyTime, sender: 'advisor' }]);
    }, 1500);
  };

  const handleBookAppointment = () => {
    setSuccessMsg('Appointment request sent to Dr. Anisur Rahman for next available slot.');
    setIsAppointmentOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Support ticket #TCK-8924 has been successfully created.');
    setIsTicketOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 relative">
      {successMsg && (
        <div className="absolute top-0 right-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 z-10">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {successMsg}
        </div>
      )}

      <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Advising Appointment</DialogTitle>
            <DialogDescription>
              Request a 1-on-1 meeting with Dr. Anisur Rahman.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Preferred Date</label>
              <input type="date" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Reason</label>
              <textarea placeholder="Briefly describe what you'd like to discuss..." className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] resize-none h-20" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={handleBookAppointment}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
        <DialogContent>
          <form onSubmit={handleCreateTicket}>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Submit a formal query to the advising office or registrar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Subject</label>
                <input required placeholder="e.g. Credit over-limit approval" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Department</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]">
                  <option>Academic Advising</option>
                  <option>Registrar's Office</option>
                  <option>IT Support</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Description</label>
                <textarea required placeholder="Detailed explanation..." className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515] resize-none h-24" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit">Submit Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Advising & Ticketing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 space-y-4">
            <Card className="p-4 bg-[#8c1515] dark:bg-[#ef4444] text-white border-transparent">
               <h3 className="font-bold mb-1">Your Advisor</h3>
               <p className="text-sm opacity-90 mb-4">Dr. Anisur Rahman</p>
               <button onClick={() => setIsAppointmentOpen(true)} className="w-full bg-white text-[#8c1515] dark:text-[#ef4444] hover:bg-stone-50 dark:hover:bg-stone-100 transition-colors font-bold py-2 rounded-lg text-sm flex justify-center items-center gap-2">
                 <Calendar className="w-4 h-4" /> Book Appointment
               </button>
            </Card>
            <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
               <button onClick={() => setIsTicketOpen(true)} className="w-full bg-stone-900 dark:bg-stone-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors">Create New Ticket</button>
            </Card>
         </div>
         <div className="md:col-span-2">
            <Card className="p-0 h-[500px] flex flex-col justify-between overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
               <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                  <h3 className="font-bold text-stone-900 dark:text-white">Chat with Advisor</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col space-y-4 bg-stone-50/50 dark:bg-stone-950/50 overflow-y-auto">
                  {messages.map(m => (
                    <div key={m.id} className={m.sender === 'advisor' 
                      ? "bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700 max-w-[80%] self-start shadow-sm text-stone-900 dark:text-stone-200"
                      : "bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-lg max-w-[80%] self-end shadow-sm"}>
                       <p className="text-sm">{m.text}</p>
                       <span className={`text-xs mt-1 block ${m.sender === 'advisor' ? 'text-stone-400 dark:text-stone-500' : 'text-indigo-300 dark:text-indigo-200 text-right'}`}>{m.time}</span>
                    </div>
                  ))}
               </div>
               <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200 dark:border-stone-800 flex gap-2 bg-white dark:bg-stone-900">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1515] dark:focus:ring-[#ef4444]" 
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] dark:hover:bg-[#dc2626] disabled:opacity-50 transition-colors text-white px-4 py-2 rounded-lg"><MessageSquare className="w-4 h-4" /></button>
               </form>
            </Card>
         </div>
      </div>
    </div>
  );
}
