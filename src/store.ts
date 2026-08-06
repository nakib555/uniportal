import { create } from 'zustand';
import { Course, REGISTERED_COURSES, COMPLETED_COURSES } from './data';

interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;

  // Settings
  is24HourFormat: boolean;
  setIs24HourFormat: (v: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  
  // Profile
  profilePic: string;
  setProfilePic: (v: string) => void;

  // Enrollment
  isSelectionLocked: boolean;
  setIsSelectionLocked: (v: boolean) => void;
  
  // Courses Data
  registeredCourses: Course[];
  setRegisteredCourses: (courses: Course[]) => void;
  completedCourses: Course[];
  setCompletedCourses: (courses: Course[]) => void;

  // UI States
  selectedSyllabusCourse: Course | null;
  setSelectedSyllabusCourse: (c: Course | null) => void;
  
  // Auth
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  currentStudentId: string | null;
  setCurrentStudentId: (v: string | null) => void;

// Added Logic State
  notices: { id: string; title: string; date: string; important: boolean }[];
  dismissNotice: (id: string) => void;

  pendingApprovals: { id: string; type: string; reqId: string }[];
  resolveApproval: (id: string) => void;

  topNotifications: { id: number; type: string; title: string; desc: string; time: string; color: string; read?: boolean }[];
  clearAllTopNotifications: () => void;
  removeTopNotification: (id: number) => void;
  markAllTopNotificationsAsRead: () => void;

  // Admin Data
  students: { id: string; name: string; program: string; cgpa: number; status: string }[];
  deleteStudent: (id: string) => void;
  updateStudentStatus: (id: string, status: string) => void;

  coursesData: { code: string; title: string; credits: number; section: string; enrolled: number; status: string }[];
  deleteCourse: (code: string) => void;
  toggleCourseStatus: (code: string) => void;
  addCourse: (course: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  isAdmin: false,
  setIsAdmin: (v) => set({ isAdmin: v }),
  currentStudentId: null,
  setCurrentStudentId: (v) => set({ currentStudentId: v }),

  notices: [
    { id: '1', title: "Report on Conversion from Tri-Semester to Bi-Semester", date: "Today", important: true },
    { id: '2', title: "ATTENTION! Without Admit Card Students will not be allowed", date: "Yesterday", important: true },
    { id: '3', title: "bKash payment flow chart available now", date: "Mar 12, 2026", important: false },
    { id: '4', title: "Tuition Payment and Advising Summary", date: "Mar 10, 2026", important: false }
  ],
  dismissNotice: (id) => set((state) => ({ notices: state.notices.filter(n => n.id !== id) })),

  pendingApprovals: [
    { id: '1', type: 'Course Enrollment Add/Drop', reqId: 'REQ-1001' },
    { id: '2', type: 'Course Enrollment Add/Drop', reqId: 'REQ-1002' },
    { id: '3', type: 'Grade Change Request', reqId: 'REQ-1003' },
    { id: '4', type: 'Credit Transfer Request', reqId: 'REQ-1004' },
  ],
  resolveApproval: (id) => set((state) => ({ pendingApprovals: state.pendingApprovals.filter(p => p.id !== id) })),


  topNotifications: [
    { id: 1, type: 'alert', title: 'Tuition Fee Due', desc: 'Fall 2026 tuition fee is due in 3 days.', time: '2 hours ago', color: 'text-amber-500' },
    { id: 2, type: 'success', title: 'Grade Posted', desc: 'Your final grade for CSE-305 has been posted.', time: '5 hours ago', color: 'text-emerald-500' },
    { id: 3, type: 'info', title: 'New Course Material', desc: 'Dr. Rahman uploaded "Chapter 4 Notes".', time: '1 day ago', color: 'text-blue-500' },
    { id: 4, type: 'event', title: 'Robotics Club Meeting', desc: 'Tomorrow at 4:00 PM in Room 301.', time: '1 day ago', color: 'text-indigo-500' },
  ],
  clearAllTopNotifications: () => set({ topNotifications: [] }),
  removeTopNotification: (id) => set(state => ({ topNotifications: state.topNotifications.filter(n => n.id !== id) })),
  markAllTopNotificationsAsRead: () => set(state => ({ topNotifications: state.topNotifications.map(n => ({ ...n, read: true })) })),

  students: [
    { id: '21104104', name: 'Al Ibrahim', program: 'BSc in CSE', cgpa: 3.82, status: 'Regular' },
    { id: '21104105', name: 'Sarah Ahmed', program: 'BSc in SWE', cgpa: 3.91, status: 'Regular' },
    { id: '21104106', name: 'Fahim Rahman', program: 'BSc in CSE', cgpa: 2.85, status: 'Probation' },
    { id: '21104107', name: 'Nusrat Jahan', program: 'BSc in CIS', cgpa: 3.45, status: 'Regular' },
    { id: '21104108', name: 'Rafiq Islam', program: 'BSc in CSE', cgpa: 3.12, status: 'Irregular' },
  ],
  deleteStudent: (id) => set((state) => ({ students: state.students.filter(s => s.id !== id) })),
  updateStudentStatus: (id, status) => set((state) => ({ 
    students: state.students.map(s => s.id === id ? { ...s, status } : s)
  })),

  coursesData: [
    { code: 'CSE-101', title: 'Introduction to Computer Science', credits: 3, section: 'A, B, C', enrolled: 120, status: 'Active' },
    { code: 'CSE-102', title: 'Programming Language I', credits: 3, section: 'A, B', enrolled: 85, status: 'Active' },
    { code: 'CSE-201', title: 'Data Structures', credits: 3, section: 'A', enrolled: 45, status: 'Active' },
    { code: 'CSE-305', title: 'Software Engineering', credits: 3, section: 'A, B', enrolled: 72, status: 'Active' },
    { code: 'MAT-101', title: 'Differential Calculus', credits: 3, section: 'A, B, C, D', enrolled: 150, status: 'Active' },
    { code: 'PHY-101', title: 'Physics I', credits: 3, section: 'A, B', enrolled: 90, status: 'Inactive' },
  ],
  deleteCourse: (code) => set((state) => ({ coursesData: state.coursesData.filter(c => c.code !== code) })),
  toggleCourseStatus: (code) => set((state) => ({ 
    coursesData: state.coursesData.map(c => c.code === code ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c)
  })),
  addCourse: (course) => set((state) => ({ coursesData: [...state.coursesData, course] })),

  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  expandedMenus: { courses: true },
  toggleMenu: (id) => set((state) => ({ 
    expandedMenus: { [id]: !state.expandedMenus[id] } 
  })),
  
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (v) => set({ isSidebarCollapsed: v }),
  
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),

  is24HourFormat: false,
  setIs24HourFormat: (v) => set({ is24HourFormat: v }),

  isDarkMode: localStorage.getItem('pu-theme') === 'dark' || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('pu-theme')),
  setIsDarkMode: (v) => {
    set({ isDarkMode: v });
    if (v) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('pu-theme', v ? 'dark' : 'light');
  },

  profilePic: `https://wsrv.nl/?url=http://www.sims.pu.edu.bd/students/studentPhoto&output=webp`,
  setProfilePic: (v) => set({ profilePic: v }),

  isSelectionLocked: false,
  setIsSelectionLocked: (v) => set({ isSelectionLocked: v }),

  registeredCourses: REGISTERED_COURSES,
  setRegisteredCourses: (courses) => set({ registeredCourses: courses }),

  completedCourses: COMPLETED_COURSES,
  setCompletedCourses: (courses) => set({ completedCourses: courses }),

  selectedSyllabusCourse: null,
  setSelectedSyllabusCourse: (c) => set({ selectedSyllabusCourse: c })
}));

