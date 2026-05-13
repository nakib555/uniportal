import React from 'react';
import { GraduationCap } from 'lucide-react';
import { COMPLETED_COURSES } from '../../data';

export function PrintableDegreeAudit({ student, requirements }: { student: any, requirements: any[] }) {
  return (
    <div className="hidden print:block font-serif text-black bg-white w-full print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
       <div className="text-center border-b-2 border-black pb-4 mb-6">
           <div className="flex justify-center items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 print:text-black" />
              <h1 className="text-2xl font-bold uppercase tracking-wider print:text-black">University Portal</h1>
           </div>
           <h2 className="text-xl font-bold mb-1 print:text-black">Official Degree Audit Report</h2>
           <p className="text-sm print:text-gray-600 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8 border border-black p-4">
           <div>
              <p><span className="font-bold">Student Name:</span> {student.name}</p>
              <p><span className="font-bold">Student ID:</span> {student.id}</p>
              <p><span className="font-bold">Program:</span> {student.program}</p>
           </div>
           <div className="text-right">
              <p><span className="font-bold">CGPA:</span> {student.cgpa.toFixed(2)}</p>
              <p><span className="font-bold">Credits Completed:</span> {student.creditsComp} / {student.creditsReq}</p>
              <p><span className="font-bold">Academic Status:</span> {student.cgpa >= 2.0 ? 'Good Standing' : 'Academic Probation'}</p>
           </div>
       </div>

       <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-black mb-3 pb-1">Academic Progress</h3>
          <div className="w-full bg-gray-200 h-6 border border-black relative">
             <div className="bg-black h-full print:bg-black" style={{ width: `${Math.min(100, Math.max(0, (student.creditsComp / student.creditsReq) * 100))}%` }}></div>
          </div>
          <p className="text-right text-sm mt-1 font-bold">{Math.round((student.creditsComp / student.creditsReq) * 100)}% Completed</p>
       </div>

       <div className="mb-8">
           <h3 className="text-lg font-bold border-b border-black mb-3 pb-1">Requirement Breakdown</h3>
           <table className="w-full text-left border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100 border-b border-black print:bg-gray-100">
                   <th className="p-3 border-r border-black uppercase text-sm font-bold">Requirement Area</th>
                   <th className="p-3 border-r border-black uppercase text-sm text-center font-bold">Required (Cr)</th>
                   <th className="p-3 border-r border-black uppercase text-sm text-center font-bold">Completed</th>
                   <th className="p-3 border-r border-black uppercase text-sm text-center font-bold">Remaining</th>
                   <th className="p-3 uppercase text-sm text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req, i) => {
                  const remaining = Math.max(0, req.req - req.comp);
                  return (
                    <tr key={i} className="border-b border-black text-sm">
                       <td className="p-3 border-r border-black font-medium">{req.area}</td>
                       <td className="p-3 border-r border-black text-center">{req.req}</td>
                       <td className="p-3 border-r border-black text-center">{req.comp}</td>
                       <td className={`p-3 border-r border-black text-center font-bold ${remaining > 0 ? 'print:text-red-600' : ''}`}>
                          {remaining}
                       </td>
                       <td className={`p-3 font-bold uppercase text-center ${remaining === 0 ? 'print:text-emerald-700' : 'text-gray-500'}`}>
                          {remaining === 0 ? 'Met' : 'Pending'}
                       </td>
                    </tr>
                  )
                })}
              </tbody>
           </table>
       </div>

       <div className="mb-8">
           <h3 className="text-lg font-bold border-b border-black mb-3 pb-1">Completed Courses</h3>
           <table className="w-full text-left border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100 border-b border-black print:bg-gray-100">
                   <th className="p-2 border-r border-black font-bold text-sm">Course Code</th>
                   <th className="p-2 border-r border-black font-bold text-sm">Course Title</th>
                   <th className="p-2 border-r border-black font-bold text-sm text-center">Credits</th>
                   <th className="p-2 border-r border-black font-bold text-sm text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {COMPLETED_COURSES.map((course, i) => (
                  <tr key={i} className="border-b border-black text-sm">
                     <td className="p-2 border-r border-black">{course.code}</td>
                     <td className="p-2 border-r border-black">{course.title}</td>
                     <td className="p-2 border-r border-black text-center">{course.credits}</td>
                     <td className="p-2 border-r border-black text-center">{course.grade}</td>
                  </tr>
                ))}
              </tbody>
           </table>
       </div>


       <div className="mt-16 pt-4 border-t border-gray-400 text-center text-xs text-gray-500">
           <p>This document is an unofficial web printout. For an official transcript or certification of degree requirements, please contact the Registrar's Office.</p>
           <p className="mt-1 font-mono text-[10px]">Report ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} - {new Date().toISOString()}</p>
       </div>
    </div>
  );
}
