import React from 'react';
import { Card, Badge } from '../components/ui';
import { TEACHERS_DATA } from '../../data';
import { Star, User } from 'lucide-react';

export function FacultyEvalView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Faculty Evaluation</h2>
      <p className="text-stone-600 dark:text-stone-400">Please provide anonymous feedback for your instructors this semester. Your honest feedback helps improve teaching quality.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {TEACHERS_DATA.slice(0, 4).map(teacher => (
           <Card key={teacher.initial} className="p-6 transition-all hover:shadow-md border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
              <div className="flex gap-4">
                 <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 dark:text-stone-500">
                    <User className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white hover:text-[#8c1515] dark:hover:text-[#ef4444] cursor-pointer transition-colors">{teacher.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{teacher.department}</p>
                    <Badge variant="outline" className="mt-2 text-xs">Evaluations Open</Badge>
                 </div>
              </div>
              <div className="mt-6">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-stone-900 dark:text-white">Overall Rating</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 text-stone-300 dark:text-stone-600 hover:text-amber-400 dark:hover:text-amber-400 cursor-pointer fill-transparent hover:fill-amber-400 dark:hover:fill-amber-400 transition-colors hover:scale-110 active:scale-95" />)}
                    </div>
                 </div>
                 <textarea className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg p-3 text-sm mt-3 focus:border-[#8c1515] dark:focus:border-[#ef4444] focus:ring-1 focus:ring-[#8c1515] dark:focus:ring-[#ef4444] outline-none transition-shadow focus:shadow-sm" rows={3} placeholder="Write your anonymous review here..."></textarea>
                 <button className="w-full mt-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-2 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all hover:shadow-md active:scale-[0.98]">Submit Evaluation</button>
              </div>
           </Card>
        ))}
      </div>
    </div>
  );
}
