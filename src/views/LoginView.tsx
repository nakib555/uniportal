import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Card } from '../components/ui/Card';
import { Loader2, Lock, User, Eye, EyeOff, ChevronRight, CheckCircle2 } from 'lucide-react';
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

export const LoginView: React.FC = () => {
  const { setIsLoggedIn, setIsAdmin } = useAppStore();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please enter your credentials.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call and validation
    setTimeout(() => {
      setIsLoading(false);
      const isUserAdmin = loginType === 'admin';
      
      // Basic validation
      if (isUserAdmin && (studentId !== 'admin' || password !== 'admin')) {
        setError('Invalid credentials. Use "admin" for both Admin ID and Password. (Use "class" for Student login)');
        return;
      }
      
      if (!isUserAdmin && (studentId !== 'class' || password !== 'class')) {
        setError('Invalid credentials. Use "class" for both Student ID and Password. (Use "admin" for Admin login)');
        return;
      }

      setIsAdmin(isUserAdmin);
      useAppStore.getState().setActiveTab(isUserAdmin ? 'admin-dashboard' : 'home');
      setIsLoggedIn(true);
    }, 1500);
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
                <label className="text-sm font-semibold">Email or Student ID</label>
                <input 
                  type="text"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. 21104104 or user@pu.edu.bd"
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
      {/* Left side: branding & image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#8c1515] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 select-none pointer-events-none">
           <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" alt="Campus" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8c1515] via-[#8c1515]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbDItMi0ydjJIMzZ6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] z-0"></div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="https://wsrv.nl/?url=http://www.sims.pu.edu.bd/img/layout/header_logo.png&output=webp" alt="PU" className="h-10 w-auto object-contain brightness-0 invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-white">University Portal</h1>
            <p className="text-white/80 font-medium text-sm mt-0.5">Student Information System</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-white">Your academic journey, <br/><span className="text-[#ffcfcf]">simplified.</span></h2>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-8">Access your courses, grades, statements, and campus resources all in one secure place.</p>
           </motion.div>
           
           <div className="flex gap-4">
             <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                   <img key={i} className="w-12 h-12 rounded-full border-2 border-[#8c1515] shadow-sm" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`Student ${i}`} />
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
        
        <div className="relative z-10 text-white/60 text-sm font-medium">
          &copy; {new Date().getFullYear()} University Name. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
         <div className="absolute top-6 right-6 lg:hidden flex items-center gap-2">
            <img src="https://wsrv.nl/?url=http://www.sims.pu.edu.bd/img/layout/header_logo.png&output=webp" alt="PU" className="h-8 w-auto object-contain dark:brightness-0 dark:invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-bold text-stone-900 dark:text-white tracking-tight">Portal</span>
         </div>

         <div className="w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center lg:text-left">
               <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-3">Sign in</h2>
               <p className="text-stone-500 dark:text-stone-400 font-medium">Please enter your credentials to access your dashboard.</p>
            </motion.div>

            <div className="flex bg-stone-100 dark:bg-stone-800/50 p-1 rounded-xl mb-8 relative z-10 w-full md:w-3/4 mx-auto lg:mx-0">
               <button 
                  onClick={() => { setLoginType('student'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'student' ? 'bg-white dark:bg-stone-700 shadow-sm text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'}`}
               >
                  Student
               </button>
               <button 
                  onClick={() => { setLoginType('admin'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'admin' ? 'bg-white dark:bg-stone-700 shadow-sm text-[#8c1515] dark:text-[#ef4444]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'}`}
               >
                  Admin/Faculty
               </button>
            </div>

            <Card className="p-6 sm:p-8 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/20 dark:shadow-black/40 backdrop-blur-sm rounded-2xl lg:rounded-3xl relative overflow-hidden text-stone-900 dark:text-white">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-stone-100 dark:bg-stone-800 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-tr-full -ml-12 -mb-12 opacity-50 pointer-events-none" />

               <form onSubmit={handleLogin} className="relative z-10 space-y-5">
                  <AnimatePresence mode="wait">
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
                     <label className="text-sm font-bold text-stone-700 dark:text-stone-300 ml-1">{loginType === 'student' ? 'Student ID' : 'Faculty/Admin ID'}</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <User className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           type="text"
                           value={studentId}
                           onChange={(e) => setStudentId(e.target.value)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder={loginType === 'student' ? "e.g. 21104104" : "e.g. FAC-2098"}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5 focus-within:text-[#8c1515] dark:focus-within:text-[#ef4444] transition-colors">
                     <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Password</label>
                        <button type="button" onClick={() => setIsForgotOpen(true)} className="text-xs font-bold text-[#8c1515] dark:text-[#ef4444] hover:underline">Forgot password?</button>
                     </div>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-12 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder="••••••••"
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

                  <div className="pt-2">
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] dark:hover:bg-[#dc2626] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-[#8c1515]/20 dark:shadow-none"
                     >
                        {isLoading ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                           <>
                              Sign In
                              <ChevronRight className="w-5 h-5" />
                           </>
                        )}
                     </button>
                  </div>
               </form>
               
               <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
                  <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                     Need help? Contact <a href="#" className="text-[#8c1515] dark:text-[#ef4444] font-bold hover:underline">IT Support</a>
                  </p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};
