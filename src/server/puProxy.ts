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
  { tabName: 'Schedule Overview', url: `${SIMS_BASE}/students/schedule` },
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

export function puSyncPlugin() {
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
        const cleanId = (studentId || '').trim();
        const cleanPass = (password || '').trim();

        if (!cleanId || !cleanPass) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Student ID and password are required' }));
          return;
        }

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
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            error: `Could not connect to Presidency University SIMS portal: ${err.message || 'Connection timed out'}`
          }));
          return;
        }

        // 2. Parse login form inputs dynamically as in ai_studio_code (1).py
        const $login = cheerio.load(loginPageHtml);
        const $form = $login('form');

        if ($form.length === 0) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Could not load Presidency University login form.' }));
          return;
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
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            error: `Connection error during SIMS authentication: ${err.message || 'Network error'}`
          }));
          return;
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
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: errorMsg }));
          return;
        }

        // 4. Authenticated successfully: Fetch all tabs concurrently with session cookie
        const tabFetchHeaders = {
          ...commonHeaders,
          'Referer': `${SIMS_BASE}/students`
        };

        const tabPromises = STRUCTURE.map(async (item) => {
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
          status: 'Registered',
          admissionSemester: '',
          currentSemester: '',
          program: 'Electrical & Electronic Engineering',
          creditsTaken: 0,
          creditsCompleted: 0,
          cgpa: 0.0,
          accountBalance: 0.0,
          email: `${cleanId}@student.presidency.edu.bd`,
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
              let p: Major = 'Electrical & Electronic Engineering';
              if (val.toLowerCase().includes('computer')) p = 'Computer Science & Engineering';
              else if (val.toLowerCase().includes('business')) p = 'Business Administration';
              profile.program = p;
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
              exams.push({
                securityCode: securityCodeMap[courseCode] || '',
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

        // (f) Transactions Parsing
        const transHtml = tabMap.get('Semester Statement') || tabMap.get('Accounts Overview') || '';
        const $trans = cheerio.load(transHtml);
        const transactions: Transaction[] = [];

        $trans('table tr').each((_, tr) => {
          const tds = $trans(tr).find('td');
          if (tds.length >= 8) {
            const id = cleanText($trans(tds[0]).text());
            const date = cleanText($trans(tds[1]).text());
            const code = cleanText($trans(tds[3]).text());
            const description = cleanText($trans(tds[4]).text());
            const debitStr = cleanText($trans(tds[5]).text()).replace(/,/g, '');
            const creditStr = cleanText($trans(tds[6]).text()).replace(/,/g, '');
            const balanceStr = cleanText($trans(tds[7]).text()).replace(/,/g, '');

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
          exams
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          studentData,
          message: 'Real-time Presidency University SIMS data synchronized successfully'
        }));
      } catch (err: any) {
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
      server.middlewares.use('/api/pu-sync', handler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use('/api/pu-sync', handler);
    }
  };
}
