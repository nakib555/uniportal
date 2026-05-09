import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, GraduationCap, MapPin, TrendingUp, Wallet, Users } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { usePortalLogic } from '../../hooks/usePortalLogic';

export function HomeView({ portal }: { portal: ReturnType<typeof usePortalLogic> }) {
  const { student, bankSlipTotal, handleNavClick } = portal;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CGPA', value: student.cgpa, sub: 'Out of 4.0', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Credits Completed', value: student.creditsCompleted, sub: 'Total 124 required', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Upcoming Classes', value: '3', sub: 'Today', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Due Payment', value: `৳${bankSlipTotal}`, sub: 'For this semester', icon: Wallet, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5 flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-stone-500 font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-stone-900 dark:text-white leading-tight mb-0.5">{stat.value}</p>
                <p className="text-xs text-stone-400">{stat.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#8c1515]" /> Today's Schedule
              </h3>
              <button 
                onClick={() => portal.store.setActiveTab('class-schedule')}
                className="text-sm font-medium text-[#8c1515] hover:underline"
              >
                View Full Schedule
              </button>
            </div>
            
            <div className="space-y-4">
              {portal.filteredSchedule.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 hover:border-stone-200 dark:hover:border-stone-700 transition-colors">
                  <div className="w-[100px] shrink-0 text-center py-2 px-3 bg-white dark:bg-stone-900 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800">
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.start}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{item.end}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 truncate">{item.courseCode}</h4>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">{item.title}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room {item.room}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Sect {item.section}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#8c1515]" /> Academic Progress
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Total Credits</span>
                  <span className="text-sm font-bold">{student.creditsCompleted} / 124</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(student.creditsCompleted / 124) * 100}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Major Core</span>
                  <span className="text-sm font-bold">45 / 60</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Electives</span>
                  <span className="text-sm font-bold">12 / 24</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => portal.store.setActiveTab('completed-courses')}
              className="mt-6 w-full py-2.5 text-sm font-medium text-[#8c1515] border border-[#8c1515]/20 hover:bg-[#8c1515]/5 rounded-lg transition-colors"
            >
              View Full Audit
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
