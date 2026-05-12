import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Card } from '../components/ui/Card';
import { Loader2, Lock, User, GraduationCap, ChevronRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setIsLoggedIn, isDarkMode } = useAppStore();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please enter both Student ID and Password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Accept any input for demo purposes
      setIsLoggedIn(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-50 dark:bg-stone-950">
      {/* Left side: branding & image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#8c1515] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 select-none pointer-events-none">
           <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" alt="Campus" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8c1515] via-[#8c1515]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbDItMi0ydjJIMzZ6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] z-0"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-[#8c1515]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">University Portal</h1>
            <p className="text-white/80 font-medium text-sm mt-0.5">Student Information System</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1]">Your academic journey, <br/><span className="text-[#ffcfcf]">simplified.</span></h2>
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
            <div className="w-8 h-8 bg-[#8c1515] rounded-lg flex items-center justify-center">
               <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-stone-900 dark:text-white tracking-tight">Portal</span>
         </div>

         <div className="w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center lg:text-left">
               <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-3">Welcome back</h2>
               <p className="text-stone-500 dark:text-stone-400 font-medium">Please enter your Student ID and password to access your dashboard.</p>
            </motion.div>

            <Card className="p-6 sm:p-8 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/20 dark:shadow-black/40 backdrop-blur-sm rounded-2xl lg:rounded-3xl relative overflow-hidden">
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
                     <label className="text-sm font-bold text-stone-700 dark:text-stone-300 ml-1">Student ID</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <User className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           type="text"
                           value={studentId}
                           onChange={(e) => setStudentId(e.target.value)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder="e.g. 21104104"
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5 focus-within:text-[#8c1515] dark:focus-within:text-[#ef4444] transition-colors">
                     <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Password</label>
                        <a href="#" className="text-xs font-bold text-[#8c1515] dark:text-[#ef4444] hover:underline">Forgot password?</a>
                     </div>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder="••••••••"
                        />
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
