export type Major = 'Computer Science & Engineering' | 'Electrical & Electronic Engineering' | 'Business Administration';

export interface Course {
  code: string;
  title: string;
  section: string;
  credits: number;
  grade?: string;
  marks?: number;
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

export interface StudentDetails {
  profile: StudentProfile;
  registeredCourses: Course[];
  completedCourses: Course[];
  schedule: ClassSchedule[];
  transactions: Transaction[];
  teachers: Instructor[];
  exams: {
    securityCode?: string;
    courseCode: string;
    title: string;
    section: string;
    type: string;
    day: string;
    date: string;
    time: string;
    room: string;
    campus: string;
    faculty: string;
    semester?: string;
  }[];
}

import eeeCourses from './eee_courses.json';

// Constant fallback data for non-dynamic or legacy views
export const STUDENT_DATA: StudentProfile = {
  id: "2610329040",
  name: "Nakib Hassan Prince",
  status: "Registered",
  admissionSemester: "Spring-26",
  currentSemester: "Summer-26",
  program: "Electrical & Electronic Engineering",
  creditsTaken: 0,
  creditsCompleted: 22,
  cgpa: 3.11,
  accountBalance: 0.00,
  email: "nakibprince666@gmail.com",
  gpaHistory: [
    { semester: "Spring-26", gpa: 2.92 },
    { semester: "Summer-26", gpa: 3.24 }
  ]
};

export const REGISTERED_COURSES: Course[] = [];

export const COMPLETED_COURSES: Course[] = [
  // Spring-26 (9 Credits)
  { code: "EEE201", title: "Electrical Circuits I", section: "5", credits: 3.00, grade: "B-", marks: 74, semester: "Spring-26", faculty: "Mushfika", fee: 7500 },
  { code: "ENG099", title: "Basic English", section: "18", credits: 3.00, grade: "A-", marks: 87, semester: "Spring-26", faculty: "Harisun", fee: 7500 },
  { code: "MAT121", title: "Pre-Calculus", section: "18", credits: 3.00, grade: "C+", marks: 68, semester: "Spring-26", faculty: "Ibrahim", fee: 7500 },
  
  // Summer-26 (13 Credits)
  { code: "EEE203", title: "Electrical Circuits II", section: "5", credits: 3.00, grade: "C+", marks: 69, semester: "Summer-26", faculty: "Mushfika", fee: 7500 },
  { code: "ENG101", title: "English Reading & Composition", section: "21", credits: 3.00, grade: "A+", marks: 92, semester: "Summer-26", faculty: "Harisun", fee: 7500 },
  { code: "MAT123", title: "Calculus I", section: "6", credits: 3.00, grade: "B-", marks: 73, semester: "Summer-26", faculty: "Ibrahim", fee: 7500 },
  { code: "PHY107", title: "General Physics I", section: "6", credits: 3.00, grade: "A-", marks: 86, semester: "Summer-26", faculty: "Alif", fee: 7500 },
  { code: "PHY108", title: "General Physics I Laboratory", section: "6", credits: 1.00, grade: "A+", marks: 95, semester: "Summer-26", faculty: "Alif", fee: 2500 }
];

export const AVAILABLE_COURSES: Course[] = eeeCourses.map((c) => ({
  ...c,
  section: "1",
  semester: "Summer-26",
  faculty: "TBA",
  fee: c.credits * 2500,
  syllabus: "Syllabus for " + c.title,
}));

export const SCHEDULE_DATA: ClassSchedule[] = [];

export const TRANSACTIONS_DATA: Transaction[] = [
  { id: "15", date: "06-08-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 13531, balance: 0 },
  { id: "14", date: "25-07-26", code: "FEE128", description: "Late Fee, Payment-2, w.e.f Fall 2022", debit: 500, credit: 0, balance: -13531 },
  { id: "13", date: "06-07-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 10200, balance: -13031 },
  { id: "12", date: "29-06-26", code: "FEE127", description: "Late Fee, Payment-1, w.e.f Fall 2022", debit: 500, credit: 0, balance: -23231 },
  { id: "11", date: "13-05-26", code: "PAY099", description: "Cash Payment (Tuition Fee (Received by Bkash, Dated: 05/12/2026))", debit: 0, credit: 19, balance: -22731 },
  { id: "10", date: "11-05-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 20, balance: -22750 },
  { id: "9", date: "07-05-26", code: "WAV001", description: "Less 25.00% Tuition Waiver", debit: 0, credit: 8125, balance: -22770 },
  { id: "8", date: "07-05-26", code: "FEE400", description: "Semester Fee w.e.f 261", debit: 6000, credit: 0, balance: -30895 },
  { id: "7", date: "07-05-26", code: "PHY108", description: "General Physics I Laboratory", debit: 2500, credit: 0, balance: -24895 },
  { id: "6", date: "07-05-26", code: "PHY107", description: "General Physics I", debit: 7500, credit: 0, balance: -22395 },
  { id: "5", date: "07-05-26", code: "MAT123", description: "Calculus I", debit: 7500, credit: 0, balance: -14895 },
  { id: "4", date: "07-05-26", code: "ENG101", description: "English Reading & Composition", debit: 7500, credit: 0, balance: -7395 },
  { id: "3", date: "07-05-26", code: "EEE203", description: "Electrical Circuits II", debit: 7500, credit: 0, balance: 105 },
  { id: "2", date: "05-05-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 105, balance: 7605 },
  { id: "1", date: "05-05-26", code: "PAY099", description: "API Payment - nagad", debit: 0, credit: 7500, balance: 7500 }
];

export const TEACHERS_DATA: Instructor[] = [
  { initial: "Harisun", name: "Harisun Azize", email: "harisun.azize@presidency.edu.bd", department: "Department of English", courses: "ENG101-21, ENG099-18" },
  { initial: "Ibrahim", name: "Md. Ibrahim Khalil", email: "ibrahim.khalil@presidency.edu.bd", department: "Department of Mathematics", courses: "MAT123-6, MAT121-18" },
  { initial: "Mushfika", name: "Mushfika Ikfat", email: "mushfika.ikfat@presidency.edu.bd", department: "Department of EEE", courses: "EEE203-5, EEE201-5" },
  { initial: "Alif", name: "Sheikh Md Alif Nur Nahid", email: "alif.nahid@presidency.edu.bd", department: "Department of Physics", courses: "PHY107-6, PHY108-6" },
];

export const FEES_LIST = [
  { code: "FEE051", description: "ID Card Fee", amount: 100.00 },
  { code: "FEE054", description: "Academic Record Verification Fee(Bangla Medium), w.e.f 141 students", amount: 500.00 },
  { code: "FEE055", description: "Academic Record Verification Fee(Eng. Medium), w.e.f 141 students", amount: 1500.00 },
  { code: "FEE080", description: "Reinstate fee - Post Graduate Student", amount: 8000.00 },
  { code: "FEE082", description: "Reinstate fee - Undergraduate Student", amount: 10000.00 },
  { code: "FEE087", description: "Processing Fee, w.e.f 141 Students, for foreign student", amount: 2000.00 },
  { code: "FEE088", description: "Processing Fee, w.e.f 141 Students", amount: 300.00 },
  { code: "FEE091", description: "Admission Fee 2014", amount: 10500.00 },
  { code: "FEE093", description: "Admission fee 2014", amount: 12500.00 },
  { code: "FEE109", description: "1st Midterm make-up exam processing fee: w.e.f summer 2016", amount: 1000.00 },
  { code: "FEE110", description: "2nd Midterm make-up exam processing fee: w.e.f summer 2016", amount: 1000.00 },
  { code: "FEE115", description: "Final make-up exam processing fee : w.e.f summer 2016", amount: 2000.00 },
  { code: "FEE135", description: "Transcript fee: w.e.f 10th Oct,11", amount: 500.00 },
  { code: "FEE136", description: "Degree Processing Fees, w.e.f 30th Oct,11", amount: 1000.00 },
  { code: "FEE137", description: "Certificate Processing Fee", amount: 3000.00 },
  { code: "FEE141", description: "Convocation Registration Fee", amount: 2000.00 },
  { code: "FEE142", description: "Convocation Guest Fee", amount: 1500.00 },
  { code: "PAY099", description: "Cash Payment", amount: 0.00 },
  { code: "PAY000", description: "Others Fee", amount: 0.00 }
];

// Preserved predefined students
export const PREDEFINED_STUDENTS_LIST = [
  { id: "2610329040", name: "Nakib Hassan Prince", program: "Electrical & Electronic Engineering", status: "Registered", cgpa: 3.11 },
];

/**
 * Returns student portal data for the student
 */
export function getStudentData(studentId?: string | null): StudentDetails {
  return {
    profile: {
      id: "2610329040",
      name: "Nakib Hassan Prince",
      status: "Registered",
      admissionSemester: "Spring-26",
      currentSemester: "Summer-26",
      program: "Electrical & Electronic Engineering",
      creditsTaken: 0,
      creditsCompleted: 22,
      cgpa: 3.11,
      accountBalance: 0.00,
      email: "nakibprince666@gmail.com",
      gpaHistory: [
        { semester: "Spring-26", gpa: 2.92 },
        { semester: "Summer-26", gpa: 3.24 }
      ]
    },
    registeredCourses: [...REGISTERED_COURSES],
    completedCourses: [...COMPLETED_COURSES],
    schedule: [...SCHEDULE_DATA],
    transactions: [...TRANSACTIONS_DATA],
    teachers: [...TEACHERS_DATA],
    exams: []
  };
}