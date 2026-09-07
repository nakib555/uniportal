import type { Connect } from 'vite';
import http from 'http';
import type { StudentDetails, Course, ClassSchedule, Transaction, Instructor, StudentProfile } from '../data';

/**
 * Clean & Secure Academic Portal Simulation Engine
 * Completely offline, compliant with internet law, and decoupled from any external servers.
 * Provides beautiful, highly interactive, and deterministic demo student profiles.
 */

// Helper to generate initials for avatar
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate deterministic student profile based on ID
function generateStudentProfile(studentId: string): StudentProfile {
  const cleanId = studentId.trim();
  const idNum = parseInt(cleanId.replace(/\D/g, ''), 10) || 123456;
  
  // Deterministic name lists
  const firstNames = ['Arif', 'Nakib', 'Farhana', 'Tanvir', 'Anika', 'Sajid', 'Maimuna', 'Zubayer', 'Naimur', 'Aditya'];
  const lastNames = ['Rahman', 'Prince', 'Islam', 'Ahmed', 'Tasnim', 'Hasan', 'Khatun', 'Al Mamun', 'Roy', 'Sultana'];
  
  const firstName = firstNames[idNum % firstNames.length];
  const lastName = lastNames[(idNum + 3) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  
  // Admission semesters
  const years = [2022, 2023, 2024, 2025];
  const terms = ['Spring', 'Summer', 'Autumn'];
  const admissionYear = years[idNum % years.length];
  const admissionTerm = terms[(idNum + 1) % terms.length];
  const admissionSemester = `${admissionTerm}-${admissionYear}`;

  // Deterministic CGPA
  const baseCgpa = 3.2 + ((idNum % 81) / 100); // ranges between 3.20 and 4.00
  const cgpa = Math.min(4.00, Math.max(2.00, parseFloat(baseCgpa.toFixed(2))));

  // Credits Calculation
  const totalTermsCompleted = (2026 - admissionYear) * 3 + (2 - terms.indexOf(admissionTerm));
  const avgCreditsPerTerm = 12;
  const creditsCompleted = Math.max(12, Math.min(140, totalTermsCompleted * avgCreditsPerTerm));
  
  // Dynamic balance dues
  const accountBalance = (idNum % 2) === 0 ? 11400 : 0;

  return {
    id: cleanId,
    name,
    status: 'Active',
    admissionSemester,
    currentSemester: 'Summer-2026',
    program: 'Bachelor of Science in Electrical and Electronic Engineering (EEE)',
    creditsTaken: 11.0,
    creditsCompleted,
    cgpa,
    accountBalance,
    email: `${cleanId.toLowerCase()}@student.university.edu`,
    gpaHistory: [
      { semester: 'Spring-2025', gpa: parseFloat((cgpa - 0.1).toFixed(2)) },
      { semester: 'Summer-2025', gpa: parseFloat(cgpa.toFixed(2)) },
      { semester: 'Autumn-2025', gpa: parseFloat(Math.min(4.0, cgpa + 0.15).toFixed(2)) },
      { semester: 'Spring-2026', gpa: parseFloat((cgpa - 0.05).toFixed(2)) }
    ]
  };
}

// Generate course ledger details
function generateStudentData(studentId: string): StudentDetails {
  const profile = generateStudentProfile(studentId);
  const idNum = parseInt(studentId.replace(/\D/g, ''), 10) || 123456;

  // Standard EEE courses we can dynamically list
  const registeredCourses: Course[] = [
    {
      code: 'EEE-311',
      title: 'Microprocessor and Interfacing',
      section: '1',
      credits: 3.0,
      semester: 'Summer-2026',
      faculty: 'Dr. M. Alam',
      fee: 7500,
      syllabus: 'Introduction to microprocessors, architecture, assembly language, memory interfacing, and programmable peripheral devices.'
    },
    {
      code: 'EEE-312',
      title: 'Microprocessor and Interfacing Lab',
      section: '1',
      credits: 1.5,
      semester: 'Summer-2026',
      faculty: 'Engr. S. Kabir',
      fee: 3750,
      syllabus: 'Practical assembly language programming, interfacing microprocessors with LEDs, stepper motors, and sensor systems.'
    },
    {
      code: 'EEE-321',
      title: 'Communication Theory',
      section: '1',
      credits: 3.0,
      semester: 'Summer-2026',
      faculty: 'Dr. R. Islam',
      fee: 7500,
      syllabus: 'Signals and systems, modulation techniques (AM, FM, PM), digital communication bases, and noise modeling.'
    },
    {
      code: 'EEE-322',
      title: 'Communication Lab',
      section: '2',
      credits: 1.5,
      semester: 'Summer-2026',
      faculty: 'Engr. H. Chowdhury',
      fee: 3750,
      syllabus: 'Laboratory experiments implementing analog modulators, digital keying architectures, and noise filters.'
    },
    {
      code: 'HUM-201',
      title: 'Engineering Ethics & Professionalism',
      section: '1',
      credits: 2.0,
      semester: 'Summer-2026',
      faculty: 'Ms. N. Sultana',
      fee: 5000,
      syllabus: 'Ethical theories, safety, liability, environmental preservation, and codes of conduct in engineering practice.'
    }
  ];

  const completedCourses: Course[] = [
    { code: 'EEE-101', title: 'Electrical Circuits I', section: '1', credits: 3.0, grade: 'A+', semester: 'Spring-2023', faculty: 'Dr. A. Karim', fee: 7500 },
    { code: 'EEE-102', title: 'Electrical Circuits Lab I', section: '1', credits: 1.5, grade: 'A', semester: 'Spring-2023', faculty: 'Engr. K. Yasmin', fee: 3750 },
    { code: 'MAT-101', title: 'Differential and Integral Calculus', section: '2', credits: 3.0, grade: 'A-', semester: 'Spring-2023', faculty: 'Prof. M. Rahman', fee: 7500 },
    { code: 'PHY-101', title: 'Physics I (Mechanics and Waves)', section: '1', credits: 3.0, grade: 'B+', semester: 'Spring-2023', faculty: 'Dr. S. Roy', fee: 7500 },
    
    { code: 'EEE-111', title: 'Electrical Circuits II', section: '2', credits: 3.0, grade: 'A+', semester: 'Summer-2023', faculty: 'Dr. A. Karim', fee: 7500 },
    { code: 'EEE-112', title: 'Electrical Circuits Lab II', section: '2', credits: 1.5, grade: 'A+', semester: 'Summer-2023', faculty: 'Engr. K. Yasmin', fee: 3750 },
    { code: 'MAT-102', title: 'Co-ordinate Geometry & Vector Analysis', section: '1', credits: 3.0, grade: 'A', semester: 'Summer-2023', faculty: 'Prof. M. Rahman', fee: 7500 },
    { code: 'CSE-101', title: 'Computer Programming', section: '3', credits: 3.0, grade: 'B', semester: 'Summer-2023', faculty: 'Engr. J. Uddin', fee: 7500 },
    
    { code: 'EEE-201', title: 'Electronic Circuits I', section: '1', credits: 3.0, grade: 'A-', semester: 'Autumn-2023', faculty: 'Dr. M. Alam', fee: 7500 },
    { code: 'EEE-202', title: 'Electronic Circuits Lab I', section: '1', credits: 1.5, grade: 'A+', semester: 'Autumn-2023', faculty: 'Engr. S. Kabir', fee: 3750 },
    { code: 'MAT-201', title: 'Linear Algebra & Complex Variables', section: '1', credits: 3.0, grade: 'A', semester: 'Autumn-2023', faculty: 'Dr. F. Ahmed', fee: 7500 },
    
    { code: 'EEE-211', title: 'Electronic Circuits II', section: '1', credits: 3.0, grade: 'B+', semester: 'Spring-2024', faculty: 'Dr. M. Alam', fee: 7500 },
    { code: 'EEE-212', title: 'Electronic Circuits Lab II', section: '1', credits: 1.5, grade: 'A', semester: 'Spring-2024', faculty: 'Engr. S. Kabir', fee: 3750 },
    { code: 'EEE-221', title: 'Signals and Systems', section: '1', credits: 3.0, grade: 'A+', semester: 'Spring-2024', faculty: 'Dr. R. Islam', fee: 7500 },
    
    { code: 'EEE-231', title: 'Electrical Machines I', section: '2', credits: 3.0, grade: 'A', semester: 'Summer-2024', faculty: 'Prof. L. Ali', fee: 7500 },
    { code: 'EEE-232', title: 'Electrical Machines Lab I', section: '1', credits: 1.5, grade: 'A-', semester: 'Summer-2024', faculty: 'Engr. R. Amin', fee: 3750 },
    { code: 'MAT-202', title: 'Differential Equations', section: '1', credits: 3.0, grade: 'A+', semester: 'Summer-2024', faculty: 'Dr. F. Ahmed', fee: 7500 },
    
    { code: 'EEE-241', title: 'Electrical Machines II', section: '1', credits: 3.0, grade: 'B+', semester: 'Autumn-2024', faculty: 'Prof. L. Ali', fee: 7500 },
    { code: 'EEE-242', title: 'Electrical Machines Lab II', section: '1', credits: 1.5, grade: 'A', semester: 'Autumn-2024', faculty: 'Engr. R. Amin', fee: 3750 },
    { code: 'EEE-251', title: 'Electromagnetic Fields & Waves', section: '1', credits: 3.0, grade: 'A-', semester: 'Autumn-2024', faculty: 'Dr. S. Roy', fee: 7500 },
    
    { code: 'EEE-301', title: 'Digital Electronics', section: '2', credits: 3.0, grade: 'A', semester: 'Spring-2025', faculty: 'Dr. M. Alam', fee: 7500 },
    { code: 'EEE-302', title: 'Digital Electronics Lab', section: '1', credits: 1.5, grade: 'A+', semester: 'Spring-2025', faculty: 'Engr. S. Kabir', fee: 3750 },
    { code: 'MAT-301', title: 'Probability and Statistics', section: '2', credits: 3.0, grade: 'B+', semester: 'Spring-2025', faculty: 'Dr. F. Ahmed', fee: 7500 }
  ];

  const schedule: ClassSchedule[] = [
    { courseCode: 'EEE-311', day: 'Monday', start: '10:00 AM', end: '11:30 AM', room: 'Room 304', campus: 'Main Campus', faculty: 'Dr. M. Alam' },
    { courseCode: 'EEE-311', day: 'Wednesday', start: '10:00 AM', end: '11:30 AM', room: 'Room 304', campus: 'Main Campus', faculty: 'Dr. M. Alam' },
    { courseCode: 'EEE-312', day: 'Monday', start: '02:00 PM', end: '05:00 PM', room: 'Lab A', campus: 'Main Campus', faculty: 'Engr. S. Kabir' },
    { courseCode: 'EEE-321', day: 'Tuesday', start: '11:40 AM', end: '01:10 PM', room: 'Room 402', campus: 'Main Campus', faculty: 'Dr. R. Islam' },
    { courseCode: 'EEE-321', day: 'Thursday', start: '11:40 AM', end: '01:10 PM', room: 'Room 402', campus: 'Main Campus', faculty: 'Dr. R. Islam' },
    { courseCode: 'EEE-322', day: 'Tuesday', start: '02:00 PM', end: '05:00 PM', room: 'Lab B', campus: 'Main Campus', faculty: 'Engr. H. Chowdhury' },
    { courseCode: 'HUM-201', day: 'Wednesday', start: '01:20 PM', end: '02:50 PM', room: 'Room 305', campus: 'Main Campus', faculty: 'Ms. N. Sultana' }
  ];

  const teachers: Instructor[] = [
    { initial: 'MA', name: 'Dr. M. Alam', email: 'm.alam@faculty.university.edu', department: 'EEE', courses: 'EEE-311, EEE-301' },
    { initial: 'SK', name: 'Engr. S. Kabir', email: 's.kabir@faculty.university.edu', department: 'EEE', courses: 'EEE-312, EEE-302' },
    { initial: 'RI', name: 'Dr. R. Islam', email: 'r.islam@faculty.university.edu', department: 'EEE', courses: 'EEE-321, EEE-221' },
    { initial: 'HC', name: 'Engr. H. Chowdhury', email: 'h.chowdhury@faculty.university.edu', department: 'EEE', courses: 'EEE-322' },
    { initial: 'NS', name: 'Ms. N. Sultana', email: 'n.sultana@faculty.university.edu', department: 'Humanities', courses: 'HUM-201' }
  ];

  const exams = [
    { courseCode: 'EEE-311', title: 'Microprocessor and Interfacing', section: '1', type: 'Final Exam', day: 'Monday', date: '12-Oct-2026', time: '10:00 AM - 01:00 PM', room: 'Room 304', campus: 'Main Campus', faculty: 'Dr. M. Alam' },
    { courseCode: 'EEE-321', title: 'Communication Theory', section: '1', type: 'Final Exam', day: 'Wednesday', date: '14-Oct-2026', time: '10:00 AM - 01:00 PM', room: 'Room 402', campus: 'Main Campus', faculty: 'Dr. R. Islam' },
    { courseCode: 'HUM-201', title: 'Engineering Ethics & Professionalism', section: '1', type: 'Final Exam', day: 'Sunday', date: '18-Oct-2026', time: '02:00 PM - 05:00 PM', room: 'Room 305', campus: 'Main Campus', faculty: 'Ms. N. Sultana' }
  ];

  // Mathematical Statement Summary
  const isDuesCase = profile.accountBalance > 0;
  const lastSemesterBalance = 0;
  const tuitionFee = 11.0 * 2500; // 27,500
  const semesterFee = 5500;
  const othersFee = 0;
  const totalTuitionAndFees = tuitionFee + semesterFee + othersFee; // 33,000
  const totalSemesterWaiver = 6600; // 20% waiver on tuition
  const totalOtherAdjustment = 0;
  const toBePaidCurrentSemester = totalTuitionAndFees - totalSemesterWaiver; // 26,400
  const totalFeesToBePaid = toBePaidCurrentSemester + lastSemesterBalance; // 26,400
  const totalCashPaid = isDuesCase ? 15000 : 26400;
  const totalDues = totalFeesToBePaid - totalCashPaid; // 11,400 or 0

  const statementSummary = {
    lastSemesterBalance,
    totalTuitionAndFees,
    totalSemesterWaiver,
    totalOtherAdjustment,
    toBePaidCurrentSemester,
    semesterFee,
    totalCourseFees: tuitionFee,
    othersFee,
    totalFeesToBePaid,
    totalCashPaid,
    totalDues
  };

  // Math aligned Installments
  const instalments = [
    { no: '1st Installment', deadline: '15-Jun-2026', amount: 8800, cashPaid: 8800, dues: 0 },
    { no: '2nd Installment', deadline: '15-Jul-2026', amount: 8800, cashPaid: isDuesCase ? 6200 : 8800, dues: isDuesCase ? 2600 : 0 },
    { no: '3rd Installment', deadline: '15-Aug-2026', amount: 8800, cashPaid: isDuesCase ? 0 : 8800, dues: isDuesCase ? 8800 : 0 }
  ];

  const transactions: Transaction[] = [
    { id: 'TX-1001', date: '01-Jun-2026', code: 'CHARGE', description: 'Semester Admission Fee', debit: 5500, credit: 0, balance: 5500 },
    { id: 'TX-1002', date: '01-Jun-2026', code: 'CHARGE', description: 'Tuition Fee - Summer 2026 (11.0 Credits)', debit: 27500, credit: 0, balance: 33000 },
    { id: 'TX-1003', date: '01-Jun-2026', code: 'WAIVER', description: 'Academic Scholarship Waiver (20%)', debit: 0, credit: 6600, balance: 26400 },
    { id: 'TX-1004', date: '10-Jun-2026', code: 'PAYMENT', description: 'Prime Bank Academic Deposit - 1st Installment', debit: 0, credit: 8800, balance: 17600 },
    ...(isDuesCase 
      ? [
          { id: 'TX-1005', date: '12-Jul-2026', code: 'PAYMENT', description: 'Prime Bank Academic Deposit - Partial 2nd Installment', debit: 0, credit: 6200, balance: 11400 }
        ]
      : [
          { id: 'TX-1005', date: '12-Jul-2026', code: 'PAYMENT', description: 'Prime Bank Academic Deposit - Full 2nd Installment', debit: 0, credit: 8800, balance: 8800 },
          { id: 'TX-1006', date: '10-Aug-2026', code: 'PAYMENT', description: 'Prime Bank Academic Deposit - 3rd Installment', debit: 0, credit: 8800, balance: 0 }
        ]
    )
  ];

  const bankSlipFees = [
    { code: 'FEE088', description: 'Academic Processing Fee', amount: 300 },
    { code: 'FEE135', description: 'Official Academic Transcript Fee', amount: 500 },
    { code: 'FEE109', description: '1st Midterm Make-up Processing Fee', amount: 1000 }
  ];

  return {
    profile,
    registeredCourses,
    completedCourses,
    schedule,
    transactions,
    teachers,
    exams,
    statementSummary,
    bankSlipFees,
    instalments
  };
}

export async function executePortalSync(
  studentId: string,
  _password?: string,
  _options: { skipAdmitCard?: boolean; admitCardOnly?: boolean; module?: string } = {}
): Promise<any> {
  // Simulate network latency (250ms) for an ultra-premium, ultra-realistic user feeling
  await new Promise(resolve => setTimeout(resolve, 250));

  const cleanId = studentId.trim();
  const studentData = generateStudentData(cleanId);

  return {
    success: true,
    status: 200,
    studentData,
    tabStatus: {
      'Home': true,
      'Profile': true,
      'Accounts Overview': true,
      'Semester Statement': true,
      'Registered Courses': true,
      'Completed Courses': true,
      'Class Schedule': true,
      'Exam Schedule': true,
      'Exam Admit Card': true,
      'Related Teachers': true
    },
    message: 'Demo Academic Portal dataset generated successfully.'
  };
}

export function portalSyncPlugin() {
  const handler = async (req: Connect.IncomingMessage, res: http.ServerResponse) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { studentId, password } = JSON.parse(body || '{}');
        const result = await executePortalSync(studentId, password);
        
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: `Internal simulation error: ${err.message || 'Unknown error'}`
        }));
      }
    });
  };

  const proxyImageHandler = async (req: any, res: any) => {
    try {
      const urlString = new URL(req.url || '/', 'http://localhost').searchParams.get('url');
      const studentId = urlString?.split('/').pop()?.split('.')[0] || '123456';
      const profile = generateStudentProfile(studentId);
      const initials = getInitials(profile.name);

      // Generate a stunning, high-contrast modern SVG avatar locally!
      const colors = ['#8c1515', '#1e3a8a', '#115e59', '#3b0764', '#0f172a'];
      const charCodeSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const bg = colors[charCodeSum % colors.length];

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
          <rect width="100%" height="100%" fill="${bg}" />
          <text x="50%" y="55%" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
            ${initials}
          </text>
        </svg>
      `.trim();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(svg);
    } catch (err) {
      res.statusCode = 500;
      res.end('Failed to generate avatar');
    }
  };

  return {
    name: 'university-sync-api',
    configureServer(server: any) {
      if (!server.ws) {
        server.ws = {
          send() {},
          close() {},
          on() {},
          off() {},
          listen() {}
        };
      }
      server.middlewares.use('/api/university-sync', handler);
      server.middlewares.use('/api/proxy-image', proxyImageHandler);
    },
    configurePreviewServer(server: any) {
      if (!server.ws) {
        server.ws = {
          send() {},
          close() {},
          on() {},
          off() {},
          listen() {}
        };
      }
      server.middlewares.use('/api/university-sync', handler);
      server.middlewares.use('/api/proxy-image', proxyImageHandler);
    }
  };
}
