import { 
  Home, User, BookOpen, Calendar, Wallet, Users, GraduationCap, Settings, BarChart3,
  UserCheck, Award, TrendingUp, PieChart, Receipt, CreditCard, CheckCircle, Bookmark, 
  PlusCircle, CalendarDays, Clock, IdCard, Compass, FileText, CalendarSearch
} from 'lucide-react';
import { NavItem } from '../hooks/usePortalLogic';

export const getNavItems = (isAdmin: boolean): NavItem[] => {
  if (isAdmin) {
    return [
      { id: 'admin-dashboard', label: 'Dashboard', icon: Home },
      { id: 'faculty-schedule', label: 'My Schedule', icon: Calendar },
      { id: 'course-management', label: 'Course Management', icon: BookOpen },
      { id: 'student-records', label: 'Student Records', icon: Users, subItems: [
        { id: 'enrollment-approvals', label: 'Enrollment Approvals', icon: UserCheck },
        { id: 'grade-submissions', label: 'Grade Submissions', icon: Award }
      ]},
      { id: 'department-reports', label: 'Reports', icon: BarChart3, subItems: [
        { id: 'financial-reports', label: 'Financial Summaries', icon: PieChart },
        { id: 'academic-performance', label: 'Academic Performance', icon: TrendingUp }
      ]},
      { id: 'system-settings', label: 'System Settings', icon: Settings },
    ];
  }

  return [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accounts', label: 'Accounts', icon: Wallet, subItems: [
      { id: 'statement', label: 'Accounts Overview', icon: Receipt },
      { id: 'bank-slips', label: 'Bank Slips', icon: CreditCard }
    ]},
    { id: 'courses', label: 'Courses', icon: BookOpen, subItems: [
      { id: 'registered-courses', label: 'Registered Courses', icon: CheckCircle },
      { id: 'completed-courses', label: 'Completed Courses', icon: Bookmark },
      { id: 'available-courses', label: 'Course Enrollment', icon: PlusCircle }
    ]},
    { id: 'schedule', label: 'Schedule', icon: Calendar, subItems: [
      { id: 'class-schedule', label: 'Class Schedule', icon: CalendarDays },
      { id: 'exam-routine', label: 'Exam Schedule', icon: Clock },
      { id: 'exam-admit-card', label: 'Exam Admit Card', icon: IdCard }
    ]},
    { id: 'academics', label: 'Academics', icon: GraduationCap, subItems: [
      { id: 'degree-audit', label: 'Degree Audit', icon: Compass },
      { id: 'transcript', label: 'Grades & Transcript', icon: FileText },
      { id: 'academic-calendar', label: 'Academic Calendar', icon: CalendarSearch }
    ]},
  ];
};
