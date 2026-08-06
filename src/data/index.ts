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

export interface StudentDetails {
  profile: StudentProfile;
  registeredCourses: Course[];
  completedCourses: Course[];
  schedule: ClassSchedule[];
  transactions: Transaction[];
  teachers: Instructor[];
  exams: {
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
  creditsTaken: 13,
  creditsCompleted: 9,
  cgpa: 2.92,
  accountBalance: -13531,
  email: "nakibprince666@gmail.com",
  gpaHistory: [
    { semester: "Spring-26", gpa: 2.92 }
  ]
};

export const REGISTERED_COURSES: Course[] = [
  { code: "EEE203", title: "Electrical Circuits II", section: "5", credits: 3.00, semester: "Summer-26", faculty: "Mushfika", fee: 7500, prerequisites: ["EEE201"], syllabus: "A.C. quantities, phasor algebra, series and parallel AC circuits." },
  { code: "ENG101", title: "English Reading & Composition", section: "21", credits: 3.00, semester: "Summer-26", faculty: "Harisun", fee: 7500, prerequisites: [], syllabus: "Development of reading and writing skills." },
  { code: "MAT123", title: "Calculus I", section: "6", credits: 3.00, semester: "Summer-26", faculty: "Ibrahim", fee: 7500, prerequisites: ["MAT121"], syllabus: "Limits, continuity, differentiation, integration." },
  { code: "PHY107", title: "General Physics I", section: "6", credits: 3.00, semester: "Summer-26", faculty: "Alif", fee: 7500, prerequisites: [], syllabus: "Mechanics, waves, thermodynamics." },
  { code: "PHY108", title: "General Physics I Laboratory", section: "6", credits: 1.00, semester: "Summer-26", faculty: "Alif", fee: 2500, prerequisites: ["PHY107"], syllabus: "Laboratory experiments on general physics." }
];

export const COMPLETED_COURSES: Course[] = [
  { code: "EEE201", title: "Electrical Circuits I", section: "5", credits: 3.00, grade: "B-", semester: "Spring-26", faculty: "Mushfika", fee: 7500 },
  { code: "ENG099", title: "Basic English", section: "18", credits: 3.00, grade: "A-", semester: "Spring-26", faculty: "Harisun", fee: 7500 },
  { code: "MAT121", title: "Pre-Calculus", section: "18", credits: 3.00, grade: "C+", semester: "Spring-26", faculty: "Ibrahim", fee: 7500 }
];

export const AVAILABLE_COURSES: Course[] = eeeCourses.map((c) => ({
  ...c,
  section: "1",
  semester: "Summer-26",
  faculty: "TBA",
  fee: c.credits * 2500,
  syllabus: "Syllabus for " + c.title,
}));

export const SCHEDULE_DATA: ClassSchedule[] = [
  { courseCode: "EEE203", section: "5", day: "Monday", start: "11:20:00", end: "12:30:00", room: "513", campus: "Gulshan", faculty: "Mushfika", semester: "Summer-26" },
  { courseCode: "EEE203", section: "5", day: "Wednesday", start: "11:20:00", end: "12:30:00", room: "513", campus: "Gulshan", faculty: "Mushfika", semester: "Summer-26" },
  { courseCode: "MAT123", section: "6", day: "Monday", start: "12:35:00", end: "13:45:00", room: "613", campus: "Gulshan", faculty: "Ibrahim", semester: "Summer-26" },
  { courseCode: "MAT123", section: "6", day: "Wednesday", start: "12:35:00", end: "13:45:00", room: "613", campus: "Gulshan", faculty: "Ibrahim", semester: "Summer-26" },
  { courseCode: "ENG101", section: "21", day: "Monday", start: "13:50:00", end: "15:00:00", room: "613", campus: "Gulshan", faculty: "Harisun", semester: "Summer-26" },
  { courseCode: "ENG101", section: "21", day: "Wednesday", start: "13:50:00", end: "15:00:00", room: "613", campus: "Gulshan", faculty: "Harisun", semester: "Summer-26" },
  { courseCode: "PHY108", section: "6", day: "Tuesday", start: "12:35:00", end: "15:00:00", room: "601", campus: "Gulshan", faculty: "Alif", semester: "Summer-26" },
  { courseCode: "PHY107", section: "6", day: "Tuesday", start: "15:05:00", end: "17:30:00", room: "502", campus: "Gulshan", faculty: "Alif", semester: "Summer-26" }
];

export const TRANSACTIONS_DATA: Transaction[] = [
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
  { id: "2610329040", name: "Nakib Hassan Prince", program: "Electrical & Electronic Engineering", status: "Registered", cgpa: 2.92 },
  { id: "21104104", name: "Al Ibrahim", program: "Computer Science & Engineering", status: "Registered", cgpa: 3.82 },
  { id: "21104105", name: "Sarah Ahmed", program: "Computer Science & Engineering", status: "Registered", cgpa: 3.91 },
  { id: "21104106", name: "Fahim Rahman", program: "Computer Science & Engineering", status: "Regular", cgpa: 2.85 },
  { id: "21104107", name: "Nusrat Jahan", program: "Computer Science & Engineering", status: "Regular", cgpa: 3.45 },
  { id: "21104108", name: "Rafiq Islam", program: "Business Administration", status: "Regular", cgpa: 3.12 },
];

/**
 * Dynamically gets or generates data for any student ID
 */
export function getStudentData(studentId: string | null): StudentDetails {
  const currentId = studentId || "2610329040";

  // Case 1: Nakib Hassan Prince (Exact Raw Dump)
  if (currentId === "2610329040") {
    return {
      profile: {
        id: "2610329040",
        name: "Nakib Hassan Prince",
        status: "Registered",
        admissionSemester: "Spring-26",
        currentSemester: "Summer-26",
        program: "Electrical & Electronic Engineering",
        creditsTaken: 13,
        creditsCompleted: 9,
        cgpa: 2.92,
        accountBalance: -13531, // Negative indicates outstanding dues
        email: "nakibprince666@gmail.com",
        gpaHistory: [
          { semester: "Spring-26", gpa: 2.92 }
        ]
      },
      registeredCourses: [...REGISTERED_COURSES],
      completedCourses: [...COMPLETED_COURSES],
      schedule: [...SCHEDULE_DATA],
      transactions: [...TRANSACTIONS_DATA],
      teachers: [...TEACHERS_DATA],
      exams: [
        { courseCode: "PHY108", title: "General Physics I Laboratory", section: "6", type: "Final Exam", day: "Monday", date: "17-08-2026", time: "03:00 PM - 05:00 PM", room: "410", campus: "Gulshan", faculty: "Alif" },
        { courseCode: "EEE203", title: "Electrical Circuits II", section: "5", type: "Final Exam", day: "Saturday", date: "22-08-2026", time: "03:00 PM - 05:00 PM", room: "204", campus: "Gulshan", faculty: "Mushfika" },
        { courseCode: "MAT123", title: "Calculus I", section: "6", type: "Final Exam", day: "Monday", date: "24-08-2026", time: "03:00 PM - 05:00 PM", room: "204", campus: "Gulshan", faculty: "Ibrahim" },
        { courseCode: "PHY107", title: "General Physics I", section: "6", type: "Final Exam", day: "Tuesday", date: "25-08-2026", time: "03:00 PM - 05:00 PM", room: "204", campus: "Gulshan", faculty: "Alif" },
        { courseCode: "ENG101", title: "English Reading & Composition", section: "21", type: "Final Exam", day: "Thursday", date: "27-08-2026", time: "03:00 PM - 05:00 PM", room: "204", campus: "Gulshan", faculty: "Harisun" }
      ]
    };
  }

  // Case 2: Predefined Student (e.g. Al Ibrahim CSE)
  const matchedPredefined = PREDEFINED_STUDENTS_LIST.find(s => s.id === currentId);
  if (matchedPredefined) {
    const cgpa = matchedPredefined.cgpa;
    const name = matchedPredefined.name;
    const program = matchedPredefined.program as Major;
    
    // Custom simulated courses for CSE student
    const isCSE = program.includes("Computer Science");
    const regCourses: Course[] = isCSE ? [
      { code: "CSE211", title: "Object Oriented Programming", section: "2", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 },
      { code: "CSE212", title: "Object Oriented Programming Lab", section: "2", credits: 1.00, semester: "Summer-26", faculty: "TBA", fee: 2500 },
      { code: "MAT215", title: "Linear Algebra & Complex Variables", section: "3", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 },
      { code: "CSE215", title: "Data Structures", section: "1", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 }
    ] : [
      { code: "BUS201", title: "Principles of Management", section: "1", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 },
      { code: "ACT201", title: "Financial Accounting", section: "1", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 },
      { code: "ECO101", title: "Microeconomics", section: "2", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 }
    ];

    const completed: Course[] = isCSE ? [
      { code: "CSE101", title: "Intro to Computing", section: "1", credits: 3.00, grade: "A", semester: "Spring-26", faculty: "shadab", fee: 7500 },
      { code: "MAT121", title: "Pre-Calculus", section: "5", credits: 3.00, grade: "A-", semester: "Spring-26", faculty: "Ibrahim", fee: 7500 }
    ] : [
      { code: "BUS101", title: "Introduction to Business", section: "1", credits: 3.00, grade: "A", semester: "Spring-26", faculty: "TBA", fee: 7500 }
    ];

    const sched: ClassSchedule[] = isCSE ? [
      { courseCode: "CSE211", section: "2", day: "Monday", start: "08:30:00", end: "09:45:00", room: "403", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" },
      { courseCode: "CSE211", section: "2", day: "Wednesday", start: "08:30:00", end: "09:45:00", room: "403", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" },
      { courseCode: "MAT215", section: "3", day: "Monday", start: "10:00:00", end: "11:15:00", room: "403", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" },
      { courseCode: "MAT215", section: "3", day: "Wednesday", start: "10:00:00", end: "11:15:00", room: "403", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" }
    ] : [
      { courseCode: "BUS201", section: "1", day: "Sunday", start: "10:00:00", end: "11:15:00", room: "302", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" },
      { courseCode: "BUS201", section: "1", day: "Tuesday", start: "10:00:00", end: "11:15:00", room: "302", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" }
    ];

    const txs: Transaction[] = [
      { id: "1", date: "05-05-26", code: "PAY099", description: "API Payment - bkash", debit: 0, credit: 15000, balance: 0 },
      { id: "2", date: "07-05-26", code: "FEE400", description: "Semester Fee w.e.f 261", debit: 6000, credit: 0, balance: -6000 },
      { id: "3", date: "07-05-26", code: "CSE211", description: "Course Charges", debit: 9000, credit: 0, balance: -15000 }
    ];

    return {
      profile: {
        id: currentId,
        name: name,
        status: matchedPredefined.status,
        admissionSemester: "Spring-26",
        currentSemester: "Summer-26",
        program: program,
        creditsTaken: regCourses.reduce((sum, c) => sum + c.credits, 0),
        creditsCompleted: completed.reduce((sum, c) => sum + c.credits, 0),
        cgpa: cgpa,
        accountBalance: 0, // Paid in full
        email: name.toLowerCase().replace(/\s+/g, '') + "@student.presidency.edu.bd",
        gpaHistory: [
          { semester: "Spring-26", gpa: cgpa }
        ]
      },
      registeredCourses: regCourses,
      completedCourses: completed,
      schedule: sched,
      transactions: txs,
      teachers: [
        { initial: "TBA", name: "To Be Assigned", email: "info@presidency.edu.bd", department: isCSE ? "CSE" : "BBA", courses: "All" }
      ],
      exams: [
        { courseCode: regCourses[0]?.code || "CSE211", title: regCourses[0]?.title || "Course Exam", section: "1", type: "Final Exam", day: "Sunday", date: "16-08-2026", time: "10:00 AM - 12:00 PM", room: "303", campus: "Gulshan", faculty: "TBA" }
      ]
    };
  }

  // Case 3: Fully Dynamic Auto-Generated Student (Accept literally any typed ID!)
  // This satisfies "any user can see there info data by id pass login like real"
  const cleanId = currentId.replace(/[^0-9]/g, "") || "220000";
  const seed = parseInt(cleanId) || 1234567;
  const computedCgpa = parseFloat((3.0 + (seed % 100) / 100).toFixed(2));
  const studentName = `Simulated Student #${cleanId}`;

  return {
    profile: {
      id: currentId,
      name: studentName,
      status: "Regular",
      admissionSemester: "Fall-25",
      currentSemester: "Summer-26",
      program: "Computer Science & Engineering",
      creditsTaken: 12,
      creditsCompleted: 24,
      cgpa: computedCgpa,
      accountBalance: -2500, // owes 2500 Taka
      email: `student.${cleanId}@presidency.edu.bd`,
      gpaHistory: [
        { semester: "Fall-25", gpa: computedCgpa },
        { semester: "Spring-26", gpa: Math.min(4.0, computedCgpa + 0.1) }
      ]
    },
    registeredCourses: [
      { code: "CSE215", title: "Data Structures", section: "1", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 },
      { code: "CSE216", title: "Data Structures Lab", section: "1", credits: 1.00, semester: "Summer-26", faculty: "TBA", fee: 2500 },
      { code: "MAT211", title: "Linear Algebra", section: "2", credits: 3.00, semester: "Summer-26", faculty: "TBA", fee: 7500 }
    ],
    completedCourses: [
      { code: "CSE101", title: "Intro to Computing", section: "1", credits: 3.00, grade: "A-", semester: "Spring-26", faculty: "TBA", fee: 7500 },
      { code: "MAT121", title: "Pre-Calculus", section: "2", credits: 3.00, grade: "B+", semester: "Spring-26", faculty: "TBA", fee: 7500 }
    ],
    schedule: [
      { courseCode: "CSE215", section: "1", day: "Sunday", start: "08:30:00", end: "09:45:00", room: "305", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" },
      { courseCode: "CSE215", section: "1", day: "Tuesday", start: "08:30:00", end: "09:45:00", room: "305", campus: "Gulshan", faculty: "TBA", semester: "Summer-26" }
    ],
    transactions: [
      { id: "1", date: "05-05-26", code: "PAY099", description: "Initial Deposit via BKash", debit: 0, credit: 5000, balance: 5000 },
      { id: "2", date: "07-05-26", code: "FEE400", description: "Semester Fee w.e.f 261", debit: 6000, credit: 0, balance: -1000 },
      { id: "3", date: "07-05-26", code: "CSE215", description: "Tuition Charge", debit: 7500, credit: 0, balance: -8500 }
    ],
    teachers: [
      { initial: "TBA", name: "To Be Assigned", email: "info@presidency.edu.bd", department: "CSE", courses: "All" }
    ],
    exams: [
      { courseCode: "CSE215", title: "Data Structures", section: "1", type: "Final Exam", day: "Monday", date: "17-08-2026", time: "11:00 AM - 01:00 PM", room: "404", campus: "Gulshan", faculty: "TBA" }
    ]
  };
}