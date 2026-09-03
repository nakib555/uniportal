import eeeCourses from './eee_courses.json';
import { PuSyncService } from '../services/puSyncService';

export type Major = string;

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
  photo?: string;
  gpaHistory?: { semester: string; gpa: number }[];
}

export interface StatementSummary {
  lastSemesterBalance: number;
  totalTuitionAndFees: number;
  totalSemesterWaiver: number;
  totalOtherAdjustment: number;
  toBePaidCurrentSemester: number;
  semesterFee: number;
  totalCourseFees: number;
  othersFee: number;
  totalFeesToBePaid: number;
  totalCashPaid: number;
  totalDues: number;
}

export interface InstalmentInfo {
  no: string;
  deadline: string;
  amount: number;
  cashPaid: number;
  dues: number;
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
  bankSlipFees?: { code: string; description: string; amount: number }[];
  statementSummary?: StatementSummary;
  instalments?: InstalmentInfo[];
}

// Constant fallback data for non-dynamic or legacy views
export const STUDENT_DATA: StudentProfile = {
  id: "",
  name: "Student",
  status: "",
  admissionSemester: "",
  currentSemester: "",
  program: "",
  creditsTaken: 0,
  creditsCompleted: 0,
  cgpa: 0.00,
  accountBalance: 0.00,
  email: "",
  gpaHistory: []
};

export const REGISTERED_COURSES: Course[] = [];

export const COMPLETED_COURSES: Course[] = [];

export const AVAILABLE_COURSES: Course[] = eeeCourses.map((c) => ({
  ...c,
  section: "1",
  semester: "Summer-26",
  faculty: "TBA",
  fee: c.credits * 2500,
  syllabus: "Syllabus for " + c.title,
}));

export const SCHEDULE_DATA: ClassSchedule[] = [];

export const TRANSACTIONS_DATA: Transaction[] = [];

export const TEACHERS_DATA: Instructor[] = [];

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

// Preserved predefined students list - empty by default
export const PREDEFINED_STUDENTS_LIST: { id: string; name: string; program: string; status: string; cgpa: number }[] = [];

/**
 * Returns student portal data dynamically with zero pre-preserved records,
 * or synchronized records if fetched from Presidency SIMS.
 */
export function getStudentData(studentId?: string | null): StudentDetails {
  const currentId = studentId && studentId.trim() ? studentId.trim() : "";
  
  // Check if real-time synced student data exists in sync registry
  const synced = PuSyncService.getSyncedStudent(currentId);
  if (synced) {
    return synced;
  }

  const studentName = currentId ? `Student ${currentId}` : "Student";
  
  return {
    profile: {
      id: currentId,
      name: studentName,
      status: "",
      admissionSemester: "",
      currentSemester: "",
      program: "",
      creditsTaken: 0,
      creditsCompleted: 0,
      cgpa: 0.00,
      accountBalance: 0.00,
      email: currentId ? `${currentId}@student.presidency.edu.bd` : "",
      gpaHistory: []
    },
    registeredCourses: [...REGISTERED_COURSES],
    completedCourses: [...COMPLETED_COURSES],
    schedule: [...SCHEDULE_DATA],
    transactions: [...TRANSACTIONS_DATA],
    teachers: [...TEACHERS_DATA],
    exams: []
  };
}