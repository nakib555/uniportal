import React from 'react';
import { Card, Badge } from '../components/ui';
import { TEACHERS_DATA } from '../../data';
import { Star, User } from 'lucide-react';

export function FacultyEvalView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Faculty Evaluation</h2>
      <p className="text-stone-600">Please provide anonymous feedback for your instructors this semester. Your honest feedback helps improve teaching quality.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {TEACHERS_DATA.slice(0, 4).map(teacher => (
           <Card key={teacher.initial} className="p-6 transition-all hover:shadow-md">
              <div className="flex gap-4">
                 <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <User className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg hover:text-[#8c1515] cursor-pointer transition-colors">{teacher.name}</h3>
                    <p className="text-sm text-stone-500">{teacher.department}</p>
                    <Badge variant="outline" className="mt-2 text-xs">Evaluations Open</Badge>
                 </div>
              </div>
              <div className="mt-6">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Rating</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 text-stone-300 hover:text-amber-400 cursor-pointer fill-transparent hover:fill-amber-400 transition-colors hover:scale-110 active:scale-95" />)}
                    </div>
                 </div>
                 <textarea className="w-full border rounded-lg p-3 text-sm mt-3 border-stone-200 focus:ring-[#8c1515] outline-none transition-shadow focus:shadow-sm" rows={3} placeholder="Write your anonymous review here..."></textarea>
                 <button className="w-full mt-4 bg-stone-900 text-white font-bold py-2 rounded-lg hover:bg-stone-800 transition-all hover:shadow-md active:scale-[0.98]">Submit Evaluation</button>
              </div>
           </Card>
        ))}
      </div>
    </div>
  );
}
