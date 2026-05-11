export type Major = 'Computer Science & Engineering' | 'Electrical & Electronic Engineering' | 'Business Administration';

export interface Course {
  code: string;
  title: string;
  section: string;
  credits: number;
  grade?: string;
  semester: string;
  faculty: string;
  fee: number;
  prerequisites?: string[];
  corequisites?: string[];
  syllabus?: string;
}

export interface ClassSchedule {
  courseCode: string;
  day: string;
  start: string;
  end: string;
  room: string;
  campus: string;
  faculty: string;
  section?: string;
  semester?: string;
}

export interface Transaction {
  id: string;
  date: string;
  code: string;
  description: string;
  debit: number; // Charges
  credit: number; // Payments
  balance: number;
}

export interface Instructor {
  initial: string;
  name: string;
  email: string;
  department: string;
  courses: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  status: string;
  admissionSemester: string;
  currentSemester: string;
  program: Major;
  creditsTaken: number;
  creditsCompleted: number;
  cgpa: number;
  accountBalance: number;
  email: string;
  gpaHistory?: { semester: string; gpa: number }[];
}

export const STUDENT_DATA: StudentProfile = {
  id: "2610329040",
  name: "Nakib Hassan Prince",
  status: "Registered",
  admissionSemester: "Spring-26",
  currentSemester: "Spring-26",
  program: "Electrical & Electronic Engineering",
  creditsTaken: 13,
  creditsCompleted: 0,
  cgpa: 0.00,
  accountBalance: 22770,
  email: "nakib@student.university.edu",
  gpaHistory: []
};

export const REGISTERED_COURSES: Course[] = [
  { code: "ENG099", title: "Basic English", section: "10", credits: 3.00, semester: "Spring-26", faculty: "Harisun", fee: 7500, prerequisites: [], syllabus: "Fundamental English grammar and vocabulary." },
  { code: "MAT121", title: "Pre-Calculus", section: "5", credits: 3.00, semester: "Spring-26", faculty: "Ibrahim", fee: 7500, prerequisites: [], syllabus: "Algebra, functions, trigonometry." },
  { code: "PHY107", title: "General Physics I", section: "6", credits: 3.00, semester: "Spring-26", faculty: "Alif", fee: 7500, prerequisites: [], syllabus: "Mechanics, kinematics, forces, energy, momentum." },
  { code: "PHY108", title: "General Physics I Laboratory", section: "6", credits: 1.00, semester: "Spring-26", faculty: "Alif", fee: 2500, prerequisites: ["PHY107"], syllabus: "Experimental physics accompanying PHY107." },
  { code: "CSE101", title: "Intro to Computing", section: "1", credits: 3.00, semester: "Spring-26", faculty: "shadab", fee: 7500, prerequisites: [], syllabus: "Basics of computing and algorithms." }
];

export const COMPLETED_COURSES: Course[] = [];

import eeeCourses from './eee_courses.json';

export const AVAILABLE_COURSES: Course[] = eeeCourses.map((c, i) => ({
  ...c,
  section: "1",
  semester: "Spring-26",
  faculty: "TBA",
  fee: c.credits * 2500,
  syllabus: "Syllabus for " + c.title,
}));

export const SCHEDULE_DATA: ClassSchedule[] = [
  { courseCode: "EEE203", section: "5", day: "Monday", start: "11:20:00", end: "12:30:00", room: "513", campus: "Gulshan", faculty: "shadab", semester: "Summer-26" },
  { courseCode: "EEE203", section: "-", day: "Wednesday", start: "11:20:00", end: "12:30:00", room: "513", campus: "Gulshan", faculty: "-", semester: "" },
  { courseCode: "ENG101", section: "21", day: "Monday", start: "13:50:00", end: "15:00:00", room: "613", campus: "Gulshan", faculty: "Harisun", semester: "Summer-26" },
  { courseCode: "ENG101", section: "-", day: "Wednesday", start: "13:50:00", end: "15:00:00", room: "613", campus: "Gulshan", faculty: "-", semester: "" },
  { courseCode: "MAT123", section: "6", day: "Monday", start: "12:35:00", end: "13:45:00", room: "613", campus: "Gulshan", faculty: "ibrahim", semester: "Summer-26" },
  { courseCode: "MAT123", section: "-", day: "Wednesday", start: "12:35:00", end: "13:45:00", room: "613", campus: "Gulshan", faculty: "-", semester: "" },
  { courseCode: "PHY107", section: "6", day: "Tuesday", start: "15:05:00", end: "17:30:00", room: "", campus: "", faculty: "Alif", semester: "Summer-26" },
  { courseCode: "PHY108", section: "6", day: "Tuesday", start: "12:35:00", end: "15:00:00", room: "", campus: "", faculty: "Alif", semester: "Summer-26" }
];

export const TRANSACTIONS_DATA: Transaction[] = [
  { id: "1", date: "03-05-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 7500, balance: 7500 },
  { id: "2", date: "03-05-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 105, balance: 7605 },
  { id: "3", date: "07-05-26", code: "EEE203", description: "Electrical Circuits II", debit: 7500, credit: 0, balance: 105 },
  { id: "4", date: "07-05-26", code: "ENG101", description: "English Reading & Composition", debit: 7500, credit: 0, balance: -7395 },
  { id: "5", date: "07-05-26", code: "MAT123", description: "Calculus I", debit: 7500, credit: 0, balance: -14895 },
  { id: "6", date: "07-05-26", code: "PHY107", description: "General Physics I", debit: 7500, credit: 0, balance: -22395 },
  { id: "7", date: "07-05-26", code: "PHY108", description: "General Physics I Laboratory", debit: 2500, credit: 0, balance: -24895 },
  { id: "8", date: "07-05-26", code: "FEE400", description: "Semester Fee w.e.f 261", debit: 6000, credit: 0, balance: -30895 },
  { id: "9", date: "07-05-26", code: "WAV001", description: "Less 25.00% Tuition Waiver", debit: 0, credit: 8125, balance: -22770 }
];

export const TEACHERS_DATA: Instructor[] = [
  { initial: "Harisun", name: "Harisun Actor", email: "harisun@edu", department: "ENG", courses: "ENG101-21" },
  { initial: "shadab", name: "Irtiza Shadab", email: "shadab@edu", department: "EEE", courses: "EEE203-5" },
  { initial: "Ibrahim", name: "Md. Ibrahim Khalil", email: "ibrahim@edu", department: "EEE", courses: "MAT123-5" },
  { initial: "Alif", name: "Sheikh Md Alif Miar Nakid", email: "alif@edu", department: "CSE", courses: "PHY108-6, PHY107-6" },
];

export const FEES_LIST = [
  { code: "FEE400", description: "Semester Fee w.e.f 261", amount: 6000 },
  { code: "IT001", description: "IT Service Fee", amount: 1500 },
  { code: "LIB001", description: "Library Fee", amount: 1000 },
  { code: "CLUB001", description: "Club/Student Activity Fee", amount: 500 },
];
