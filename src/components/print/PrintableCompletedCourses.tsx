import React from 'react';
import { useAppStore } from '../../store';
import { getStudentData } from '../../data';

export function PrintableCompletedCourses({ courses }: { courses: any }) {
  const { currentStudentId } = useAppStore();
  const student = getStudentData(currentStudentId).profile;

  return (
    <div className="hidden print:block font-serif text-black bg-white w-full print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
       <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider print:text-black">University Portal</h1>
            <h2 className="text-xl font-bold mb-1 print:text-black">Completed Courses Summary</h2>
            <p className="text-sm print:text-gray-600 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8 border border-black p-4">
            <div>
               <p><span className="font-bold">Student Name:</span> {student.name}</p>
               <p><span className="font-bold">Student ID:</span> {student.id}</p>
            </div>
            <div className="text-right">
               <p><span className="font-bold">Program:</span> {student.program}</p>
               <p><span className="font-bold">Credits Completed:</span> {courses.reduce((sum: number, c: any) => sum + c.credits, 0)}</p>
            </div>
       </div>

       <div className="mb-8">
            <table className="w-full text-left border-collapse border border-black">
               <thead>
                 <tr className="bg-gray-100 border-b border-black print:bg-gray-100">
                    <th className="p-2 border-r border-black font-bold text-sm">Course Code</th>
                    <th className="p-2 border-r border-black font-bold text-sm">Course Title</th>
                    <th className="p-2 border-r border-black font-bold text-sm text-center">Cr</th>
                    <th className="p-2 border-r border-black font-bold text-sm text-center">Grade</th>
                    <th className="p-2 font-bold text-sm text-center">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {courses.map((course: any, i: number) => (
                   <tr key={i} className="border-b border-black text-sm">
                      <td className="p-2 border-r border-black">{course.code}</td>
                      <td className="p-2 border-r border-black">{course.title}</td>
                      <td className="p-2 border-r border-black text-center">{course.credits}</td>
                      <td className="p-2 border-r border-black text-center font-bold">{course.grade}</td>
                      <td className="p-2 text-center text-xs uppercase font-bold text-emerald-700 print:text-emerald-700">Completed</td>
                   </tr>
                 ))}
               </tbody>
            </table>
       </div>

       <div className="mt-16 pt-4 border-t border-gray-400 text-center text-xs text-gray-500">
            <p>This document is a computer-generated summary and does not serve as an official transcript.</p>
            <p className="mt-1 font-mono text-[10px]">Report ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} - {new Date().toISOString()}</p>
       </div>
    </div>
  );
}
