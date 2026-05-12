import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Search, Plus, MoreVertical, BookOpen, Layers, Edit2, Trash2 } from 'lucide-react';

export function AdminCourseManagementView() {
  const [search, setSearch] = useState('');
  
  const mockCourses = [
    { code: 'CSE-101', title: 'Introduction to Computer Science', credits: 3, section: 'A, B, C', enrolled: 120, status: 'Active' },
    { code: 'CSE-102', title: 'Programming Language I', credits: 3, section: 'A, B', enrolled: 85, status: 'Active' },
    { code: 'CSE-201', title: 'Data Structures', credits: 3, section: 'A', enrolled: 45, status: 'Active' },
    { code: 'CSE-305', title: 'Software Engineering', credits: 3, section: 'A, B', enrolled: 72, status: 'Active' },
    { code: 'MAT-101', title: 'Differential Calculus', credits: 3, section: 'A, B, C, D', enrolled: 150, status: 'Active' },
    { code: 'PHY-101', title: 'Physics I', credits: 3, section: 'A, B', enrolled: 90, status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Course Management</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage course catalog, sections, and allocations.</p>
        </div>
        <button className="bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
               <BookOpen className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total Courses</p>
               <p className="text-2xl font-black text-stone-900 dark:text-white">124</p>
            </div>
         </Card>
         <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
               <Layers className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Active Sections</p>
               <p className="text-2xl font-black text-stone-900 dark:text-white">312</p>
            </div>
         </Card>
      </div>

      <Card className="p-0 overflow-hidden border-stone-200 dark:border-stone-800">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex gap-4 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-xs border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="px-6 py-4">Course Code</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Sections</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {mockCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())).map((course, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-stone-900 dark:text-stone-100">{course.code}</td>
                  <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{course.title}</td>
                  <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{course.credits}</td>
                  <td className="px-6 py-4 text-stone-600 dark:text-stone-400 font-mono">{course.section}</td>
                  <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{course.enrolled}</td>
                  <td className="px-6 py-4">
                    <Badge variant={course.status === 'Active' ? 'success' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
