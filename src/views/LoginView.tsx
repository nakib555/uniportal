import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Card } from '../components/ui/card';
import { Loader2, Lock, User, Eye, EyeOff, ChevronRight, CheckCircle2, RefreshCw, Clock, Sparkles } from 'lucide-react';
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
import { PuSyncService } from '../services/puSyncService';
import { tempAuthService } from '../services/tempAuthService';

export const LoginView: React.FC = () => {
  const { setIsLoggedIn, setIsAdmin, setRegisteredCourses, setCompletedCourses } = useAppStore();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [error, setError] = useState('');
  const [showHints, setShowHints] = useState(false);
  
  // Forgot Password state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const executePortalSync = async (targetId: string, targetPass: string) => {
    const cleanId = targetId.trim();
    const cleanPass = targetPass.trim();
    if (!cleanId || !cleanPass) return;

    setIsLoading(true);
    setError('');

    try {
      setSyncStatus('Connecting to Presidency University SIMS...');
      const syncResult = await PuSyncService.syncWithPresidency(cleanId, cleanPass);
      setSyncStatus('Synchronizing courses & financial ledger...');
      
      if (syncResult.success && syncResult.studentData) {
        tempAuthService.setTempCredentials(cleanId, cleanPass);
        setRegisteredCourses(syncResult.studentData.registeredCourses);
        setCompletedCourses(syncResult.studentData.completedCourses);
        useAppStore.getState().setCurrentStudentId(cleanId);
        setIsAdmin(false);
        useAppStore.getState().setActiveTab('home');
        setIsLoggedIn(true);
      } else {
        setError(syncResult.message || 'Unable to synchronize student portal records.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error with Presidency SIMS');
    } finally {
      setIsLoading(false);
      setSyncStatus('');
    }
  };

  
  // IT Support state
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Admin/Faculty Coming Soon state
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const [showAutoLogoutMsg, setShowAutoLogoutMsg] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const isAuto = localStorage.getItem('pu_auto_logged_out') === 'true';
      if (isAuto) {
        localStorage.removeItem('pu_auto_logged_out');
        return true;
      }
    }
    return false;
  });

  const hints = loginType === 'student' 
    ? []
    : [{ id: 'admin', label: 'University Administrator', pass: 'admin' }];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please enter your credentials.');
      return;
    }

    setIsLoading(true);
    setError('');

    const isUserAdmin = loginType === 'admin';
    
    if (isUserAdmin) {
      setTimeout(() => {
        setIsLoading(false);
        if (studentId.toLowerCase() !== 'admin' || password !== 'admin') {
          setError('Invalid admin credentials. Use ID "admin" and Password "admin".');
          return;
        }
        setIsAdmin(true);
        useAppStore.getState().setCurrentStudentId(null);
        useAppStore.getState().setActiveTab('admin-dashboard');
        setIsLoggedIn(true);
      }, 600);
      return;
    }

    const cleanId = studentId.trim();
    const isNumeric = /^\d+$/.test(cleanId);
    
    if (!isNumeric) {
      setError('Invalid student credentials. Please enter a valid numeric Student ID.');
      setIsLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      setSyncStatus('Connecting to Presidency University SIMS...');
      await new Promise(r => setTimeout(r, 400));
      
      setSyncStatus('Fetching academic records & schedules...');
      const syncResult = await PuSyncService.syncWithPresidency(cleanId, password);

      setSyncStatus('Synchronizing courses & financial ledger...');
      await new Promise(r => setTimeout(r, 300));

      if (syncResult.success && syncResult.studentData) {
        // Save temporary credentials for current active session for lazy fetching (Admit card, etc.)
        tempAuthService.setTempCredentials(cleanId, password);
        setRegisteredCourses(syncResult.studentData.registeredCourses);
        setCompletedCourses(syncResult.studentData.completedCourses);
        useAppStore.getState().setCurrentStudentId(cleanId);
        setIsAdmin(false);
        useAppStore.getState().setActiveTab('home');
        setIsLoggedIn(true);

        // Non-blocking background prefetch for Exam Routine & Admit Card
        PuSyncService.fetchAdmitCardOnly(cleanId, password).catch((err) => {
          console.warn('[LoginView] Background exam prefetch error:', err?.message || err);
        });
      } else {
        setError(syncResult.message || 'Unable to synchronize student portal records.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error with Presidency SIMS');
    } finally {
      setIsLoading(false);
      setSyncStatus('');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Dialog open={isForgotOpen} onOpenChange={(open) => {
        setIsForgotOpen(open);
        if (!open) {
          setTimeout(() => setResetSent(false), 200);
          setResetEmail('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {resetSent 
                ? "If an account matches that email address, a password reset link has been sent."
                : "Enter your registered email address or student ID and we will send you a password reset link."}
            </DialogDescription>
          </DialogHeader>
          
          {resetSent ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-medium text-stone-900 dark:text-white">Check your email</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="reset-account-input" className="text-sm font-semibold">Email or Student ID</label>
                <input 
                  id="reset-account-input"
                  name="username"
                  type="text"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. Student ID or registered email"
                  autoComplete="username"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={!resetEmail || isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send Reset Link
                </Button>
              </DialogFooter>
            </form>
          )}
          {resetSent && (
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>
                Close
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>IT Support</DialogTitle>
            <DialogDescription>
              For technical assistance, please contact or visit Room 501 (Computer Lab).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-left">
            <div className="mx-auto sm:mx-0 w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-black text-stone-900 dark:text-white">
              Admin & Faculty Portal
            </DialogTitle>
            <DialogDescription className="text-stone-600 dark:text-stone-400 text-sm mt-1 leading-relaxed">
              The Admin & Faculty portal module is currently under active development and will be available soon. Please use the Student login to access student records, grades, class schedules, and accounts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose render={<Button className="w-full sm:w-auto bg-[#8c1515] hover:bg-[#731010] text-white" />}>
              Got It
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Left side: branding & image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 bg-[#8c1515] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 select-none pointer-events-none">
           <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" alt="Campus" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8c1515] via-[#8c1515]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbDItMi0ydjJIMzZ6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] z-0"></div>

        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <img src="https://wsrv.nl/?url=http://www.sims.pu.edu.bd/img/layout/header_logo.png&output=webp" alt="PU" className="h-28 w-auto object-contain brightness-0 invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>

        <div className="relative z-10 max-w-md">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-2xl font-black tracking-widest uppercase mb-4 text-[#ffcfcf]">University Portal</h1>
              <h2 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-white">Your academic journey, <br/><span className="text-[#ffcfcf]">simplified.</span></h2>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-8">Access your courses, grades, statements, and campus resources all in one secure place.</p>
           </motion.div>
           
           <div className="flex gap-4">
             <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                   <img key={i} className="w-12 h-12 rounded-full border-2 border-[#8c1515] shadow-sm" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`Student ${i}`} loading="lazy" />
                ))}
             </div>
             <div className="flex flex-col justify-center">
               <div className="flex items-center gap-1 text-yellow-300">
                  {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
               </div>
               <span className="text-sm font-bold text-white/90">Trusted by 10,000+ students</span>
             </div>
           </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm font-medium mt-12">
          &copy; {new Date().getFullYear()} University Name. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative pt-24 sm:pt-32">
         <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 lg:hidden">
            <img src="https://wsrv.nl/?url=http://www.sims.pu.edu.bd/img/layout/header_logo.png&output=webp" alt="PU" className="h-16 w-auto object-contain dark:brightness-0 dark:invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
         </div>

         <div className="w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
               <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-3">University Portal</h1>
               <p className="text-stone-500 dark:text-stone-400 font-medium">Please enter your credentials to access your dashboard.</p>
            </motion.div>

            <div className="flex bg-stone-100 dark:bg-stone-800/50 p-1 rounded-xl mb-8 relative z-10 w-full md:w-3/4 mx-auto">
               <button 
                  onClick={() => { setLoginType('student'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'student' ? 'bg-white dark:bg-stone-700 shadow-sm text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'}`}
               >
                  Student
               </button>
               <button 
                  type="button"
                  onClick={() => { setIsComingSoonOpen(true); }}
                  className="flex-1 py-2 text-sm font-bold rounded-lg transition-all text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 flex items-center justify-center gap-1.5"
               >
                  <span>Admin/Faculty</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 tracking-wider">Soon</span>
               </button>
            </div>

            <Card className="p-6 sm:p-8 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/20 dark:shadow-black/40 backdrop-blur-sm rounded-2xl lg:rounded-3xl relative overflow-hidden text-stone-900 dark:text-white">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-stone-100 dark:bg-stone-800 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-tr-full -ml-12 -mb-12 opacity-50 pointer-events-none" />

               <form onSubmit={handleLogin} className="relative z-10 space-y-5">
                  <AnimatePresence mode="wait">
                     {showAutoLogoutMsg && (
                        <motion.div
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 p-3.5 sm:p-4 rounded-xl text-sm font-semibold border border-amber-100 dark:border-amber-500/20 flex gap-2.5 items-start text-left"
                        >
                           <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                           <div>
                              <p className="font-bold text-amber-900 dark:text-amber-200">Session Expired</p>
                              <p className="text-[11px] text-amber-700/90 dark:text-amber-400/85 mt-0.5 leading-relaxed">You have been automatically logged out after 30 minutes of session duration to protect your account security.</p>
                           </div>
                        </motion.div>
                     )}
                     {error && (
                        <motion.div
                           initial={{ opacity: 0, height: 0, scale: 0.95 }}
                           animate={{ opacity: 1, height: 'auto', scale: 1 }}
                           exit={{ opacity: 0, height: 0, scale: 0.95 }}
                           className="bg-red-50 dark:bg-red-500/10 text-[#8c1515] dark:text-red-400 p-3 sm:p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20"
                        >
                           {error}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="space-y-1.5 focus-within:text-[#8c1515] dark:focus-within:text-[#ef4444] transition-colors">
                     <label htmlFor="student-id-input" className="text-sm font-bold text-stone-700 dark:text-stone-300 ml-1">{loginType === 'student' ? 'Student ID' : 'Faculty/Admin ID'}</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <User className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           id="student-id-input"
                           name="username"
                           type="text"
                           value={studentId}
                           onChange={(e) => { setStudentId(e.target.value); setShowHints(true); }}
                           onFocus={() => setShowHints(true)}
                           onBlur={() => setTimeout(() => setShowHints(false), 200)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder={loginType === 'student' ? "Enter your Student ID" : "e.g. admin"}
                           autoComplete="username"
                        />
                        <AnimatePresence>
                           {showHints && hints.filter(h => h.id.toLowerCase().includes(studentId.toLowerCase()) || h.label.toLowerCase().includes(studentId.toLowerCase())).length > 0 && (
                              <motion.div 
                                 initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                 className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl rounded-xl overflow-hidden z-50"
                              >
                                 {hints.filter(h => h.id.toLowerCase().includes(studentId.toLowerCase()) || h.label.toLowerCase().includes(studentId.toLowerCase())).map((hint, idx) => (
                                    <div 
                                       key={idx} 
                                       onClick={() => { setStudentId(hint.id); setPassword(hint.pass); setShowHints(false); }}
                                       className="px-4 py-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                                    >
                                       <div>
                                          <div className="font-bold text-sm text-stone-900 dark:text-white">{hint.id}</div>
                                          <div className="text-xs text-stone-500">{hint.label}</div>
                                       </div>
                                       <div className="text-xs font-semibold text-[#8c1515] dark:text-[#ef4444] bg-[#8c1515]/10 dark:bg-[#ef4444]/10 px-2 py-1 rounded">Auto-fill</div>
                                    </div>
                                 ))}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </div>

                  <div className="space-y-1.5 focus-within:text-[#8c1515] dark:focus-within:text-[#ef4444] transition-colors">
                     <div className="flex items-center justify-between ml-1">
                        <label htmlFor="student-password-input" className="text-sm font-bold text-stone-700 dark:text-stone-300">Password</label>
                        <button type="button" onClick={() => setIsForgotOpen(true)} className="text-xs font-bold text-[#8c1515] dark:text-[#ef4444] hover:underline">Forgot password?</button>
                     </div>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           id="student-password-input"
                           name="password"
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-12 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder="••••••••"
                           autoComplete="current-password"
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors focus:outline-none"
                        >
                           {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                     </div>
                  </div>

                  {syncStatus && (
                     <div className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8c1515] dark:text-[#ef4444]" />
                        {syncStatus}
                     </div>
                  )}

                  <div className="pt-2">
                     <button
                        type="submit"
                        disabled={isLoading}
                        style={{ paddingTop: '12px', paddingBottom: '13px', marginBottom: '-10px' }}
                        className="w-full bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] dark:hover:bg-[#dc2626] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#8c1515]/20 dark:shadow-none"
                     >
                        {isLoading ? (
                           <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Syncing Portal Data...</span>
                           </>
                        ) : (
                           <>
                              Sign In & Sync Portal
                              <ChevronRight className="w-5 h-5" />
                           </>
                        )}
                     </button>
                  </div>
               </form>

               
               <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 text-center">
                  <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                     Need help? Contact <button type="button" onClick={() => setIsSupportOpen(true)} className="text-[#8c1515] dark:text-[#ef4444] font-bold hover:underline">IT Support</button>
                  </p>
               </div>
            </Card>
         </div>
      </div>


    </div>
  );
};
