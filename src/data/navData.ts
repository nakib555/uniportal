import { Home, User, BookOpen, Calendar, Wallet, Users, GraduationCap, Settings, BarChart3 } from 'lucide-react';
import { NavItem } from '../hooks/usePortalLogic';

export const getNavItems = (isAdmin: boolean): NavItem[] => {
  if (isAdmin) {
    return [
      { id: 'admin-dashboard', label: 'Dashboard', icon: Home },
      { id: 'faculty-schedule', label: 'My Schedule', icon: Calendar },
      { id: 'course-management', label: 'Course Management', icon: BookOpen },
      { id: 'student-records', label: 'Student Records', icon: Users, subItems: [
        { id: 'enrollment-approvals', label: 'Enrollment Approvals' },
        { id: 'grade-submissions', label: 'Grade Submissions' },
        { id: 'attendance-tracking', label: 'Attendance Management' }
      ]},
      { id: 'department-reports', label: 'Reports', icon: BarChart3, subItems: [
        { id: 'financial-reports', label: 'Financial Summaries' },
        { id: 'academic-performance', label: 'Academic Performance' }
      ]},
      { id: 'system-settings', label: 'System Settings', icon: Settings },
    ];
  }

  return [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accounts', label: 'Accounts', icon: Wallet, subItems: [
      { id: 'statement', label: 'Accounts Overview' },
      { id: 'bank-slips', label: 'Bank Slips' },
      { id: 'financial-aid', label: 'Financial Aid' }
    ]},
    { id: 'courses', label: 'Courses', icon: BookOpen, subItems: [
      { id: 'registered-courses', label: 'Registered Courses' },
      { id: 'completed-courses', label: 'Completed Courses' },
      { id: 'available-courses', label: 'Course Enrollment' }
    ]},
    { id: 'schedule', label: 'Schedule', icon: Calendar, subItems: [
      { id: 'class-schedule', label: 'Class Schedule' },
      { id: 'exam-routine', label: 'Exam Schedule' },
      { id: 'exam-admit-card', label: 'Exam Admit Card' }
    ]},
    { id: 'academics', label: 'Academics', icon: GraduationCap, subItems: [
      { id: 'degree-audit', label: 'Degree Audit' },
      { id: 'transcript', label: 'Grades & Transcript' },
      { id: 'academic-calendar', label: 'Academic Calendar' },
      { id: 'attendance', label: 'Attendance' },
      { id: 'faculty-evaluation', label: 'Faculty Evaluation' },
    ]},
  ];
};
