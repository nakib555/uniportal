import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store';
import { BookMarked, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

export const RegisteredCoursesView: React.FC = () => {
  const { registeredCourses, setRegisteredCourses, isSelectionLocked, setActiveTab } = useAppStore();

  const [courseToDrop, setCourseToDrop] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const confirmDrop = () => {
    if (!courseToDrop) return;
    
    if (isSelectionLocked) {
      setErrorMsg(`Course selection is locked for this semester.`);
      setCourseToDrop(null);
      return;
    }

    // Check if dropping this course breaks corequisite rules for other registered courses
    const brokenCoreqCourse = registeredCourses.find(c => c.corequisites?.includes(courseToDrop));
    if (brokenCoreqCourse) {
      setErrorMsg(`Cannot drop ${courseToDrop} because it is a co-requisite for ${brokenCoreqCourse.code}.`);
      setCourseToDrop(null);
      return;
    }
    
    setRegisteredCourses(registeredCourses.filter(c => c.code !== courseToDrop));
    setCourseToDrop(null);
  };

  const handleDropCourse = (courseCode: string) => {
    setCourseToDrop(courseCode);
  };

  return (
    <>
      <Dialog open={!!courseToDrop} onOpenChange={(open) => !open && setCourseToDrop(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to drop course {courseToDrop}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={confirmDrop}>Drop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!errorMsg} onOpenChange={(open) => !open && setErrorMsg(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <DialogTitle>Action Prevented</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {errorMsg}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorMsg(null)}>Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {registeredCourses.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center bg-stone-50/50 dark:bg-stone-900/50 border-dashed border-2 dark:border-stone-800">
           <BookMarked className="w-12 h-12 text-stone-300 dark:text-stone-600 mb-4" />
           <h4 className="text-lg font-bold text-stone-700 dark:text-stone-300">No courses registered</h4>
           <p className="text-stone-500 dark:text-stone-400 mt-1 max-w-sm">You haven't registered for any classes yet. Head to "Course Enrollment" to add courses.</p>
           <button onClick={() => setActiveTab("available-courses")} className="mt-6 bg-[#8c1515] dark:bg-[#ef4444] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#6b0f0f] dark:hover:bg-[#dc2626] transition-all">Go to Enrollment</button>
        </Card>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredCourses.map((c, i) => (
            <Card key={i} className="p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:shadow-md transition-shadow hover:-translate-y-1">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <Badge variant="outline" className="font-mono bg-stone-50 dark:bg-stone-950 px-2 py-0.5 text-[10px]">{c.code}</Badge>
                     <span className="text-xs font-bold text-stone-500 dark:text-stone-400 font-mono text-right shrink-0 ml-2">{c.credits.toFixed(2)} Cr</span>
                  </div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug line-clamp-2" title={c.title}>{c.title}</h4>
               </div>
               
               <div className="flex items-end justify-between mt-4">
                  <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex flex-col gap-0.5">
                     <span>Sec: <span className="font-bold text-stone-700 dark:text-stone-300">{c.section}</span></span>
                     <span className="truncate max-w-[120px]" title={c.faculty}>Prof: <span className="font-bold text-stone-700 dark:text-stone-300">{c.faculty}</span></span>
                  </div>
                  <button 
                    onClick={() => handleDropCourse(c.code)} 
                    disabled={isSelectionLocked} 
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors shrink-0 ${isSelectionLocked ? 'bg-stone-50 dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800 cursor-not-allowed' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50'}`}
                  >
                    Drop
                  </button>
               </div>
            </Card>
          ))}
        </div>
        </>
      )}
    </>
  );
};
