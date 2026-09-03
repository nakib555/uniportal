import type { Connect } from 'vite';
import http from 'http';
import * as cheerio from 'cheerio';
import type { StudentDetails, Course, ClassSchedule, Transaction, Instructor, StudentProfile, Major } from '../data';

// Official Presidency University SIMS URLs as defined in ai_studio_code (1).py
const SIMS_BASE = 'http://sims.presidency.edu.bd';
const LOGIN_URL = `${SIMS_BASE}/users/login`;
const LOGOUT_URL = `${SIMS_BASE}/users/logout`;

const STRUCTURE = [
  { tabName: 'Home', url: `${SIMS_BASE}/students` },
  { tabName: 'Profile', url: `${SIMS_BASE}/students/profile` },
  { tabName: 'Accounts Overview', url: `${SIMS_BASE}/students/semesterTransactions` },
  { tabName: 'Bank Slips', url: `${SIMS_BASE}/students/bankSlips` },
  { tabName: 'Semester Statement', url: `${SIMS_BASE}/students/semesterStatement` },
  { tabName: 'Courses Overview', url: `${SIMS_BASE}/students/courses` },
  { tabName: 'Registered Courses', url: `${SIMS_BASE}/students/registeredCourses` },
  { tabName: 'Completed Courses', url: `${SIMS_BASE}/students/completedCourses` },
  { tabName: 'Class Schedule', url: `${SIMS_BASE}/students/classSchedule` },
  { tabName: 'Exam Schedule', url: `${SIMS_BASE}/students/examSchedule` },
  { tabName: 'Exam Admit Card', url: `${SIMS_BASE}/students/examAdmitCard` },
  { tabName: 'Related Teachers', url: `${SIMS_BASE}/students/relatedTeachers` }
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

class CookieJar {
  private cookies = new Map<string, string>();

  public updateFromResponse(res: Response) {
    let headers: string[] = [];
    if (typeof (res.headers as any).getSetCookie === 'function') {
      headers = (res.headers as any).getSetCookie();
    } else {
      const raw = res.headers.get('set-cookie');
      if (raw) headers = [raw];
    }

    for (const h of headers) {
      const parts = h.split(';');
      if (parts.length > 0) {
        const [name, ...rest] = parts[0].trim().split('=');
        if (name && rest.length > 0) {
          this.cookies.set(name.trim(), rest.join('=').trim());
        }
      }
    }
  }

  public getCookieHeader(): string {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }
}

async function requestWithRedirects(
  url: string,
  options: RequestInit = {},
  jar: CookieJar,
  maxHops = 5
): Promise<{ res: Response; finalUrl: string; bodyText: string }> {
  let curUrl = url;
  let method = options.method || 'GET';
  let body = options.body;

  for (let i = 0; i < maxHops; i++) {
    const headers = { ...((options.headers as Record<string, string>) || {}) };
    const cookieHeader = jar.getCookieHeader();
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const res = await fetch(curUrl, {
      ...options,
      method,
      headers,
      body,
      redirect: 'manual'
    });

    jar.updateFromResponse(res);

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get('location');
      if (!loc) {
        const bodyText = await res.text();
        return { res, finalUrl: curUrl, bodyText };
      }
      curUrl = new URL(loc, curUrl).toString();
      if (res.status === 301 || res.status === 302 || res.status === 303) {
        method = 'GET';
        body = undefined;
      }
      continue;
    }

    const bodyText = await res.text();
    return { res, finalUrl: curUrl, bodyText };
  }

  throw new Error('Too many redirects encountered while communicating with Presidency University SIMS.');
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 3.75,
  'A-': 3.5,
  'B+': 3.25,
  'B': 3.0,
  'B-': 2.75,
  'C+': 2.5,
  'C': 2.25,
  'D': 2.0,
  'F': 0.0,
  'I': 0.0,
  'W': 0.0
};

export interface SyncOptions {
  skipAdmitCard?: boolean;
  admitCardOnly?: boolean;
}

export interface SyncResult {
  success: boolean;
  status: number;
  studentData?: StudentDetails;
  error?: string;
  message?: string;
  hasRestriction?: boolean;
  exams?: StudentDetails['exams'];
}

