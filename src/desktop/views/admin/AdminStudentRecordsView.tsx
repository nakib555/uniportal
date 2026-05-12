import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Search, Filter, MoreVertical, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { STUDENT_DATA } from '../../../data';

export function AdminStudentRecordsView() {
  const [search, setSearch] = useState('');
  
  const mockStudents = [
    { id: '21104104', name: 'Al Ibrahim', program: 'BSc in CSE', cgpa: 3.82, status: 'Regular' },
    { id: '21104105', name: 'Sarah Ahmed', program: 'BSc in SWE', cgpa: 3.91, status: 'Regular' },
    { id: '21104106', name: 'Fahim Rahman', program: 'BSc in CSE', cgpa: 2.85, status: 'Probation' },
    { id: '21104107', name: 'Nusrat Jahan', program: 'BSc in CIS', cgpa: 3.45, status: 'Regular' },
    { id: '21104108', name: 'Rafiq Islam', program: 'BSc in CSE', cgpa: 3.12, status: 'Irregular' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Student Records</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage student academic records and statuses.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-stone-200 dark:border-stone-800">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex gap-4 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
            />
          </div>
          <button className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-xs border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {mockStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)).map((student, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-stone-900 dark:text-stone-100">{student.id}</td>
                  <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{student.name}</td>
                  <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{student.program}</td>
                  <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{student.cgpa.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={student.status === 'Regular' ? 'success' : student.status === 'Probation' ? 'danger' : 'warning'}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-stone-400 hover:text-[#8c1515] hover:bg-[#8c1515]/10 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
