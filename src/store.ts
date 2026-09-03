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

const getInitialStudentId = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('pu_active_student_id');
  }
  return null;
};

const getInitialIsLoggedIn = (): boolean => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('pu_is_logged_in') === 'true';
  }
  return false;
};

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: getInitialIsLoggedIn(),
  setIsLoggedIn: (v) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pu_is_logged_in', String(v));
      if (!v) {
        localStorage.removeItem('pu_active_student_id');
      }
    }
    set({ isLoggedIn: v });
  },
  isAdmin: false,
  setIsAdmin: (v) => set({ isAdmin: v }),
  currentStudentId: getInitialStudentId(),
  setCurrentStudentId: (v) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (v) {
        localStorage.setItem('pu_active_student_id', v);
      } else {
        localStorage.removeItem('pu_active_student_id');
      }
    }
    set({ currentStudentId: v });
  },

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


  topNotifications: [],
  clearAllTopNotifications: () => set({ topNotifications: [] }),
  removeTopNotification: (id) => set(state => ({ topNotifications: state.topNotifications.filter(n => n.id !== id) })),
  markAllTopNotificationsAsRead: () => set(state => ({ topNotifications: state.topNotifications.map(n => ({ ...n, read: true })) })),

  students: [],
  deleteStudent: (id) => set((state) => ({ students: state.students.filter(s => s.id !== id) })),
  updateStudentStatus: (id, status) => set((state) => ({ 
    students: state.students.map(s => s.id === id ? { ...s, status } : s)
  })),

  coursesData: [
    { code: 'EEE201', title: 'Electrical Circuits I', credits: 3, section: '5', enrolled: 45, status: 'Active' },
    { code: 'EEE203', title: 'Electrical Circuits II', credits: 3, section: '5', enrolled: 40, status: 'Active' },
    { code: 'MAT121', title: 'Pre-Calculus', credits: 3, section: '18', enrolled: 55, status: 'Active' },
    { code: 'MAT123', title: 'Calculus I', credits: 3, section: '6', enrolled: 50, status: 'Active' },
    { code: 'ENG099', title: 'Basic English', credits: 3, section: '18', enrolled: 60, status: 'Active' },
    { code: 'ENG101', title: 'English Reading & Composition', credits: 3, section: '21', enrolled: 60, status: 'Active' },
    { code: 'PHY107', title: 'General Physics I', credits: 3, section: '6', enrolled: 48, status: 'Active' },
    { code: 'PHY108', title: 'General Physics I Laboratory', credits: 1, section: '6', enrolled: 48, status: 'Active' },
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

