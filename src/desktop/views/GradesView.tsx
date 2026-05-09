import React from 'react';
import { Card, Badge } from '../components/ui';
import { COMPLETED_COURSES } from '../../data';
import { Download, FileText } from 'lucide-react';

export function GradesView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-stone-50 p-6 rounded-xl border">
        <div>
           <h2 className="text-2xl font-bold">Academic Transcript</h2>
           <p className="text-stone-500">Cumulative GPA: <span className="font-bold text-stone-900">3.85</span></p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
           <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-stone-100 border-b flex justify-between items-center">
           <h3 className="font-bold">Fall 2025</h3>
           <Badge variant="success">Semester GPA: 3.92</Badge>
        </div>
        <div className="divide-y">
           {COMPLETED_COURSES.map(course => (
             <div key={course.code} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                   <div className="font-bold text-lg">{course.code}</div>
                   <div className="text-sm text-stone-500">{course.title}</div>
                </div>
                <div className="flex gap-8 mt-4 md:mt-0 text-right">
                   <div>
                      <div className="text-xs text-stone-400 uppercase">Credits</div>
                      <div className="font-bold">{course.credits}</div>
                   </div>
                   <div>
                      <div className="text-xs text-stone-400 uppercase">Grade</div>
                      <div className="font-bold text-lg text-emerald-600">{course.grade}</div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