export async function executePresidencySync(
  studentId: string,
  password: string,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const cleanId = (studentId || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, status: 400, error: 'Student ID and password are required' };
  }

  try {
    const cookieJar = new CookieJar();
    const commonHeaders: Record<string, string> = {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive'
    };

    // 1. Initial GET to fetch login form and CakePHP session cookie
    const getController = new AbortController();
    const getTimeout = setTimeout(() => getController.abort(), 15000);
    let loginPageHtml = '';

    try {
      const initResp = await requestWithRedirects(LOGIN_URL, {
        headers: commonHeaders,
        signal: getController.signal
      }, cookieJar);
      clearTimeout(getTimeout);
      loginPageHtml = initResp.bodyText;
    } catch (err: any) {
      clearTimeout(getTimeout);
      return {
        success: false,
        status: 502,
        error: `Could not connect to Presidency University SIMS portal: ${err.message || 'Connection timed out'}`
      };
    }

    // 2. Parse login form inputs dynamically as in ai_studio_code (1).py
    const $login = cheerio.load(loginPageHtml);
    const $form = $login('form');

    if ($form.length === 0) {
      return { success: false, status: 502, error: 'Could not load Presidency University login form.' };
    }

    const formParams = new URLSearchParams();
    $form.find('input').each((_, el) => {
      const $inp = $login(el);
      const name = $inp.attr('name');
      if (!name) return;
      const type = ($inp.attr('type') || '').toLowerCase();
      const val = $inp.attr('value') || '';

      if (type === 'hidden') {
        formParams.append(name, val);
      } else if (type === 'text' || name.toLowerCase().includes('username') || name.toLowerCase().includes('id')) {
        formParams.append(name, cleanId);
      } else if (type === 'password') {
        formParams.append(name, cleanPass);
      } else {
        formParams.append(name, val);
      }
    });

    // 3. Post credentials to SIMS authentication endpoint with redirect-aware cookie handling
    const postController = new AbortController();
    const postTimeout = setTimeout(() => postController.abort(), 15000);
    let authHtml = '';
    let authUrl = '';

    try {
      const postResp = await requestWithRedirects(LOGIN_URL, {
        method: 'POST',
        headers: {
          ...commonHeaders,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': LOGIN_URL,
          'Origin': SIMS_BASE
        },
        body: formParams.toString(),
        signal: postController.signal
      }, cookieJar);
      clearTimeout(postTimeout);
      authHtml = postResp.bodyText;
      authUrl = postResp.finalUrl;
    } catch (err: any) {
      clearTimeout(postTimeout);
      return {
        success: false,
        status: 502,
        error: `Connection error during SIMS authentication: ${err.message || 'Network error'}`
      };
    }

    // Check authentication failure
    const $auth = cheerio.load(authHtml);
    const authMessage = cleanText($auth('#authMessage').text()) ||
      cleanText($auth('.error').text()) ||
      cleanText($auth('.flash-message').text());

    const isAuthFailed = Boolean(authMessage) ||
      authHtml.includes('Invalid username or password') ||
      (authUrl.includes('users/login') && !authHtml.includes('Welcome, <strong>') && !authHtml.includes('/users/logout'));

    if (isAuthFailed) {
      const errorMsg = authMessage || 'Login failed. Invalid username or password.';
      return { success: false, status: 401, error: errorMsg };
    }

    // 4. Authenticated successfully: Filter target tabs based on request options
    let targetStructure = STRUCTURE;
    if (options.admitCardOnly) {
      targetStructure = STRUCTURE.filter(
        item => item.tabName === 'Exam Admit Card' || item.tabName === 'Exam Schedule' || item.tabName === 'Profile'
      );
    } else if (options.skipAdmitCard) {
      targetStructure = STRUCTURE.filter(
        item => item.tabName !== 'Exam Admit Card'
      );
    }

    const tabFetchHeaders = {
      ...commonHeaders,
      'Referer': `${SIMS_BASE}/students`
    };

    const tabPromises = targetStructure.map(async (item) => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const tabResult = await requestWithRedirects(item.url, {
          headers: tabFetchHeaders,
          signal: controller.signal
        }, cookieJar);
        clearTimeout(timer);
        return { tabName: item.tabName, url: item.url, html: tabResult.bodyText };
      } catch (e) {
        return { tabName: item.tabName, url: item.url, html: '' };
      }
    });

    const tabResults = await Promise.all(tabPromises);
    const tabMap = new Map<string, string>();
    for (const tr of tabResults) {
      tabMap.set(tr.tabName, tr.html);
    }

    // Fetch student photo while authenticated
    let photoDataBase64 = '';
    try {
      const photoUrl = `${SIMS_BASE}/students/studentPhoto`;
      const photoHeaders: Record<string, string> = {
        ...commonHeaders,
        'Referer': `${SIMS_BASE}/students/profile`
      };
      const cookieHeader = cookieJar.getCookieHeader();
      if (cookieHeader) {
        photoHeaders['Cookie'] = cookieHeader;
      }
      const photoController = new AbortController();
      const photoTimer = setTimeout(() => photoController.abort(), 10000);
      const photoRes = await fetch(photoUrl, {
        headers: photoHeaders,
        signal: photoController.signal
      });
      clearTimeout(photoTimer);
      if (photoRes.ok) {
        const contentType = photoRes.headers.get('content-type') || '';
        if (contentType.toLowerCase().includes('image') || contentType.toLowerCase().includes('octet-stream') || photoRes.headers.get('content-length')) {
          const arrayBuffer = await photoRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          if (buffer.length > 100) {
            const mime = contentType.toLowerCase().includes('image') ? contentType : 'image/jpeg';
            photoDataBase64 = `data:${mime};base64,${buffer.toString('base64')}`;
          }
        }
      }
    } catch (photoErr) {
      console.warn('[puProxy] Failed to fetch student photo:', photoErr);
    }

    // 5. Terminate session cleanly
    try {
      requestWithRedirects(LOGOUT_URL, { headers: tabFetchHeaders }, cookieJar).catch(() => {});
    } catch (_) {}

    // 6. Parse structured data from genuine HTML pages
    // (a) Profile Parsing
    const profileHtml = tabMap.get('Profile') || '';
    const $prof = cheerio.load(profileHtml);
    const profile: StudentProfile = {
      id: cleanId,
      name: '',
      status: '',
      admissionSemester: '',
      currentSemester: '',
      program: '',
      creditsTaken: 0,
      creditsCompleted: 0,
      cgpa: 0.0,
      accountBalance: 0.0,
      email: `${cleanId}@student.presidency.edu.bd`,
      photo: photoDataBase64 || undefined,
      gpaHistory: []
    };

    $prof('table tr').each((_, tr) => {
      const tds = $prof(tr).find('td');
      if (tds.length >= 2) {
        const key = cleanText($prof(tds[0]).text()).toLowerCase();
        const val = cleanText($prof(tds[1]).text());

        if (key.includes('student id')) {
          profile.id = val || cleanId;
        } else if (key.includes('student name')) {
          profile.name = val;
        } else if (key.includes('status')) {
          profile.status = val;
        } else if (key.includes('admission semester')) {
          profile.admissionSemester = val;
        } else if (key.includes('current semester')) {
          profile.currentSemester = val;
        } else if (key.includes('program')) {
          profile.program = val;
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

    if (!profile.name) {
      const welcomeMatch = (tabMap.get('Home') || '').match(/Welcome,\s*<strong>([^<]+)!<\/strong>/i);
      if (welcomeMatch) {
        profile.name = cleanText(welcomeMatch[1]);
      }
    }

    // (b) Registered Courses Parsing
    const regHtml = tabMap.get('Registered Courses') || '';
    const $reg = cheerio.load(regHtml);
    const registeredCourses: Course[] = [];

    $reg('table tr').each((_, tr) => {
      const tds = $reg(tr).find('td');
      if (tds.length >= 6) {
        const offset = tds.length >= 7 ? 1 : 0;
        const code = cleanText($reg(tds[offset]).text());
        const title = cleanText($reg(tds[offset + 1]).text());
        const section = cleanText($reg(tds[offset + 2]).text());
        const creditStr = cleanText($reg(tds[offset + 3]).text());
        const faculty = cleanText($reg(tds[offset + 4]).text());
        const semester = tds.length > offset + 5 ? cleanText($reg(tds[offset + 5]).text()) : (profile.currentSemester || 'Current');

        if (code && title && code.toUpperCase() !== 'CODE' && code.toUpperCase() !== 'COURSE') {
          const credits = parseFloat(creditStr) || 3.0;
          registeredCourses.push({
            code,
            title,
            section,
            credits,
            faculty,
            semester: semester || profile.currentSemester || 'Current',
            fee: credits * 2500
          });
        }
      }
    });

    // (c) Completed Courses Parsing
    const compHtml = tabMap.get('Completed Courses') || '';
    const $comp = cheerio.load(compHtml);
    const completedCourses: Course[] = [];
    let currentSemHeader = profile.admissionSemester || 'Previous';

    $comp('table tr').each((_, tr) => {
      const groupTitle = $comp(tr).find('.rp_group_title, td[colspan]');
      if (groupTitle.length > 0) {
        const sem = cleanText(groupTitle.text());
        if (sem) currentSemHeader = sem;
        return;
      }

      const tds = $comp(tr).find('td');
      if (tds.length >= 5) {
        const code = cleanText($comp(tds[0]).text());
        const title = cleanText($comp(tds[1]).text());
        const section = cleanText($comp(tds[2]).text());
        const creditStr = cleanText($comp(tds[3]).text());
        const grade = cleanText($comp(tds[4]).text());

        if (code && title && code.toUpperCase() !== 'COURSE' && code.toUpperCase() !== 'CODE' && creditStr) {
          const credits = parseFloat(creditStr) || 3.0;
          completedCourses.push({
            code,
            title,
            section,
            credits,
            grade,
            semester: currentSemHeader,
            faculty: '',
            fee: credits * 2500
          });
        }
      }
    });

    // Calculate dynamic GPA history from genuine completed courses
    const semesterCourseMap: Record<string, { totalPoints: number; totalCredits: number }> = {};
    for (const c of completedCourses) {
      if (!c.grade || !c.semester) continue;
      const pts = GRADE_POINTS[c.grade.toUpperCase()];
      if (pts !== undefined) {
        if (!semesterCourseMap[c.semester]) {
          semesterCourseMap[c.semester] = { totalPoints: 0, totalCredits: 0 };
        }
        semesterCourseMap[c.semester].totalPoints += pts * c.credits;
        semesterCourseMap[c.semester].totalCredits += c.credits;
      }
    }

    const gpaHistory = Object.entries(semesterCourseMap).map(([semester, stats]) => ({
      semester,
      gpa: stats.totalCredits > 0 ? parseFloat((stats.totalPoints / stats.totalCredits).toFixed(2)) : 0
    }));
    profile.gpaHistory = gpaHistory;

    // (d) Class Schedule Parsing
    const schedHtml = tabMap.get('Class Schedule') || '';
    const $sched = cheerio.load(schedHtml);
    const schedule: ClassSchedule[] = [];
    let lastCourseCode = '';
    let lastSection = '';
    let lastFaculty = '';
    let lastSemester = '';

    $sched('table tr').each((_, tr) => {
      const tds = $sched(tr).find('td');
      if (tds.length >= 8) {
        let courseCode = cleanText($sched(tds[0]).text());
        let section = cleanText($sched(tds[1]).text());
        const day = cleanText($sched(tds[2]).text());
        const start = cleanText($sched(tds[3]).text());
        const end = cleanText($sched(tds[4]).text());
        const room = cleanText($sched(tds[5]).text());
        const campus = cleanText($sched(tds[6]).text());
        let faculty = cleanText($sched(tds[7]).text());
        let semester = tds.length > 8 ? cleanText($sched(tds[8]).text()) : '';

        if (day && day.toLowerCase() !== 'day') {
          // Carry forward logic if Course, Section, or Faculty is '-'
          if ((!courseCode || courseCode === '-') && lastCourseCode) {
            courseCode = lastCourseCode;
          }
          if ((!section || section === '-') && lastSection) {
            section = lastSection;
          }
          if ((!faculty || faculty === '-') && lastFaculty) {
            faculty = lastFaculty;
          }
          if (!semester || semester === '-') {
            semester = lastSemester || (profile.currentSemester || 'Current');
          }

          if (courseCode && courseCode !== '-' && day !== '-') {
            lastCourseCode = courseCode;
            lastSection = section;
            lastFaculty = faculty;
            lastSemester = semester;

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
      }
    });

    // (e) Exam Schedule & Exam Admit Card Parsing
    const admitCardHtml = tabMap.get('Exam Admit Card') || '';
    const examSchedHtml = tabMap.get('Exam Schedule') || '';
    const securityCodeMap: Record<string, string> = {};
    const exams: StudentDetails['exams'] = [];
    const seenExams = new Set<string>();

    if (admitCardHtml) {
      const $admit = cheerio.load(admitCardHtml);
      $admit('table tr').each((_, tr) => {
        const tds = $admit(tr).find('td');
        if (tds.length >= 2) {
          const secCode = cleanText($admit(tds[0]).text());
          const course = cleanText($admit(tds[1]).text());
          if (secCode && course && /^\d+$/.test(secCode)) {
            securityCodeMap[course] = secCode;
          }
        }

        // Dual parsing: If Admit Card table contains complete schedule fields (10 columns including Security Code)
        if (tds.length >= 9) {
          const secCode = cleanText($admit(tds[0]).text());
          const courseCode = cleanText($admit(tds[1]).text());
          const section = cleanText($admit(tds[2]).text());
          const day = cleanText($admit(tds[3]).text());
          const date = cleanText($admit(tds[4]).text());
          const start = cleanText($admit(tds[5]).text());
          const end = cleanText($admit(tds[6]).text());
          const room = cleanText($admit(tds[7]).text());
          const faculty = cleanText($admit(tds[8]).text());
          const semester = tds.length > 9 ? cleanText($admit(tds[9]).text()) : (profile.currentSemester || 'Current');

          if (courseCode && courseCode.toUpperCase() !== 'COURSE' && /^\d+$/.test(secCode)) {
            seenExams.add(courseCode);
            exams.push({
              securityCode: secCode,
              courseCode,
              title: courseCode,
              section,
              type: 'Final Examination',
              day,
              date,
              time: `${start} - ${end}`,
              room,
              campus: 'Gulshan',
              faculty,
              semester
            });
          }
        }
      });
    }

    const $exam = cheerio.load(examSchedHtml);
    $exam('table tr').each((_, tr) => {
      const tds = $exam(tr).find('td');
      if (tds.length >= 8) {
        const courseCode = cleanText($exam(tds[0]).text());
        const section = cleanText($exam(tds[1]).text());
        const day = cleanText($exam(tds[2]).text());
        const date = cleanText($exam(tds[3]).text());
        const start = cleanText($exam(tds[4]).text());
        const end = cleanText($exam(tds[5]).text());
        const room = cleanText($exam(tds[6]).text());
        const campus = cleanText($exam(tds[7]).text());
        const faculty = tds.length > 8 ? cleanText($exam(tds[8]).text()) : '';
        const semester = tds.length > 9 ? cleanText($exam(tds[9]).text()) : (profile.currentSemester || 'Current');

        if (courseCode && courseCode.toUpperCase() !== 'COURSE' && day && !seenExams.has(courseCode)) {
          const matchedCourse = registeredCourses.find(c => c.code.toLowerCase() === courseCode.toLowerCase());
          const fullTitle = matchedCourse?.title || courseCode;

          exams.push({
            securityCode: securityCodeMap[courseCode] || '',
            courseCode,
            title: fullTitle,
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

    // (f) Transactions Parsing
    let transHtml = '';
    const accOverview = tabMap.get('Accounts Overview') || '';
    const semStatement = tabMap.get('Semester Statement') || '';

    if (accOverview && accOverview.includes('<table') && !accOverview.includes('not found on this server')) {
      transHtml = accOverview;
    } else if (semStatement && semStatement.includes('<table') && !semStatement.includes('not found on this server')) {
      transHtml = semStatement;
    } else {
      transHtml = accOverview || semStatement || '';
    }

    const $trans = cheerio.load(transHtml);
    const transactions: Transaction[] = [];

    let noIdx = 0;
    let dateIdx = 1;
    let semIdx = 2;
    let codeIdx = 3;
    let descIdx = 4;
    let debitIdx = 6; // Default to column 6 for Credit (Fees) (Debit/Charges in our app)
    let creditIdx = 5; // Default to column 5 for Debit (Paid) (Credit/Payments in our app)
    let balanceIdx = 7;

    let ledgerTable: any = null;
    $trans('table').each((_, table) => {
      const headers: string[] = [];
      $trans(table).find('tr').first().find('th, td').each((_, cell) => {
        headers.push(cleanText($trans(cell).text()).toLowerCase());
      });
      
      if (
        headers.some(h => h.includes('debit') || h.includes('credit') || h.includes('balance') || h.includes('unpaid') || h.includes('paid'))
      ) {
        ledgerTable = table;
      }
    });

    if (!ledgerTable) {
      $trans('table').each((_, table) => {
        const firstRowText = $trans(table).find('tr').first().text().toLowerCase();
        if (firstRowText.includes('no.') || firstRowText.includes('no') || firstRowText.includes('description') || firstRowText.includes('code')) {
          ledgerTable = table;
        }
      });
    }

    const targetTable = ledgerTable ? $trans(ledgerTable) : $trans('table').first();
    
    // Dynamically parse headers from the actual target table to determine column mappings robustly
    const targetHeaders: string[] = [];
    targetTable.find('tr').first().find('th, td').each((_, cell) => {
      targetHeaders.push(cleanText($trans(cell).text()).toLowerCase());
    });

    targetHeaders.forEach((h, idx) => {
      const cleanH = h.trim();
      if (cleanH === 'no.' || cleanH === 'no' || cleanH.includes('serial') || cleanH.includes('sl')) {
        noIdx = idx;
      } else if (cleanH.includes('date')) {
        dateIdx = idx;
      } else if (cleanH.includes('sem')) {
        semIdx = idx;
      } else if (cleanH.includes('code')) {
        codeIdx = idx;
      } else if (cleanH.includes('desc')) {
        descIdx = idx;
      } else if (cleanH.includes('unpaid') || cleanH.includes('balance')) {
        balanceIdx = idx;
      } else if (cleanH.includes('debit (paid)') || (cleanH.includes('debit') && cleanH.includes('paid'))) {
        // Debit (Paid) column of university portal is the payments/credit column in our app
        creditIdx = idx;
      } else if (cleanH.includes('credit (fees)') || cleanH.includes('credit (fee)') || (cleanH.includes('credit') && cleanH.includes('fee')) || cleanH.includes('credit  (fees)')) {
        // Credit (Fees) column of university portal is the charges/debit column in our app
        debitIdx = idx;
      } else if (cleanH === 'debit') {
        debitIdx = idx;
      } else if (cleanH === 'credit') {
        creditIdx = idx;
      }
    });

    const minLength = Math.max(noIdx, dateIdx, semIdx, codeIdx, descIdx, debitIdx, creditIdx, balanceIdx) + 1;

    targetTable.find('tr').each((_, tr) => {
      const tds = $trans(tr).find('td');
      if (tds.length >= minLength) {
        const id = cleanText($trans(tds[noIdx]).text());
        const date = cleanText($trans(tds[dateIdx]).text());
        const code = cleanText($trans(tds[codeIdx]).text());
        const description = cleanText($trans(tds[descIdx]).text());
        const debitStr = cleanText($trans(tds[debitIdx]).text()).replace(/,/g, '');
        const creditStr = cleanText($trans(tds[creditIdx]).text()).replace(/,/g, '');
        const balanceStr = cleanText($trans(tds[balanceIdx]).text()).replace(/,/g, '');

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

    // Parse Statement Summary Table
    let statementSummary: any = undefined;
    $trans('table').each((_, table) => {
      const text = $trans(table).text();
      if (text.includes('Statement Summary') && !statementSummary) {
        const summary: any = {
          lastSemesterBalance: 0,
          totalTuitionAndFees: 0,
          totalSemesterWaiver: 0,
          totalOtherAdjustment: 0,
          toBePaidCurrentSemester: 0,
          semesterFee: 0,
          totalCourseFees: 0,
          othersFee: 0,
          totalFeesToBePaid: 0,
          totalCashPaid: 0,
          totalDues: 0
        };

        $trans(table).find('tr').each((_, tr) => {
          const tds = $trans(tr).find('td');
          if (tds.length >= 2) {
            const label = cleanText($trans(tds[0]).text()).toLowerCase();
            const val = parseFloat(cleanText($trans(tds[1]).text()).replace(/,/g, '')) || 0;

            if (label.includes('last semester balance')) {
              summary.lastSemesterBalance = val;
            } else if (label.includes('total tuition and other fees')) {
              summary.totalTuitionAndFees = val;
            } else if (label.includes('total semester waiver')) {
              summary.totalSemesterWaiver = val;
            } else if (label.includes('total other adjustment')) {
              summary.totalOtherAdjustment = val;
            } else if (label.includes('to be paid in current semester')) {
              summary.toBePaidCurrentSemester = val;
            } else if (label.includes('semester fee')) {
              summary.semesterFee = val;
            } else if (label.includes('total tuition(course) fees') || label.includes('total tuition')) {
              summary.totalCourseFees = val;
            } else if (label.includes('others fee')) {
              summary.othersFee = val;
            } else if (label.includes('total fees to be paid')) {
              summary.totalFeesToBePaid = val;
            } else if (label.includes('total cash paid')) {
              summary.totalCashPaid = val;
            } else if (label.includes('total dues')) {
              summary.totalDues = val;
            }
          }
        });
        statementSummary = summary;
      }
    });

    // Parse Instalment Payment Table
    const instalments: any[] = [];
    $trans('table').each((_, table) => {
      const text = $trans(table).text();
      if (text.includes('Instalment Payment') && text.includes('Instalment Deadline')) {
        $trans(table).find('tr').each((_, tr) => {
          const tds = $trans(tr).find('td');
          if (tds.length >= 7) {
            const label = cleanText($trans(tds[0]).text());
            const deadline = cleanText($trans(tds[1]).text());
            const amount = parseFloat(cleanText($trans(tds[2]).text()).replace(/,/g, '')) || 0;
            const cashPaid = parseFloat(cleanText($trans(tds[4]).text()).replace(/,/g, '')) || 0;
            const dues = parseFloat(cleanText($trans(tds[6]).text()).replace(/,/g, '')) || 0;

            if (label && (label.includes('1st') || label.includes('2nd') || label.includes('3rd') || label.includes('Instalment'))) {
              if (!instalments.some(inst => inst.no === label)) {
                instalments.push({
                  no: label,
                  deadline,
                  amount,
                  cashPaid,
                  dues
                });
              }
            }
          }
        });
      }
    });

    // (g) Related Teachers Parsing
    const teachHtml = tabMap.get('Related Teachers') || '';
    const $teach = cheerio.load(teachHtml);
    const teachers: Instructor[] = [];

    $teach('table tr').each((_, tr) => {
      const tds = $teach(tr).find('td');
      if (tds.length >= 4) {
        const initial = cleanText($teach(tds[0]).text());
        const name = cleanText($teach(tds[1]).text());
        const email = cleanText($teach(tds[2]).text());
        const department = cleanText($teach(tds[3]).text());
        const courses = tds.length > 4 ? cleanText($teach(tds[4]).text()) : '';

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

    // (h) Bank Slips Parsing
    const bankHtml = tabMap.get('Bank Slips') || '';
    const $bank = cheerio.load(bankHtml);
    const bankSlipFees: { code: string; description: string; amount: number }[] = [];

    // The HTML has form#bankSlipSubmitForm table tr with:
    // <td class="serial_number"><input type="checkbox" name="data[check_list][]" value="FEE051^ID Card Fee^100.00"/></td>
    // <td class="txt">FEE051</td>
    // <td class="txt">ID Card Fee</td>
    // <td class="amount">100.00</td>
    $bank('form#bankSlipSubmitForm table tr, table tr').each((_, tr) => {
      const row = $bank(tr);
      const chk = row.find('input[type="checkbox"]');
      const val = chk.val() as string | undefined;
      
      if (val && val.includes('^')) {
        const parts = val.split('^');
        if (parts.length >= 3) {
          const code = cleanText(parts[0]);
          const desc = cleanText(parts[1]);
          const amt = parseFloat(cleanText(parts[2]).replace(/,/g, '')) || 0;
          if (code) {
            bankSlipFees.push({
              code,
              description: desc,
              amount: amt
            });
            return;
          }
        }
      }

      // Fallback row parsing by columns
      const tds = row.find('td');
      if (tds.length >= 4) {
        const codeText = cleanText($bank(tds[1]).text());
        const descText = cleanText($bank(tds[2]).text());
        const amtText = cleanText($bank(tds[3]).text()).replace(/,/g, '');
        if (codeText && (codeText.startsWith('FEE') || codeText.startsWith('PAY'))) {
          bankSlipFees.push({
            code: codeText,
            description: descText,
            amount: parseFloat(amtText) || 0
          });
        }
      }
    });

    // Sync account balance with the statement summary's actual totalDues to guarantee no 1 Tk or sync discrepancies
    if (statementSummary) {
      profile.accountBalance = statementSummary.totalDues;
    }

    // Special handling for admitCardOnly: If the user only requested admit card data
    const isRestricted = (exams.length === 0) && (
      (admitCardHtml && (
        admitCardHtml.toLowerCase().includes('restriction') ||
        admitCardHtml.toLowerCase().includes('accounts office') ||
        admitCardHtml.toLowerCase().includes('access restricted')
      )) || profile.accountBalance < 0
    );

    if (options.admitCardOnly) {
      return {
        success: true,
        status: 200,
        hasRestriction: Boolean(isRestricted),
        exams,
        message: 'Exam admit card data fetched successfully'
      };
    }

    // Recalculate credits if not found on profile table
    if (!profile.creditsTaken && registeredCourses.length > 0) {
      profile.creditsTaken = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
    }
    if (!profile.creditsCompleted && completedCourses.length > 0) {
      profile.creditsCompleted = completedCourses.reduce((sum, c) => sum + c.credits, 0);
    }

    const studentData: StudentDetails = {
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

    return {
      success: true,
      status: 200,
      studentData,
      message: 'Real-time Presidency University SIMS data synchronized successfully'
    };
  } catch (err: any) {
    return {
      success: false,
      status: 500,
      error: `Internal sync server error: ${err.message || 'Unknown error'}`
    };
  }
}

export function puSyncPlugin() {
  const handler = async (req: Connect.IncomingMessage, res: http.ServerResponse) => {
    // Detailed console logging for debugging pu-sync requests
    console.log(`[pu-sync-plugin] Incoming request: ${req.method} ${req.url}`);
    console.log('[pu-sync-plugin] Request Headers:', JSON.stringify(req.headers, null, 2));

    if (req.method !== 'POST') {
      console.warn(`[pu-sync-plugin] Rejected non-POST request: ${req.method}`);
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
        const { studentId, password, skipAdmitCard, admitCardOnly } = JSON.parse(body || '{}');
        console.log(`[pu-sync-plugin] Executing sync for Student ID: ${studentId} (skipAdmitCard: ${skipAdmitCard}, admitCardOnly: ${admitCardOnly})`);
        const result = await executePresidencySync(studentId, password, { skipAdmitCard, admitCardOnly });
        
        console.log(`[pu-sync-plugin] Sync completed with status: ${result.status}, success: ${result.success}`);
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.error('[pu-sync-plugin] Error processing request:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: `Internal sync server error: ${err.message || 'Unknown error'}`
        }));
      }
    });
  };

  return {
    name: 'pu-sync-api',
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
      server.middlewares.use('/api/pu-sync', handler);
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
      server.middlewares.use('/api/pu-sync', handler);
    }
  };
}
