import React from 'react';
import { STUDENT_DATA } from '../../data';

export function PrintableTranscript({ semesters }: { semesters: any }) {
  const student = STUDENT_DATA;
  return (
    <div className="hidden print:block font-serif text-black bg-white w-full print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
       <div className="text-center border-b-2 border-black pb-4 mb-6">
           <h1 className="text-2xl font-bold uppercase tracking-wider print:text-black">University Portal</h1>
           <h2 className="text-xl font-bold mb-1 print:text-black">Academic Transcript</h2>
           <p className="text-sm print:text-gray-600 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8 border border-black p-4">
           <div>
              <p><span className="font-bold">Student Name:</span> {student.name}</p>
              <p><span className="font-bold">Student ID:</span> 21104104</p>
              <p><span className="font-bold">Program:</span> {student.program}</p>
           </div>
           <div className="text-right">
              <p><span className="font-bold">Cumulative GPA:</span> {student.cgpa.toFixed(2)}</p>
           </div>
       </div>

       <div className="space-y-8">
           {semesters.map((term: any, idx: number) => (
               <div key={idx} className="break-inside-avoid">
                   <h3 className="text-md font-bold border-b border-black mb-2 pb-1 uppercase">{term.term}</h3>
                   <table className="w-full text-left border-collapse border border-black mb-2">
                       <thead>
                           <tr className="bg-gray-100 border-b border-black print:bg-gray-100">
                               <th className="p-2 border-r border-black font-bold text-xs uppercase">Course</th>
                               <th className="p-2 border-r border-black font-bold text-xs uppercase">Title</th>
                               <th className="p-2 border-r border-black font-bold text-xs uppercase text-center">Cr</th>
                               <th className="p-2 font-bold text-xs uppercase text-center">Grade</th>
                           </tr>
                       </thead>
                       <tbody>
                           {term.courses.map((c: any, i: number) => (
                               <tr key={i} className="border-b border-black text-sm">
                                   <td className="p-2 border-r border-black">{c.code}</td>
                                   <td className="p-2 border-r border-black">{c.title}</td>
                                   <td className="p-2 border-r border-black text-center">{c.credits}</td>
                                   <td className="p-2 text-center font-bold">{c.grade}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
                   <div className="flex justify-end gap-6 text-sm">
                       <p><span className="font-bold">Term GPA:</span> {term.gpa}</p>
                   </div>
               </div>
           ))}
       </div>

       <div className="mt-16 pt-4 border-t border-gray-400 text-center text-xs text-gray-500">
           <p>This document is an unofficial web printout. For an official transcript or certification of degree requirements, please contact the Registrar's Office.</p>
           <p className="mt-1 font-mono text-[10px]">Report ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} - {new Date().toISOString()}</p>
       </div>
    </div>
  );
}
