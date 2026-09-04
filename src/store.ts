import { create } from 'zustand';
import { Course, REGISTERED_COURSES, COMPLETED_COURSES } from './data';
import { tempAuthService } from './services/tempAuthService';

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
  showLogoutSplash: boolean;
  setShowLogoutSplash: (v: boolean) => void;
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
    const isLoggedIn = localStorage.getItem('pu_is_logged_in') === 'true';
    if (isLoggedIn) {
      const expiresAt = localStorage.getItem('pu_session_expires_at');
      if (expiresAt && Date.now() >= Number(expiresAt)) {
        // Session expired while the app was closed (PWA background/closed state)
        localStorage.removeItem('pu_is_logged_in');
        localStorage.removeItem('pu_active_student_id');
        localStorage.removeItem('pu_session_expires_at');
        // Let the auto_logged_out flag trigger a splash if needed, or just return false
        localStorage.setItem('pu_auto_logged_out', 'true');
        return false;
      }
      return true;
    }
  }
  return false;
};

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: getInitialIsLoggedIn(),
  showLogoutSplash: false,
  setShowLogoutSplash: (v) => set({ showLogoutSplash: v }),
  setIsLoggedIn: (v) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (v) {
        localStorage.setItem('pu_is_logged_in', 'true');
        // Start absolute 30-minute session timestamp (1800000 ms)
        localStorage.setItem('pu_session_expires_at', String(Date.now() + 30 * 60 * 1000));
      } else {
        localStorage.removeItem('pu_is_logged_in');
        localStorage.removeItem('pu_active_student_id');
        localStorage.removeItem('pu_session_expires_at');
        tempAuthService.clearTempCredentials();
      }
    }
    if (!v) {
      tempAuthService.clearTempCredentials();
      
      let isAutoLogout = false;
      if (typeof window !== 'undefined' && window.localStorage) {
        isAutoLogout = localStorage.getItem('pu_auto_logged_out') === 'true';
      }

      set({ 
        isLoggedIn: false,
        showLogoutSplash: !isAutoLogout,
        isAdmin: false,
        currentStudentId: null,
        activeTab: 'home',
        isMobileMenuOpen: false,
        isSidebarCollapsed: false,
        isSelectionLocked: false,
        selectedSyllabusCourse: null
      });
      return;
    }
    set({ isLoggedIn: v, showLogoutSplash: false });
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

  notices: [],
  dismissNotice: (id) => set((state) => ({ notices: state.notices.filter(n => n.id !== id) })),

  pendingApprovals: [],
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

  coursesData: [],
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

