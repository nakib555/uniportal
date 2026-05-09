import React from 'react';
import { Card, Badge } from '../components/ui';
import { REGISTERED_COURSES, COMPLETED_COURSES } from '../../data';
import { CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

export function DegreeAuditView() {
  const totalRequired = 130;
  const totalCompleted = COMPLETED_COURSES.reduce((sum, c) => sum + c.credits, 0);
  const totalProgress = (totalCompleted / totalRequired) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <GraduationCap className="w-8 h-8" />
             <h2 className="text-2xl font-bold">Degree Audit</h2>
          </div>
          <div className="text-right">
             <div className="text-sm opacity-80 uppercase tracking-wider">Credits Completed</div>
             <div className="text-3xl font-black">{totalCompleted} / {totalRequired}</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div className="bg-white h-3 rounded-full" style={{ width: `${totalProgress}%` }} />
        </div>
      </Card>
      
      <h3 className="font-bold text-lg">Degree Pathway</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <Card className="p-4 border-l-4 border-l-emerald-500 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
           <h4 className="font-bold mb-2 group-hover:text-emerald-600 transition-colors">Core Requirements</h4>
           <p className="text-sm text-stone-600">You have completed 45 out of 60 core credits.</p>
           <button className="text-emerald-600 text-sm font-bold mt-2 flex items-center group-hover:underline">View completed <ChevronRight className="w-4 h-4" /></button>
         </Card>
         <Card className="p-4 border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
           <h4 className="font-bold mb-2 group-hover:text-amber-600 transition-colors">Electives</h4>
           <p className="text-sm text-stone-600">You have completed 12 out of 30 elective credits.</p>
           <button className="text-amber-600 text-sm font-bold mt-2 flex items-center group-hover:underline">View options <ChevronRight className="w-4 h-4" /></button>
         </Card>
         <Card className="p-4 border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group opacity-80 hover:opacity-100">
           <h4 className="font-bold mb-2 group-hover:text-blue-600 transition-colors">Capstone Project</h4>
           <p className="text-sm text-stone-600">Not started. Prerequisite: 100 credits.</p>
           <Badge variant="outline" className="mt-2">Locked</Badge>
         </Card>
      </div>
    </div>
  );
}
