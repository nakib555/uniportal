import { Home, User, BookOpen, Calendar, Wallet, Users, GraduationCap, MapPin } from 'lucide-react';
import { NavItem } from '../hooks/usePortalLogic';

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'accounts', label: 'Accounts', icon: Wallet, subItems: [
    { id: 'statement', label: 'Statement of Account' },
    { id: 'financial-aid', label: 'Financial Aid' }
  ]},
  { id: 'courses', label: 'Courses', icon: BookOpen, subItems: [
    { id: 'registered-courses', label: 'Registered Courses' },
    { id: 'completed-courses', label: 'Completed Courses' },
    { id: 'available-courses', label: 'Course Enrollment' }
  ]},
  { id: 'schedule', label: 'Schedule', icon: Calendar, subItems: [
    { id: 'class-schedule', label: 'Class Schedule' }
  ]},
  { id: 'academics', label: 'Academics', icon: GraduationCap, subItems: [
    { id: 'degree-audit', label: 'Degree Audit' },
    { id: 'transcript', label: 'Grades & Transcript' },
    { id: 'exam-routine', label: 'Exam Routine' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'faculty-evaluation', label: 'Faculty Evaluation' },
  ]},
  { id: 'campus-life', label: 'Campus Life', icon: MapPin, subItems: [
    { id: 'library', label: 'Library' },
    { id: 'clubs', label: 'Clubs & Events' },
    { id: 'advising', label: 'Advising' },
  ]},
  { id: 'teachers', label: 'Related Teachers', icon: Users },
];
