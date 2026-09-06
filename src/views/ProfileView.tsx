import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, KeyRound, Edit3, CheckCircle2, Camera, TrendingUp, Contact, ShieldCheck, GraduationCap, Calendar } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../hooks/usePortalLogic';
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

import { ProxyImage } from '../components/ProxyImage';

export function ProfileView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const { student, profilePic, updateProfilePhoto } = portal;
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProfilePhoto(reader.result);
          setSuccessMsg('Profile photo updated successfully.');
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Password has been successfully updated.');
    setIsPasswordOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {successMsg && (
        <div className="absolute top-0 right-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 z-10">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {successMsg}
        </div>
      )}

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent>
          <form onSubmit={handleChangePassword}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Ensure your account is using a long, random password to stay secure.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Current Password</label>
                <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">Confirm New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <Card className="overflow-hidden">
        <div className="h-32 relative bg-stone-100" style={{ backgroundImage: 'url(/profile_bg_pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div 
              onClick={handleUploadTrigger}
              className="relative w-[98px] h-[110px] rounded-[10px] border-4 border-white dark:border-stone-900 bg-stone-100 dark:bg-stone-800 shadow-md overflow-hidden cursor-pointer group"
              title="Click to change profile photo"
            >
              <ProxyImage 
                src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name || 'Student'}&backgroundColor=e2e8f0`} 
                fallbackSrc={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name || 'Student'}&backgroundColor=e2e8f0`}
                alt={student.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white mb-1" />
                <span className="text-[10px] text-white font-semibold">Upload</span>
              </div>
            </div>
            <div className="mb-4 text-stone-900">
              <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>{student.name}</h1>
              <p className="opacity-90" style={{ color: '#000000' }}>ID : {student.id}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-24 pb-8 px-8 flex justify-between items-start flex-wrap gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="brand" className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{student.program}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Batch {student.admissionSemester}</span>
            </Badge>
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{student.status}</span>
            </Badge>
          </div>
          <button 
            onClick={handleUploadTrigger}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" /> Change Photo
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-lg mb-6 border-b border-stone-100 dark:border-stone-800 pb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
            <span>Academic Progress</span>
          </h3>
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
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6 border-b border-stone-100 dark:border-stone-800 pb-4 flex items-center gap-2">
            <Contact className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
            <span>Contact Information</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 rounded-lg shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{student.email}</p>
                <p className="text-xs text-stone-500">University Email</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">+880 17XXXXXXXX</p>
                <p className="text-xs text-stone-500">Mobile Number</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6 border-b border-stone-100 dark:border-stone-800 pb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8c1515] dark:text-[#ef4444]" />
            <span>Security</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Password</p>
                <p className="text-xs text-stone-500 mb-2">Last changed 3 months ago</p>
                <button onClick={() => setIsPasswordOpen(true)} className="text-xs font-semibold text-[#8c1515] hover:underline flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
