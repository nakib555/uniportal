import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Search, Filter, MoreVertical, FileText, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

export function AdminStudentRecordsView() {
  const [search, setSearch] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { students, deleteStudent, updateStudentStatus } = useAppStore();

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              {students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)).length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">No students found.</td></tr>
              ) : (
                students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)).map((student, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-stone-900 dark:text-stone-100">{student.id}</td>
                    <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{student.name}</td>
                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{student.program}</td>
                    <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{student.cgpa.toFixed(2)}</td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => updateStudentStatus(student.id, student.status === 'Regular' ? 'Probation' : student.status === 'Probation' ? 'Irregular' : 'Regular')} title="Click to toggle status">
                      <Badge variant={student.status === 'Regular' ? 'success' : student.status === 'Probation' ? 'danger' : 'warning'}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setStudentToDelete(student.id)} className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Delete Student">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-stone-400 hover:text-[#8c1515] hover:bg-[#8c1515]/10 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
