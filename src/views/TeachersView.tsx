import React from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TEACHERS_DATA } from '../data';

export const TeachersView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Related Teachers</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Related teachers information for the running semester.</p>
      </header>

      <Card className="overflow-hidden">
         <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
            {TEACHERS_DATA.map((t, i) => (
               <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                  <div className="flex-1 flex items-start gap-4">
                     <div className="hidden sm:flex w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 items-center justify-center text-xs font-bold text-stone-500 dark:text-stone-400 shrink-0">
                        {i+1}
                     </div>
                     <div className="flex-1">
                        <div className="flex sm:flex-col sm:items-start justify-between items-center gap-2 mb-2 sm:mb-1">
                           <div className="font-bold text-stone-900 dark:text-white text-base leading-tight">
                              {t.name}
                              <span className="inline-block sm:hidden text-xs text-stone-500 dark:text-stone-400 font-normal ml-2">({t.name.split(' ')[0]})</span>
                           </div>
                           <Badge variant="outline" className="font-bold text-[#8c1515] dark:text-[#ef4444] border-[#8c1515]/20 dark:border-[#ef4444]/20 bg-[#8c1515]/5 dark:bg-[#ef4444]/10 shrink-0">
                              {t.department}
                           </Badge>
                        </div>
                        <div className="hidden sm:block text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-bold">
                           Initial: {t.name.split(' ')[0]}
                        </div>
                     </div>
                  </div>
                  <div className="sm:max-w-xs w-full bg-stone-50 dark:bg-stone-800/30 p-2 sm:p-3 rounded-lg border border-stone-100 dark:border-stone-800/50 text-sm flex items-center gap-3">
                     <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest shrink-0">Courses</span>
                     <span className="font-mono font-medium text-stone-700 dark:text-stone-300 truncate">{t.courses}</span>
                  </div>
               </div>
            ))}
         </div>
      </Card>
    </div>
  );
};
