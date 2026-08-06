import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useAppStore } from '../store';
import { 
  AVAILABLE_COURSES, FEES_LIST, Course, getStudentData, ClassSchedule 
} from '../data';

export type NavItem = {
  id: string;
  label: string;
  icon: any;
  subItems?: { id: string; label: string }[];
};

export const usePortalLogic = () => {
  const store = useAppStore();
  
  const { 
    is24HourFormat, setIs24HourFormat, 
    profilePic, setProfilePic, 
    isSelectionLocked, setIsSelectionLocked,
    registeredCourses, setRegisteredCourses,
    completedCourses, setCompletedCourses
  } = store;

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (store.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [store.isDarkMode]);

  const toggleDarkMode = () => {
    store.setIsDarkMode(!store.isDarkMode);
    if (!store.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
  
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isConfirmRegistrationOpen, setIsConfirmRegistrationOpen] = useState(false);
  const [pendingCoreqCourse, setPendingCoreqCourse] = useState<{main: Course, coreqs: Course[]} | null>(null);
  const [isCoreqModalOpen, setIsCoreqModalOpen] = useState(false);
  
  // Available course filtering & sorting
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseDeptFilter, setCourseDeptFilter] = useState("All");
  const [courseCreditFilter, setCourseCreditFilter] = useState("All");
  const [coursePrereqFilter, setCoursePrereqFilter] = useState("All");
  const [courseSortBy, setCourseSortBy] = useState("code"); 

  // Schedule filtering & layout
  const [scheduleCourseFilter, setScheduleCourseFilter] = useState("All");
  const [scheduleDayFilter, setScheduleDayFilter] = useState("All");
  
  // Load dynamic student details based on current ID
  const studentData = useMemo(() => {
    return getStudentData(store.currentStudentId);
  }, [store.currentStudentId]);

  // Synchronize courses whenever student ID changes
  useEffect(() => {
    if (store.currentStudentId) {
      const data = getStudentData(store.currentStudentId);
      setRegisteredCourses(data.registeredCourses);
      setCompletedCourses(data.completedCourses);
    }
  }, [store.currentStudentId, setRegisteredCourses, setCompletedCourses]);

  const student = studentData.profile;

  // Bank slips state
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const toggleFee = (code: string) => {
    setSelectedFees(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };
  const bankSlipTotal = useMemo(() => {
    return FEES_LIST.filter(f => selectedFees.includes(f.code)).reduce((acc, f) => acc + f.amount, 0);
  }, [selectedFees]);

  const [isBankSlipSuccess, setIsBankSlipSuccess] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
  const handleBankSlipSubmitClick = () => {
    if (selectedFees.length === 0) return;
    setIsConfirmPaymentOpen(true);
  };
  
  const handleConfirmPayment = () => {
    setIsConfirmPaymentOpen(false);
    setIsBankSlipSuccess(true);
    setTimeout(() => {
      setIsBankSlipSuccess(false);
      setSelectedFees([]);
    }, 3000);
  };

  // Schedule logic
  const filteredSchedule = useMemo(() => {
    return studentData.schedule.filter(s => {
      const matchCourse = scheduleCourseFilter === "All" || s.courseCode === scheduleCourseFilter;
      const matchDay = scheduleDayFilter === "All" || s.day === scheduleDayFilter;
      return matchCourse && matchDay;
    });
  }, [studentData.schedule, scheduleCourseFilter, scheduleDayFilter]);

  const groupedSchedule = useMemo(() => {
    const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const groups: Record<string, ClassSchedule[]> = {};
    daysOrder.forEach(day => groups[day] = []);
    
    filteredSchedule.forEach(s => {
      groups[s.day]?.push(s);
    });
    
    // Sort by start time within each group
    Object.values(groups).forEach(group => {
      group.sort((a, b) => a.start.localeCompare(b.start));
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredSchedule]);

  // Derived available courses
  const groupedCompletedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    completedCourses.forEach(c => {
      if (!groups[c.semester]) groups[c.semester] = [];
      groups[c.semester].push(c);
    });
    return Object.entries(groups).sort((a,b) => b[0].localeCompare(a[0]));
  }, [completedCourses]);

  const filteredAvailableCourses = useMemo(() => {
    const result = AVAILABLE_COURSES.filter(c => {
      // Exclude courses that have been completed without failing
      const hasPassed = completedCourses.some(
        comp => comp.code === c.code && comp.grade && !['F', 'W', 'Drop', 'I'].includes(comp.grade)
      );
      if (hasPassed) return false;

      const matchesSearch = c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) || 
                            c.title.toLowerCase().includes(courseSearchQuery.toLowerCase());
      const dept = c.code.replace(/[0-9]/g, '');
      const matchesDept = courseDeptFilter === "All" || dept === courseDeptFilter;
      const matchesCredit = courseCreditFilter === "All" || c.credits.toString() === courseCreditFilter;
      
      let matchesPrereq = true;
      if (coursePrereqFilter !== "All") {
        const prereqs = c.prerequisites || [];
        if (prereqs.length === 0) {
           matchesPrereq = coursePrereqFilter === "all" || coursePrereqFilter === "met";
        } else {
           const metCount = prereqs.filter(p => completedCourses.some(comp => comp.code === p)).length;
           if (coursePrereqFilter === "all" || coursePrereqFilter === "met") matchesPrereq = metCount === prereqs.length;
           else if (coursePrereqFilter === "some") matchesPrereq = (metCount > 0 && metCount < prereqs.length);
           else if (coursePrereqFilter === "none") matchesPrereq = metCount === 0;
        }
      }

      return matchesSearch && matchesDept && matchesCredit && matchesPrereq;
    });

    result.sort((a, b) => {
      if (courseSortBy === "code") return a.code.localeCompare(b.code);
      if (courseSortBy === "title") return a.title.localeCompare(b.title);
      if (courseSortBy === "credits-desc") return b.credits - a.credits;
      if (courseSortBy === "credits-asc") return a.credits - b.credits;
      return 0;
    });

    return result;
  }, [courseSearchQuery, courseDeptFilter, courseCreditFilter, coursePrereqFilter, courseSortBy, completedCourses]);

  // statement logic
  const { totalDebit, totalCredit, statementChartData } = useMemo(() => {
    const debit = studentData.transactions.reduce((acc, t) => acc + Math.abs(t.debit || 0), 0);
    const credit = studentData.transactions.reduce((acc, t) => acc + Math.abs(t.credit || 0), 0);
    const chartData = studentData.transactions.map((t, idx) => ({
      name: t.date,
      balance: t.balance,
      index: idx
    })).reverse();
    return { totalDebit: debit, totalCredit: credit, statementChartData: chartData };
  }, [studentData.transactions]);

  const handleMenuToggle = (id: string) => {
    store.toggleMenu(id);
    if (store.isSidebarCollapsed) store.setIsSidebarCollapsed(false);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.subItems) {
      handleMenuToggle(item.id);
      if (!store.expandedMenus[item.id] && !item.subItems.find(s => s.id === store.activeTab)) {
        store.setActiveTab(item.subItems[0].id);
      }
    } else {
      store.setActiveTab(item.id);
      if (window.innerWidth < 768) store.setIsMobileMenuOpen(false);
    }
  };

  const handleSubItemClick = (subId: string) => {
    store.setActiveTab(subId);
    if (window.innerWidth < 768) store.setIsMobileMenuOpen(false);
  };

  const hasCompletedPrerequisites = (course: Course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => 
      completedCourses.some(c => c.code === prereq)
    );
  };

  const handleRegister = (course: Course) => {
    if (isSelectionLocked) {
      setRegisterError(`Course selection is locked for this semester.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    if (!hasCompletedPrerequisites(course)) {
      setRegisterError(`Prerequisite not met: ${course.prerequisites?.join(', ')}`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    if (registeredCourses.some(c => c.code === course.code)) {
      setRegisterError(`Already registered for ${course.code}.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }
    
    // Evaluate corequisites
    if (course.corequisites && course.corequisites.length > 0) {
      const missingCoreqs = course.corequisites.filter(coreq => 
        !completedCourses.some(c => c.code === coreq) && 
        !registeredCourses.some(c => c.code === coreq)
      );
      if (missingCoreqs.length > 0) {
        const missingCoreqCourses = AVAILABLE_COURSES.filter(c => missingCoreqs.includes(c.code));
        const missingCoreqCredits = missingCoreqCourses.reduce((acc, c) => acc + c.credits, 0);
        const currentCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
        
        if (currentCredits + course.credits + missingCoreqCredits > 21) {
          setRegisterError(`Cannot add ${course.code} because adding its missing co-requisites (${missingCoreqs.join(', ')}) would exceed the 21 credit limit.`);
          setTimeout(() => setRegisterError(null), 3000);
          return;
        }

        setPendingCoreqCourse({ main: course, coreqs: missingCoreqCourses });
        setIsCoreqModalOpen(true);
        return;
      }
    }

    // Check Max 21
    const currentCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
    if (currentCredits + course.credits > 21) {
      setRegisterError(`Cannot exceed maximum of 21 credits. Total will be ${currentCredits + course.credits}.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    setRegisteredCourses([...registeredCourses, course]);
  };

  const handleRegisterBundle = (main: Course, labs: Course[]) => {
    if (isSelectionLocked) {
      setRegisterError(`Course selection is locked for this semester.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    if (!hasCompletedPrerequisites(main)) {
      setRegisterError(`Prerequisite not met: ${main.prerequisites?.join(', ')}`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    const coursesToConsider = [main, ...labs];
    const coursesToAdd = coursesToConsider.filter(c => !registeredCourses.some(rc => rc.code === c.code));

    if (coursesToAdd.length === 0) {
      setRegisterError(`Already registered for all courses in bundle.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    const totalCreditsToAdd = coursesToAdd.reduce((acc, l) => acc + l.credits, 0);
    const currentCredits = registeredCourses.reduce((acc, c) => acc + c.credits, 0);
    if (currentCredits + totalCreditsToAdd > 21) {
      setRegisterError(`Cannot exceed maximum of 21 credits. Total will be ${currentCredits + totalCreditsToAdd}.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }

    setRegisteredCourses([...registeredCourses, ...coursesToAdd]);
  };

  const confirmCoreqsRegistration = () => {
    if (!pendingCoreqCourse) return;
    setRegisteredCourses([...registeredCourses, pendingCoreqCourse.main, ...pendingCoreqCourse.coreqs]);
    setIsCoreqModalOpen(false);
    setPendingCoreqCourse(null);
  };
  
  const handleDropCourse = (courseCode: string) => {
    if (isSelectionLocked) {
      setRegisterError(`Course selection is locked for this semester.`);
      setTimeout(() => setRegisterError(null), 3000);
      return;
    }
    // Check if dropping this course breaks corequisite rules for other registered courses
    const brokenCoreqCourse = registeredCourses.find(c => c.corequisites?.includes(courseCode));
    if (brokenCoreqCourse) {
      setRegisterError(`Cannot drop ${courseCode} because it is a co-requisite for ${brokenCoreqCourse.code}.`);
      setTimeout(() => setRegisterError(null), 4000);
      return;
    }
    
    setRegisteredCourses(registeredCourses.filter(c => c.code !== courseCode));
  };


  return {
    store,
    is24HourFormat, setIs24HourFormat,
    profilePic, setProfilePic,
    fileInputRef,
    toggleDarkMode, handleProfilePicUpload,
    registeredCourses, setRegisteredCourses,
    completedCourses,
    registerError, setRegisterError,
    isSelectionLocked, setIsSelectionLocked,
    isConfirmRegistrationOpen, setIsConfirmRegistrationOpen,
    pendingCoreqCourse, setPendingCoreqCourse,
    isCoreqModalOpen, setIsCoreqModalOpen,
    courseSearchQuery, setCourseSearchQuery,
    courseDeptFilter, setCourseDeptFilter,
    courseCreditFilter, setCourseCreditFilter,
    coursePrereqFilter, setCoursePrereqFilter,
    courseSortBy, setCourseSortBy,
    scheduleCourseFilter, setScheduleCourseFilter,
    scheduleDayFilter, setScheduleDayFilter,
    student,
    studentData,
    selectedFees, setSelectedFees, toggleFee,
    bankSlipTotal,
    isBankSlipSuccess, setIsBankSlipSuccess,
    isConfirmPaymentOpen, setIsConfirmPaymentOpen,
    handleBankSlipSubmitClick, handleConfirmPayment,
    filteredSchedule, groupedSchedule,
    groupedCompletedCourses, filteredAvailableCourses,
    totalDebit, totalCredit, statementChartData,
    handleMenuToggle, handleNavClick, handleSubItemClick,
    hasCompletedPrerequisites, handleRegister, handleRegisterBundle, confirmCoreqsRegistration, handleDropCourse
  };
};
