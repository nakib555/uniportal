import React, { useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { STUDENT_DATA } from '../data';
import { Camera } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profilePic, setProfilePic } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const student = STUDENT_DATA;

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">Profile info</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Your academic and personal records.</p>
      </header>
      
      <Card className="overflow-hidden">
        <div className="h-32 md:h-40 bg-stone-100 dark:bg-stone-800 flex items-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-blend-overlay dark:opacity-80 relative border-b border-stone-200 dark:border-stone-800">
          <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-8 w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-white dark:border-stone-900 bg-white dark:bg-stone-800 shadow-md overflow-hidden z-10 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={profilePic} onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}&backgroundColor=e2e8f0` }} alt="Avatar" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <Camera className="w-8 h-8 text-white" />
            </div>
             <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleProfilePicUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
        
        <div className="pt-20 pb-8 px-6 md:px-8 mt-2 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
             <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">{student.name}</h3>
             <div className="flex gap-2 items-center mt-2">
               <Badge variant="outline" className="font-mono bg-stone-50/50 dark:bg-stone-800/50 text-[11px] px-2">ID: {student.id}</Badge>
               <Badge variant="success" className="capitalize text-[11px] px-2">{student.status}</Badge>
             </div>
             
             <div className="mt-8 space-y-4">
               <div>
                  <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">Program</span>
                 <span className="font-medium text-stone-900 dark:text-stone-100">{student.program}</span>
               </div>
               <div>
                 <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">Admission Semester</span>
                 <span className="font-medium text-stone-900 dark:text-stone-100">{student.admissionSemester}</span>
               </div>
             </div>
           </div>
           
           <div className="md:border-l md:border-stone-100 dark:md:border-stone-800 md:pl-8 flex flex-col justify-center">
              <div className="bg-stone-50 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4">
                 <div>
                   <div className="flex justify-between items-end mb-1">
                     <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">Credits Completed</span>
                     <span className="font-bold text-stone-900 dark:text-stone-100">{student.creditsCompleted} <span className="text-xs font-medium text-stone-400 dark:text-stone-500">/ 140</span></span>
                   </div>
                   <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(student.creditsCompleted/140)*100}%`}}></div>
                   </div>
                 </div>
                 
                 <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center">
                   <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">Current CGPA</span>
                   <span className="text-2xl font-black text-stone-900 dark:text-white">{student.cgpa.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
};
