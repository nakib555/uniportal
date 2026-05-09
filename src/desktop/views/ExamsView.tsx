import React from 'react';
import { Card, Badge } from '../components/ui';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function ExamsView() {
  const exams = [
    { code: 'CSE301', title: 'Database Systems', date: 'Dec 12, 2026', time: '10:00 AM', room: 'B-402', seat: 'Row 4, Seat 12' },
    { code: 'MAT123', title: 'Calculus I', date: 'Dec 14, 2026', time: '02:00 PM', room: 'Gymnasium', seat: 'Section C, Seat 45' },
    { code: 'ENG101', title: 'English Reading', date: 'Dec 16, 2026', time: '08:30 AM', room: 'A-101', seat: 'Row 1, Seat 5' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Exam Routine & Seat Plan</h2>
      <Card className="p-0 border-transparent overflow-hidden shadow-sm">
         <div className="bg-stone-50 border-b px-6 py-4">
            <h3 className="font-bold text-stone-700">Fall 2026 Final Exams</h3>
         </div>
         <div className="divide-y">
            {exams.map(exam => (
              <div key={exam.code} className="p-6 flex flex-col md:flex-row gap-6 justify-between hover:bg-stone-50/50 transition-colors">
                 <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                       <Badge variant="brand">{exam.code}</Badge>
                       <span className="font-bold text-lg">{exam.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-600">
                       <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-stone-400" /> {exam.date}</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-stone-400" /> {exam.time}</span>
                    </div>
                 </div>
                 <div className="bg-stone-100 rounded-xl p-4 flex flex-col justify-center items-end min-w-[200px]">
                    <div className="text-xs uppercase font-bold text-stone-400 mb-1">Seat Allocation</div>
                    <div className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-[#8c1515]" /> Room {exam.room}</div>
                    <div className="text-sm font-medium mt-1 bg-white px-2 py-1 rounded shadow-sm border">{exam.seat}</div>
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
}
