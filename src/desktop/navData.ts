import { Home, User, BookOpen, Calendar, Wallet, Users } from 'lucide-react';
import { NavItem } from '../hooks/usePortalLogic';

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'accounts', label: 'Accounts', icon: Wallet, subItems: [
    { id: 'bank-slips', label: 'Bank Slips' },
    { id: 'statement', label: 'Statement of Account' }
  ]},
  { id: 'courses', label: 'Courses', icon: BookOpen, subItems: [
    { id: 'registered-courses', label: 'Registered Courses' },
    { id: 'completed-courses', label: 'Completed Courses' },
    { id: 'available-courses', label: 'Course Enrollment' }
  ]},
  { id: 'schedule', label: 'Schedule', icon: Calendar, subItems: [
    { id: 'class-schedule', label: 'Class Schedule' }
  ]},
  { id: 'teachers', label: 'Related Teachers', icon: Users },
];
