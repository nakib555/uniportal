import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, MoreVertical, BookOpen, Layers, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

export function AdminCourseManagementView() {
  const [search, setSearch] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<any | null>(null);
  
  // Add course form
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  
  const { coursesData, deleteCourse, toggleCourseStatus, addCourse } = useAppStore();

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete);
      setCourseToDelete(null);
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;
    
    addCourse({
      code: newCode.toUpperCase(),
      title: newTitle,
      credits: newCredits,
      section: 'A',
      enrolled: 0,
      status: 'Active'
    });
    
    setNewCode('');
    setNewTitle('');
    setNewCredits(3);
    setIsAddCourseOpen(false);
  };

  const handleEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseToEdit) {
      setCourseToEdit(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete course {courseToDelete}? This action cannot be undone.
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

      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogContent>
          <form onSubmit={handleAddCourse}>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course in the catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Course Code</label>
                <input 
                  autoFocus
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="e.g. CSE-421"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Course Title</label>
                <input 
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Machine Learning"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Credits</label>
                <input 
                  type="number"
                  min="1" max="6"
                  required
                  value={newCredits}
                  onChange={e => setNewCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Create Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!courseToEdit} onOpenChange={(open) => !open && setCourseToEdit(null)}>
        <DialogContent>
          <form onSubmit={handleEditCourse}>
            <DialogHeader>
              <DialogTitle>Edit Course: {courseToEdit?.code}</DialogTitle>
              <DialogDescription>
                Update the course details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Course Title</label>
                <input 
                  defaultValue={courseToEdit?.title}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Credits</label>
                <input 
                  type="number"
                  min="1" max="6"
                  defaultValue={courseToEdit?.credits}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Course Management</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage course catalog, sections, and allocations.</p>
        </div>
        <button onClick={() => setIsAddCourseOpen(true)} className="bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2">
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
              {coursesData.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-500">No courses found.</td></tr>
              ) : (
                coursesData.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())).map((course, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-stone-900 dark:text-stone-100">{course.code}</td>
                    <td className="px-6 py-4 font-bold text-stone-900 dark:text-stone-100">{course.title}</td>
                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{course.credits}</td>
                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400 font-mono">{course.section}</td>
                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400">{course.enrolled}</td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => toggleCourseStatus(course.code)} title="Click to toggle status">
                      <Badge variant={course.status === 'Active' ? 'success' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setCourseToEdit(course)} className="p-1.5 text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCourseToDelete(course.code)} className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
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
