import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Sparkles, Sliders, Plus, Minus, RotateCcw, 
  HelpCircle, Activity, Gauge, BookOpen, Hourglass, 
  Layout, Smartphone, Monitor, CheckCircle, Info, Flame
} from 'lucide-react';

interface ClassDistributionViewProps {
  portal?: any;
}

interface DayGroup {
  id: string;
  label: string;
  code: string;
  defaultClasses: number;
  classes: number;
  duration: number; // in minutes
  twiceAWeek: boolean;
  color: string;
}

export const ClassDistributionView: React.FC<ClassDistributionViewProps> = ({ portal }) => {
  // Initial default trimester class data matching the presidency university academic patterns
  const initialGroups: DayGroup[] = [
    { id: 'st', label: 'SUN/TUE', code: 'ST', defaultClasses: 26, classes: 26, duration: 90, twiceAWeek: true, color: 'from-amber-500/10 to-orange-500/10 text-amber-800 dark:text-amber-300' },
    { id: 'mw', label: 'MON/WED', code: 'MW', defaultClasses: 27, classes: 27, duration: 90, twiceAWeek: true, color: 'from-blue-500/10 to-indigo-500/10 text-blue-800 dark:text-blue-300' },
    { id: 'sat', label: 'SATURDAY', code: 'A', defaultClasses: 12, classes: 12, duration: 180, twiceAWeek: false, color: 'from-purple-500/10 to-violet-500/10 text-purple-800 dark:text-purple-300' },
    { id: 'thu', label: 'THURSDAY', code: 'R', defaultClasses: 13, classes: 13, duration: 90, twiceAWeek: false, color: 'from-rose-500/10 to-pink-500/10 text-rose-800 dark:text-rose-300' },
    { id: 'fri', label: 'FRIDAY', code: 'F', defaultClasses: 12, classes: 12, duration: 180, twiceAWeek: false, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-800 dark:text-emerald-300' },
  ];

  // Try loading adjustments from localstorage, fallback to defaults
  const [dayGroups, setDayGroups] = useState<DayGroup[]>(() => {
    try {
      const stored = localStorage.getItem('presidency_class_distribution');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    return initialGroups;
  });

  // Mode configurations
  const [layoutMode, setLayoutMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('standard');
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [makeupClasses, setMakeupClasses] = useState<{ [key: string]: number }>({
    st: 0, mw: 0, sat: 0, thu: 0, fri: 0
  });

  // Track window size for auto responsive layout simulation
  const [isRealMobile, setIsRealMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsRealMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('presidency_class_distribution', JSON.stringify(dayGroups));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [dayGroups]);

  // Handle count increments & decrements
  const adjustClasses = (id: string, amount: number) => {
    setDayGroups(prev => prev.map(group => {
      if (group.id === id) {
        const nextClasses = Math.max(0, Math.min(60, group.classes + amount));
        return { ...group, classes: nextClasses };
      }
      return group;
    }));
    setActivePreset('custom');
  };

  // Adjust duration per class slot
  const adjustDuration = (id: string, newDuration: number) => {
    setDayGroups(prev => prev.map(group => {
      if (group.id === id) {
        return { ...group, duration: Math.max(30, Math.min(300, newDuration)) };
      }
      return group;
    }));
    setActivePreset('custom');
  };

  // Preset switchers
  const applyPreset = (preset: 'standard' | 'accelerated' | 'lightweight' | 'makeupHeavy') => {
    setActivePreset(preset);
    if (preset === 'standard') {
      setDayGroups(initialGroups);
      setMakeupClasses({ st: 0, mw: 0, sat: 0, thu: 0, fri: 0 });
    } else if (preset === 'accelerated') {
      setDayGroups(prev => prev.map(g => ({ ...g, classes: Math.round(g.defaultClasses * 1.2) })));
    } else if (preset === 'lightweight') {
      setDayGroups(prev => prev.map(g => ({ ...g, classes: Math.round(g.defaultClasses * 0.8) })));
    } else if (preset === 'makeupHeavy') {
      setMakeupClasses({ st: 2, mw: 2, sat: 1, thu: 1, fri: 1 });
    }
  };

  // Reset to default
  const handleReset = () => {
    setDayGroups(initialGroups);
    setMakeupClasses({ st: 0, mw: 0, sat: 0, thu: 0, fri: 0 });
    setActivePreset('standard');
    setIsAdjusting(false);
  };

  // Quick helper to increment/decrement makeup classes
  const adjustMakeup = (id: string, amount: number) => {
    setMakeupClasses(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] || 0) + amount))
    }));
  };

  // Math Calculations
  const totalClasses = dayGroups.reduce((acc, g) => acc + g.classes + (makeupClasses[g.id] || 0), 0);
  const defaultTotalClasses = dayGroups.reduce((acc, g) => acc + g.defaultClasses, 0);
  
  const totalHours = dayGroups.reduce((acc, g) => {
    const count = g.classes + (makeupClasses[g.id] || 0);
    return acc + (count * (g.duration / 60));
  }, 0);

  const defaultTotalHours = initialGroups.reduce((acc, g) => {
    return acc + (g.defaultClasses * (g.duration / 60));
  }, 0);

  // Determine stress workload index
  const getWorkloadLevel = () => {
    if (totalHours < 110) return { label: 'Light-Weight Planning', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900', desc: 'Manageable schedules, optimal for supplemental activities.' };
    if (totalHours <= 150) return { label: 'Balanced Progression', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900', desc: 'Standard trimester progression plan.' };
    return { label: 'Intensive Load', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900', desc: 'Heavy class density! Prepare for high session velocity.' };
  };

  const workload = getWorkloadLevel();

  // Switch between rendering Desktop or Mobile structure based on layout state
  const isRenderMobile = layoutMode === 'mobile' || (layoutMode === 'auto' && isRealMobile);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* Dynamic Simulation Bar & Preset Controls */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-50 dark:bg-stone-800 rounded-xl">
            <Sliders className="w-5 h-5 text-[#8c1515] dark:text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm md:text-base">Student Portal Adjuster</h3>
            <p className="text-xs text-stone-500">Simulate and customize your trimester plan & layout live</p>
          </div>
        </div>

        {/* Adjusting Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="inline-flex rounded-lg p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-medium">
            <button
              onClick={() => applyPreset('standard')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activePreset === 'standard' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Presidency Standard
            </button>
            <button
              onClick={() => applyPreset('lightweight')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activePreset === 'lightweight' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Light term
            </button>
            <button
              onClick={() => applyPreset('accelerated')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activePreset === 'accelerated' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Accelerated
            </button>
          </div>

          {/* Toggle Interactive adjustments */}
          <button
            onClick={() => setIsAdjusting(!isAdjusting)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isAdjusting 
                ? 'bg-[#8c1515] text-white border-[#8c1515] shadow-sm shadow-[#8c1515]/20' 
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAdjusting ? 'Close Adjustments' : 'Adjust Counts'}
          </button>

          {/* Reset button */}
          {(dayGroups !== initialGroups || (Object.values(makeupClasses) as number[]).some(v => v > 0)) && (
            <button
              onClick={handleReset}
              className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg transition-colors"
              title="Reset to official timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Screen Layout Preview Switcher */}
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-3 border border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
        <span className="font-medium flex items-center gap-1.5">
          <Info className="w-4 h-4 text-stone-400" />
          Layout Switcher (Verify exact alignments)
        </span>
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
          <button 
            onClick={() => setLayoutMode('auto')} 
            className={`px-3 py-1 rounded ${layoutMode === 'auto' ? 'bg-white dark:bg-stone-700 font-semibold shadow-sm text-stone-900 dark:text-stone-100' : 'hover:text-stone-900'}`}
          >
            Auto Responsive
          </button>
          <button 
            onClick={() => setLayoutMode('desktop')} 
            className={`px-3 py-1 rounded flex items-center gap-1 ${layoutMode === 'desktop' ? 'bg-white dark:bg-stone-700 font-semibold shadow-sm text-stone-900 dark:text-stone-100' : 'hover:text-stone-900'}`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Mode
          </button>
          <button 
            onClick={() => setLayoutMode('mobile')} 
            className={`px-3 py-1 rounded flex items-center gap-1 ${layoutMode === 'mobile' ? 'bg-white dark:bg-stone-700 font-semibold shadow-sm text-stone-900 dark:text-stone-100' : 'hover:text-stone-900'}`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Mode
          </button>
        </div>
      </div>

      {/* RENDER VIEW CARD: EXACTLY MATCHING THE USER'S PROVIDED IMAGES */}
      <div className="bg-stone-50/50 dark:bg-stone-950/40 border border-stone-200/60 dark:border-stone-800 rounded-[24px] p-6 md:p-8 shadow-sm">
        
        {/* Card Header matching images */}
        <div className="flex items-start gap-4 mb-6">
          {/* Clock circle icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-red-800 dark:border-red-600 flex items-center justify-center text-red-800 dark:text-red-500 mt-0.5">
            <Clock className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[17px] md:text-[19px] font-bold text-stone-900 dark:text-stone-50 leading-tight">
              Trimester Class Distribution & Sessions Summary
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs md:text-[13px] leading-relaxed mt-1.5 font-normal">
              Per Class Duration: <span className="font-semibold text-stone-700 dark:text-stone-300">90 min</span> (twice a week) &{' '}
              <span className="font-semibold text-stone-700 dark:text-stone-300">180 min</span> (once a week for weekend). Additional/Makeup classes arranged by departments as required.
            </p>
          </div>
        </div>

        {/* Dynamic Display Layout Container */}
        {isRenderMobile ? (
          /* === MOBILE LAYOUT (Exactly matching Image 2 layout) === */
          <div className="space-y-4">
            {/* Row 1: 3 Column Grid (ST, MW, Saturday) */}
            <div className="grid grid-cols-3 gap-3">
              {dayGroups.slice(0, 3).map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-center shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700"
                >
                  <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 tracking-wide mb-1">
                    {group.label}
                  </div>
                  <div className="text-[10px] font-semibold text-stone-300 dark:text-stone-600 mb-2">
                    ({group.code})
                  </div>
                  <div className="text-base md:text-lg font-black text-stone-900 dark:text-stone-100">
                    {group.classes + (makeupClasses[group.id] || 0)}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                    Classes
                  </div>

                  {/* Inline subtle indicator when adjusted */}
                  {(group.classes !== group.defaultClasses || makeupClasses[group.id] > 0) && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
              ))}
            </div>

            {/* Row 2: Thursday Single Card in 3-column layout (takes left 1/3) */}
            <div className="grid grid-cols-3 gap-3">
              {dayGroups.slice(3, 4).map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-center shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-stone-300"
                >
                  <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 tracking-wide mb-1">
                    {group.label}
                  </div>
                  <div className="text-[10px] font-semibold text-stone-300 dark:text-stone-600 mb-2">
                    ({group.code})
                  </div>
                  <div className="text-base md:text-lg font-black text-stone-900 dark:text-stone-100">
                    {group.classes + (makeupClasses[group.id] || 0)}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                    Classes
                  </div>

                  {(group.classes !== group.defaultClasses || makeupClasses[group.id] > 0) && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
              ))}
              {/* Other 2 columns remain intentionally blank to exactly mirror the mockup structure */}
              <div className="col-span-2" />
            </div>

            {/* Row 3: Full width Friday Card spanning at the bottom */}
            {dayGroups.slice(4, 5).map((group) => (
              <div 
                key={group.id} 
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm text-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-stone-300"
              >
                <div className="flex items-center justify-between px-4">
                  <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 tracking-wide uppercase">
                    {group.label} ({group.code})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-stone-900 dark:text-stone-100">
                      {group.classes + (makeupClasses[group.id] || 0)}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                      Classes
                    </span>
                  </div>
                </div>

                {(group.classes !== group.defaultClasses || makeupClasses[group.id] > 0) && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
            ))}

          </div>
        ) : (
          /* === DESKTOP LAYOUT (Exactly matching Image 1 layout - horizontal row of 5) === */
          <div className="grid grid-cols-5 gap-4">
            {dayGroups.map((group) => (
              <div 
                key={group.id} 
                className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-2xl p-5 text-center shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group hover:border-stone-300 dark:hover:border-stone-700"
              >
                <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 tracking-wider mb-1 uppercase">
                  {group.label} ({group.code})
                </div>
                <div className="text-[20px] font-black text-stone-900 dark:text-stone-100 mt-2">
                  {group.classes + (makeupClasses[group.id] || 0)}
                </div>
                <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                  Classes
                </div>

                {/* Sub-hours metadata display */}
                <div className="mt-3 text-[10px] text-stone-400 border-t border-stone-50 dark:border-stone-800/60 pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {((group.classes + (makeupClasses[group.id] || 0)) * (group.duration / 60)).toFixed(1)} Hrs Total
                </div>

                {(group.classes !== group.defaultClasses || makeupClasses[group.id] > 0) && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Toggled Interactive Adjustment Controls Interface */}
        <AnimatePresence>
          {isAdjusting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-8 border-t border-stone-200/60 dark:border-stone-800 pt-6"
            >
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 shadow-inner space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Adjust Weekly Trimester Class Volume & Duration</span>
                  </div>
                  <button 
                    onClick={() => setShowHelper(!showHelper)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1"
                    title="Layout and Math Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {showHelper && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-4 text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed"
                  >
                    <strong>How this works:</strong> Adjust classes to simulate trimester length modifications, holidays, or personalized timelines. The Total hours auto-scale on the gauge widgets dynamically below. You can also simulate scheduling makeup hours when term days are disrupted.
                  </motion.div>
                )}

                {/* Grid of Adjusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dayGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-100 dark:border-stone-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{group.label} ({group.code})</span>
                        <span className="text-[11px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500 font-medium">
                          Default: {group.defaultClasses}
                        </span>
                      </div>

                      {/* Main Stepper for regular classes */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Regular Classes</label>
                        <div className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-lg p-1.5 border border-stone-200 dark:border-stone-800">
                          <button
                            onClick={() => adjustClasses(group.id, -1)}
                            className="p-1.5 rounded bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300"
                            disabled={group.classes <= 0}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            {group.classes}
                          </span>
                          <button
                            onClick={() => adjustClasses(group.id, 1)}
                            className="p-1.5 rounded bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300"
                            disabled={group.classes >= 60}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Controls for Makeup Hours & custom duration */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 dark:border-stone-900">
                        {/* Makeup counter */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Makeup/Additional</span>
                          <div className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-md p-1 border border-stone-200 dark:border-stone-800">
                            <button
                              onClick={() => adjustMakeup(group.id, -1)}
                              className="p-1 text-stone-400 hover:text-stone-600 disabled:opacity-30"
                              disabled={makeupClasses[group.id] <= 0}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                              {makeupClasses[group.id] || 0}
                            </span>
                            <button
                              onClick={() => adjustMakeup(group.id, 1)}
                              className="p-1 text-stone-400 hover:text-stone-600 disabled:opacity-30"
                              disabled={makeupClasses[group.id] >= 10}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Duration minutes select */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Duration per Class</span>
                          <select
                            value={group.duration}
                            onChange={(e) => adjustDuration(group.id, Number(e.target.value))}
                            className="w-full bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded-md p-1 font-medium focus:outline-none"
                          >
                            <option value={60}>1.0 Hr (60m)</option>
                            <option value={90}>1.5 Hr (90m)</option>
                            <option value={120}>2.0 Hr (120m)</option>
                            <option value={180}>3.0 Hr (180m)</option>
                            <option value={240}>4.0 Hr (240m)</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* CORE STATS & CALCULATIONS ANALYSIS DECK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Class Progression Status */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Total Class Volume</span>
            <BookOpen className="w-4 h-4 text-[#8c1515] dark:text-rose-400" />
          </div>
          <div className="my-4">
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 flex items-baseline gap-2">
              {totalClasses}
              <span className="text-xs font-normal text-stone-400">
                / {defaultTotalClasses} (Standard Base)
              </span>
            </div>
            {/* Visual delta indicator */}
            <div className="text-xs mt-1 font-medium">
              {totalClasses > defaultTotalClasses ? (
                <span className="text-rose-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 inline" /> +{totalClasses - defaultTotalClasses} intensive sessions added
                </span>
              ) : totalClasses < defaultTotalClasses ? (
                <span className="text-amber-500">-{defaultTotalClasses - totalClasses} classes skipped/removed</span>
              ) : (
                <span className="text-stone-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 inline text-emerald-500" /> Perfect academic distribution matched
                </span>
              )}
            </div>
          </div>
          {/* Visual Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <motion.div 
                className="bg-[#8c1515] dark:bg-rose-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalClasses / defaultTotalClasses) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0% term</span>
              <span>{Math.round((totalClasses / defaultTotalClasses) * 100)}% pacing</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Contact Classroom Hours */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Contact Study Hours</span>
            <Hourglass className="w-4 h-4 text-[#8c1515] dark:text-rose-400" />
          </div>
          <div className="my-4">
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 flex items-baseline gap-2">
              {totalHours.toFixed(1)}
              <span className="text-xs font-normal text-stone-400">
                Hrs
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Active lecture hall learning & lab contact duration
            </p>
          </div>
          {/* Standard hours comparison badge */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-50 dark:border-stone-800/60 text-xs">
            <span className="text-stone-400">Standard Target</span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">{defaultTotalHours.toFixed(1)} Hrs</span>
          </div>
        </div>

        {/* KPI 3: Dynamic Workload Index */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Planning Index</span>
            <Gauge className="w-4 h-4 text-[#8c1515] dark:text-rose-400" />
          </div>
          <div className="my-4">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold border ${workload.color}`}>
              {workload.label}
            </span>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {workload.desc}
            </p>
          </div>
          {/* Active indicator */}
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Updated with your custom adjustments</span>
          </div>
        </div>

      </div>

      {/* DETAILED INTERACTIVE BAR GRAPH VISUALIZER */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider">
          Weekly Scheduled Hours Distribution Chart
        </h3>

        <div className="space-y-4">
          {dayGroups.map((group) => {
            const count = group.classes + (makeupClasses[group.id] || 0);
            const hours = count * (group.duration / 60);
            // Calculate percentage of max potential (say max possible is 90 hours for scaling)
            const percentage = Math.min(100, (hours / 90) * 100);

            return (
              <div key={group.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {group.label} <span className="text-[10px] text-stone-400 font-normal">({group.twiceAWeek ? 'Twice/wk' : 'Once/wk'})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-400">{count} Classes</span>
                    <span className="font-black text-stone-900 dark:text-stone-100">{hours.toFixed(1)} Hrs</span>
                  </div>
                </div>
                <div className="w-full bg-stone-50 dark:bg-stone-950 h-5 rounded-lg overflow-hidden border border-stone-100 dark:border-stone-900 flex items-center p-0.5">
                  <motion.div
                    className={`h-full rounded-md bg-gradient-to-r ${group.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-stone-50 dark:border-stone-800/60 flex flex-wrap gap-4 text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40" />
            <span>SUN/TUE (ST) - 90 min Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500/20 border border-blue-500/40" />
            <span>MON/WED (MW) - 90 min Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500/20 border border-purple-500/40" />
            <span>SATURDAY (A) - 180 min Weekend Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40" />
            <span>THURSDAY (R) - 90 min Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40" />
            <span>FRIDAY (F) - 180 min Weekend Slots</span>
          </div>
        </div>
      </div>

    </div>
  );
};
