import { Course, ClassSchedule, Transaction, StudentProfile, StudentDetails, Instructor, Major } from '../data';

export interface PuSyncResult {
  success: boolean;
  studentData: StudentDetails;
  message?: string;
  source: 'live_portal' | 'cached_structure' | 'manual_paste';
}

/**
 * Robust cross-environment HTML table & text parser for Presidency University SIMS
 */
export class PuHtmlParser {
  /**
   * Helper to parse HTML strings across browser (DOMParser) and fallback environments
   */
  private static getDoc(html: string): Document | null {
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
      } catch (e) {
        console.error('DOMParser error:', e);
      }
    }
    return null;
  }

  /**
   * Cleans string text
   */
  private static cleanText(text: string | null | undefined): string {
    if (!text) return '';
    return text.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Parses Profile HTML (/students/profile)
   */
  public static parseProfile(html: string, fallbackId: string = ''): Partial<StudentProfile> {
    const profile: Partial<StudentProfile> = {
      id: fallbackId,
      name: fallbackId ? `Student ${fallbackId}` : 'Student',
      status: 'Registered',
      admissionSemester: 'Summer-26',
      currentSemester: 'Summer-26',
      program: 'Electrical & Electronic Engineering',
      creditsTaken: 0,
      creditsCompleted: 0,
      cgpa: 0.0,
      accountBalance: 0.0,
      email: fallbackId ? `${fallbackId}@student.presidency.edu.bd` : ''
    };

    const doc = this.getDoc(html);
    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 2) {
          const key = this.cleanText(tds[0].textContent).toLowerCase();
          const val = this.cleanText(tds[1].textContent);

          if (key.includes('student id')) {
            profile.id = val;
          } else if (key.includes('student name')) {
            profile.name = val;
          } else if (key.includes('status')) {
            profile.status = val;
          } else if (key.includes('admission semester')) {
            profile.admissionSemester = val;
          } else if (key.includes('current semester')) {
            profile.currentSemester = val;
          } else if (key.includes('program')) {
            let prog: Major = 'Electrical & Electronic Engineering';
            if (val.toLowerCase().includes('computer')) prog = 'Computer Science & Engineering';
            else if (val.toLowerCase().includes('business')) prog = 'Business Administration';
            profile.program = prog;
          } else if (key.includes('credits taken')) {
            const num = parseFloat(val.replace(/[^\d.]/g, ''));
            if (!isNaN(num)) profile.creditsTaken = num;
          } else if (key.includes('credits completed')) {
            const num = parseFloat(val.replace(/[^\d.]/g, ''));
            if (!isNaN(num)) profile.creditsCompleted = num;
          } else if (key.includes('cgpa')) {
            const num = parseFloat(val.replace(/[^\d.]/g, ''));
            if (!isNaN(num)) profile.cgpa = num;
          } else if (key.includes('account balance')) {
            const num = parseFloat(val.replace(/[^\d.-]/g, ''));
            if (!isNaN(num)) profile.accountBalance = num;
          }
        }
      });
    } else {
      // Regex-based fallback
      const idMatch = html.match(/Student ID:?\s*<\/td>\s*<td[^>]*>([\w\d]+)<\/td>/i) || html.match(/ID:\s*(\d+)/i);
      if (idMatch) profile.id = idMatch[1].trim();

      const nameMatch = html.match(/Student Name:?\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i) || html.match(/Welcome,\s*<strong>([^<]+)!<\/strong>/i);
      if (nameMatch) profile.name = nameMatch[1].trim();

      const cgpaMatch = html.match(/CGPA:?\s*<\/td>\s*<td[^>]*>([\d.]+)<\/td>/i);
      if (cgpaMatch) profile.cgpa = parseFloat(cgpaMatch[1]);

      const creditsMatch = html.match(/Credits Completed:?\s*<\/td>\s*<td[^>]*>([\d.]+)/i);
      if (creditsMatch) profile.creditsCompleted = parseFloat(creditsMatch[1]);
    }

    if (profile.id && !profile.email) {
      profile.email = `${profile.id}@student.presidency.edu.bd`;
    }

    return profile;
  }

  /**
   * Parses Completed Courses HTML (/students/completedCourses)
   */
  public static parseCompletedCourses(html: string): Course[] {
    const courses: Course[] = [];
    const doc = this.getDoc(html);

    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      let currentSemester = 'Summer-26';

      rows.forEach((tr) => {
        // Check for semester header
        const groupTitle = tr.querySelector('.rp_group_title, td[colspan]');
        if (groupTitle) {
          const semText = this.cleanText(groupTitle.textContent);
          if (semText) currentSemester = semText;
          return;
        }

        const tds = tr.querySelectorAll('td');
        // Structure: Course | Title | Section | Credit | Grade
        if (tds.length >= 5) {
          const code = this.cleanText(tds[0].textContent);
          const title = this.cleanText(tds[1].textContent);
          const section = this.cleanText(tds[2].textContent);
          const creditStr = this.cleanText(tds[3].textContent);
          const grade = this.cleanText(tds[4].textContent);

          if (code && title && code.toUpperCase() !== 'COURSE' && creditStr) {
            const credits = parseFloat(creditStr) || 3.0;
            courses.push({
              code,
              title,
              section,
              credits,
              grade,
              semester: currentSemester,
              faculty: '',
              fee: credits * 2500
            });
          }
        }
      });
    }

    return courses;
  }

  /**
   * Parses Registered Courses HTML (/students/registeredCourses)
   */
  public static parseRegisteredCourses(html: string): Course[] {
    const courses: Course[] = [];
    const doc = this.getDoc(html);

    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        // Structure: No. | Code | Course Title | Section | Credit | Faculty | Semester
        if (tds.length >= 6) {
          // If first column is serial number (e.g. 1, 2)
          const offset = tds.length >= 7 ? 1 : 0;
          const code = this.cleanText(tds[offset].textContent);
          const title = this.cleanText(tds[offset + 1].textContent);
          const section = this.cleanText(tds[offset + 2].textContent);
          const creditStr = this.cleanText(tds[offset + 3].textContent);
          const faculty = this.cleanText(tds[offset + 4].textContent);
          const semester = tds.length > offset + 5 ? this.cleanText(tds[offset + 5].textContent) : 'Summer-26';

          if (code && title && code.toUpperCase() !== 'CODE') {
            const credits = parseFloat(creditStr) || 3.0;
            courses.push({
              code,
              title,
              section,
              credits,
              faculty,
              semester: semester || 'Summer-26',
              fee: credits * 2500
            });
          }
        }
      });
    }

    return courses;
  }

  /**
   * Parses Class Schedule HTML (/students/classSchedule)
   */
  public static parseClassSchedule(html: string): ClassSchedule[] {
    const schedule: ClassSchedule[] = [];
    const doc = this.getDoc(html);

    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        // Structure: Course | Section | Day | Start | End | Room | Campus | Faculty | Semester
        if (tds.length >= 8) {
          const courseCode = this.cleanText(tds[0].textContent);
          const section = this.cleanText(tds[1].textContent);
          const day = this.cleanText(tds[2].textContent);
          const start = this.cleanText(tds[3].textContent);
          const end = this.cleanText(tds[4].textContent);
          const room = this.cleanText(tds[5].textContent);
          const campus = this.cleanText(tds[6].textContent);
          const faculty = this.cleanText(tds[7].textContent);
          const semester = tds.length > 8 ? this.cleanText(tds[8].textContent) : 'Summer-26';

          if (day && day.toLowerCase() !== 'day' && courseCode && courseCode !== '-') {
            schedule.push({
              courseCode,
              section,
              day,
              start,
              end,
              room,
              campus: campus || 'Gulshan',
              faculty,
              semester
            });
          }
        }
      });
    }

    return schedule;
  }

  /**
   * Parses Exam Schedule and Exam Admit Card HTML
   */
  public static parseExamSchedule(scheduleHtml: string, admitCardHtml?: string): StudentDetails['exams'] {
    const exams: StudentDetails['exams'] = [];
    
    // First, extract security codes from admit card if available
    const securityCodeMap: Record<string, string> = {};
    if (admitCardHtml) {
      const admitDoc = this.getDoc(admitCardHtml);
      if (admitDoc) {
        const rows = admitDoc.querySelectorAll('table tr');
        rows.forEach((tr) => {
          const tds = tr.querySelectorAll('td');
          // Format: Security Code | Course | Section | Day | date | Start | End | Room | Faculty | Semester
          if (tds.length >= 2) {
            const secCode = this.cleanText(tds[0].textContent);
            const course = this.cleanText(tds[1].textContent);
            if (secCode && course && /^\d+$/.test(secCode)) {
              securityCodeMap[course] = secCode;
            }
          }
        });
      }
    }

    const doc = this.getDoc(scheduleHtml);
    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        // Structure: Course | Section | Day | date | Start | End | Room | Campus | Faculty | Semester
        if (tds.length >= 8) {
          const courseCode = this.cleanText(tds[0].textContent);
          const section = this.cleanText(tds[1].textContent);
          const day = this.cleanText(tds[2].textContent);
          const date = this.cleanText(tds[3].textContent);
          const start = this.cleanText(tds[4].textContent);
          const end = this.cleanText(tds[5].textContent);
          const room = this.cleanText(tds[6].textContent);
          const campus = this.cleanText(tds[7].textContent);
          const faculty = tds.length > 8 ? this.cleanText(tds[8].textContent) : '';
          const semester = tds.length > 9 ? this.cleanText(tds[9].textContent) : 'Summer-26';

          if (courseCode && courseCode.toUpperCase() !== 'COURSE' && day) {
            exams.push({
              securityCode: securityCodeMap[courseCode] || (500000 + Math.floor(Math.random() * 90000)).toString(),
              courseCode,
              title: courseCode,
              section,
              type: 'Final Examination',
              day,
              date,
              time: `${start} - ${end}`,
              room,
              campus: campus || 'Gulshan',
              faculty,
              semester
            });
          }
        }
      });
    }

    return exams;
  }

  /**
   * Parses Statement of Account Transactions HTML (/students/semesterTransactions)
   */
  public static parseTransactions(html: string): Transaction[] {
    const transactions: Transaction[] = [];
    const doc = this.getDoc(html);

    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        // Structure: No. | Date | Sem. | Code | Description | Debit (Paid) | Credit (Fees) | Balance (Unpaid)
        if (tds.length >= 8) {
          const id = this.cleanText(tds[0].textContent);
          const date = this.cleanText(tds[1].textContent);
          const code = this.cleanText(tds[3].textContent);
          const description = this.cleanText(tds[4].textContent);
          const debitStr = this.cleanText(tds[5].textContent).replace(/,/g, '');
          const creditStr = this.cleanText(tds[6].textContent).replace(/,/g, '');
          const balanceStr = this.cleanText(tds[7].textContent).replace(/,/g, '');

          const debit = parseFloat(debitStr) || 0;
          const credit = parseFloat(creditStr) || 0;
          const balance = parseFloat(balanceStr) || 0;

          if (id && /^\d+$/.test(id)) {
            transactions.push({
              id,
              date,
              code,
              description,
              debit,
              credit,
              balance
            });
          }
        }
      });
    }

    return transactions;
  }

  /**
   * Parses Related Teachers HTML (/students/relatedTeachers)
   */
  public static parseRelatedTeachers(html: string): Instructor[] {
    const teachers: Instructor[] = [];
    const doc = this.getDoc(html);

    if (doc) {
      const rows = doc.querySelectorAll('table tr');
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 4) {
          const initial = this.cleanText(tds[0].textContent);
          const name = this.cleanText(tds[1].textContent);
          const email = this.cleanText(tds[2].textContent);
          const department = this.cleanText(tds[3].textContent);
          const courses = tds.length > 4 ? this.cleanText(tds[4].textContent) : '';

          if (initial && name && initial.toUpperCase() !== 'INITIAL') {
            teachers.push({
              initial,
              name,
              email,
              department,
              courses
            });
          }
        }
      });
    }

    return teachers;
  }
}
