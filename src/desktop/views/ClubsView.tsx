import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { Users, Calendar, Plus, CalendarDays, ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function ClubsView() {
  const clubs = [
    { name: 'Computer Club', members: 120, nextEvent: 'Hackathon 2026', nextEventDate: '2026-06-15T09:00:00Z', type: 'Academic' },
    { name: 'Debate Society', members: 85, nextEvent: 'Inter-Department Debate', nextEventDate: '2026-06-20T14:00:00Z', type: 'Cultural' },
    { name: 'Robotics Wing', members: 60, nextEvent: 'Line Follower Workshop', nextEventDate: '2026-07-05T10:00:00Z', type: 'Technical' },
  ];

  const [activeCalendarMenu, setActiveCalendarMenu] = useState<string | null>(null);

  const getGoogleCalendarUrl = (title: string, dateStr: string) => {
     const start = new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
     const end = new Date(new Date(dateStr).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
     return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}`;
  };

  const getOutlookCalendarUrl = (title: string, dateStr: string) => {
      const start = new Date(dateStr).toISOString();
      const end = new Date(new Date(dateStr).getTime() + 2 * 60 * 60 * 1000).toISOString();
      return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(title)}&startdt=${encodeURIComponent(start)}&enddt=${encodeURIComponent(end)}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Clubs & Extracurriculars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {clubs.map(club => (
           <Card key={club.name} className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-all group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-visible relative">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8c1515]/10 dark:group-hover:bg-[#ef4444]/10 transition-colors">
                 <Users className="w-8 h-8 text-stone-400 dark:text-stone-500 group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors" />
              </div>
              <Badge variant="outline" className="mb-2 group-hover:border-[#8c1515]/30 dark:group-hover:border-[#ef4444]/30 group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444]">{club.type}</Badge>
              <h3 className="font-bold text-lg group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors text-stone-900 dark:text-stone-100">{club.name}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">{club.members} active members</p>
              
              <div className="w-full bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl text-sm text-left mb-6 relative group-hover:bg-[#8c1515]/5 dark:group-hover:bg-[#ef4444]/5 transition-colors border border-stone-100 dark:border-stone-800/50">
                 <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wider">Next Event</div>
                    <div className="relative">
                       <button 
                          onClick={(e) => { e.stopPropagation(); setActiveCalendarMenu(activeCalendarMenu === club.name ? null : club.name); }}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c1515] dark:text-[#ef4444] bg-[#8c1515]/10 dark:bg-[#ef4444]/10 hover:bg-[#8c1515]/20 dark:hover:bg-[#ef4444]/20 py-1 px-2 rounded-md transition-colors"
                       >
                          <Plus className="w-3 h-3" /> Calendar
                       </button>

                       {/* Calendar Dropdown Menu */}
                       <AnimatePresence>
                          {activeCalendarMenu === club.name && (
                             <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveCalendarMenu(null); }} />
                                <motion.div 
                                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
                                   className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 z-50 overflow-hidden"
                                >
                                   <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-none">Add Event To</span>
                                      <button onClick={(e) => { e.stopPropagation(); setActiveCalendarMenu(null); }} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                                         <X className="w-3 h-3" />
                                      </button>
                                   </div>
                                   <div className="p-1.5 flex flex-col gap-0.5">
                                      <a href={getGoogleCalendarUrl(club.nextEvent, club.nextEventDate)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-2.5 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                                         <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#4285F4]" /> Google</span>
                                         <ExternalLink className="w-3 h-3 text-stone-400" />
                                      </a>
                                      <a href={getOutlookCalendarUrl(club.nextEvent, club.nextEventDate)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-2.5 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                                         <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#0078D4]" /> Outlook</span>
                                         <ExternalLink className="w-3 h-3 text-stone-400" />
                                      </a>
                                   </div>
                                </motion.div>
                             </>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>
                 <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#8c1515] dark:text-[#ef4444]" /> {club.nextEvent}</div>
                 <div className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 ml-6">{new Date(club.nextEventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
              </div>
              
              <button className="w-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-bold py-2.5 rounded-xl hover:bg-[#8c1515] dark:hover:bg-[#ef4444] hover:text-white transition-all cursor-pointer group-hover:bg-[#8c1515] dark:group-hover:bg-[#ef4444] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#8c1515]/20 dark:group-hover:shadow-none active:scale-[0.98]">Request Access</button>
           </Card>
         ))}
      </div>
    </div>
  );
}
