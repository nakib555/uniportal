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
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),

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

