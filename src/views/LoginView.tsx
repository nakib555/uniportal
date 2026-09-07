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
import { PortalSyncService, PuSyncService } from '../services/puSyncService';
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
      setSyncStatus('Connecting to the University Portal...');
      const syncResult = await PortalSyncService.syncWithUniversity(cleanId, cleanPass);
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
      setError(err?.message || 'Authentication error with the University Portal');
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
      setSyncStatus('Connecting to the University Portal...');
      await new Promise(r => setTimeout(r, 400));
      
      setSyncStatus('Fetching academic records & schedules...');
      const syncResult = await PortalSyncService.syncWithUniversity(cleanId, password);

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
      setError(err?.message || 'Authentication error with the University Portal');
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
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-14 bg-[#7a121d] text-white overflow-hidden select-none">
        {/* Subtle graduation background pattern / silhouettes */}
        <div className="absolute inset-0 z-0 opacity-15 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
            alt="Graduation celebration" 
            className="object-cover w-full h-full mix-blend-luminosity" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#7a121d]/90 via-[#7a121d] to-[#600a12] z-0"></div>

        {/* Top-left: University Logo */}
        <div className="relative z-10 flex items-center">
          <img 
            src="/pu.png" 
            alt="Presidency University" 
            className="h-16 lg:h-20 w-auto object-contain drop-shadow-md brightness-0 invert" 
          />
        </div>

        {/* Middle/Bottom: Typography & Value proposition */}
        <div className="relative z-10 max-w-lg mt-auto mb-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="text-xs font-extrabold tracking-[0.2em] uppercase text-white/80 mb-3">
              UNIVERSITY PORTAL
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12] mb-4">
              Your academic journey, <br />
              <span className="text-white">simplified.</span>
            </h1>
            <p className="text-white/85 text-sm lg:text-base leading-relaxed mb-8 max-w-md font-normal">
              Access your courses, grades, statements, and campus resources all in one secure place.
            </p>
          </motion.div>

          {/* Social Proof */}
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-2.5">
              <img className="w-10 h-10 rounded-full border-2 border-[#7a121d] object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-[#7a121d] object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-[#7a121d] object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-[#7a121d] object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
              </div>
              <span className="text-xs font-bold text-white/95 mt-0.5">Trusted by 10,000+ students</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-xs font-normal">
          &copy; {new Date().getFullYear()} University Name. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#faf9f8] dark:bg-stone-950 relative">
        {/* Mobile Header Logo */}
        <div className="lg:hidden absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <img src="/pu.png" alt="University Logo" className="h-12 w-auto object-contain" />
        </div>

        <div className="w-full max-w-[420px] pt-14 lg:pt-0">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
            <h2 className="text-3xl lg:text-[34px] font-black text-stone-900 dark:text-white tracking-tight mb-2">
              University Portal
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-normal">
              Please enter your credentials to access your dashboard.
            </p>
          </motion.div>

          {/* Role selector pill */}
          <div className="flex bg-[#edeae5] dark:bg-stone-800 p-1 rounded-full mb-7 max-w-[280px] mx-auto shadow-xs">
            <button 
              onClick={() => { setLoginType('student'); setError(''); }}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-full transition-all ${
                loginType === 'student' 
                  ? 'bg-white dark:bg-stone-700 shadow-xs text-[#7a121d] dark:text-rose-400' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => { setIsComingSoonOpen(true); }}
              className="flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-all text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center gap-1.5"
            >
              <span>Admin/Faculty</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 tracking-wider">
                SOON
              </span>
            </button>
          </div>

          <Card className="p-7 sm:p-8 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-stone-200/40 dark:shadow-none rounded-3xl relative overflow-hidden text-stone-900 dark:text-white">
            <form onSubmit={handleLogin} className="space-y-4">
              <AnimatePresence mode="wait">
                {showAutoLogoutMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 p-3.5 rounded-xl text-xs font-medium border border-amber-200/60 dark:border-amber-500/20 flex gap-2.5 items-start text-left"
                  >
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900 dark:text-amber-200">Session Expired</p>
                      <p className="text-amber-700 dark:text-amber-400/90 mt-0.5">You have been logged out after 30 minutes of session duration.</p>
                    </div>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-rose-50 dark:bg-rose-500/10 text-[#7a121d] dark:text-rose-400 p-3 rounded-xl text-xs font-bold border border-rose-200/70 dark:border-rose-500/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Student ID field */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="student-id-input" className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {loginType === 'student' ? 'Student ID' : 'Faculty/Admin ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="student-id-input"
                    name="username"
                    type="text"
                    value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setShowHints(true); }}
                    onFocus={() => setShowHints(true)}
                    onBlur={() => setTimeout(() => setShowHints(false), 200)}
                    className="w-full bg-[#f8f7f5] dark:bg-stone-950/60 border border-[#7a121d]/40 dark:border-rose-500/40 focus:border-[#7a121d] dark:focus:border-rose-500 rounded-xl py-2.5 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a121d]/10 dark:focus:ring-rose-500/20 transition-all font-medium"
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
                            className="px-4 py-2.5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-stone-900 dark:text-white">{hint.id}</div>
                              <div className="text-[11px] text-stone-500">{hint.label}</div>
                            </div>
                            <div className="text-[10px] font-semibold text-[#7a121d] dark:text-rose-400 bg-[#7a121d]/10 dark:bg-rose-500/10 px-2 py-0.5 rounded">
                              Auto-fill
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label htmlFor="student-password-input" className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsForgotOpen(true)} 
                    className="text-xs font-bold text-[#7a121d] dark:text-rose-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="student-password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f8f7f5] dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 focus:border-[#7a121d] dark:focus:border-rose-500 rounded-xl py-2.5 pl-10 pr-11 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a121d]/10 dark:focus:ring-rose-500/20 transition-all font-medium"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {syncStatus && (
                <div className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7a121d] dark:text-rose-400" />
                  {syncStatus}
                </div>
              )}

              {/* Submit CTA button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#780d1e] hover:bg-[#630b19] active:scale-[0.99] text-white py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#780d1e]/20 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing Portal Data...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Sync Portal</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>

          {/* Need help footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Need help? Contact{' '}
              <button 
                type="button" 
                onClick={() => setIsSupportOpen(true)} 
                className="text-[#780d1e] dark:text-rose-400 font-bold hover:underline"
              >
                IT Support
              </button>
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};
