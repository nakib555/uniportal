import { StudentDetails } from '../data';
import { PuSyncResult } from './puParser';

// Persistent & In-memory synced data cache keyed by Student ID
const syncedStudentRegistry: Record<string, StudentDetails> = {};
const STORAGE_PREFIX = 'pu_synced_student_';
const ACTIVE_STUDENT_KEY = 'pu_active_student_id';

export class PuSyncService {
  /**
   * Retrieves any cached synced student data from memory or localStorage, or null if none
   */
  public static getSyncedStudent(studentId?: string | null): StudentDetails | null {
    let cleanId = (studentId || '').trim();

    // If no ID passed, check if there is an active student ID saved in localStorage
    if (!cleanId && typeof window !== 'undefined' && window.localStorage) {
      try {
        cleanId = (localStorage.getItem(ACTIVE_STUDENT_KEY) || '').trim();
      } catch (_) {}
    }

    if (!cleanId) return null;

    // Check in-memory cache first
    if (syncedStudentRegistry[cleanId]) {
      return syncedStudentRegistry[cleanId];
    }

    // Fall back to localStorage persistence
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(STORAGE_PREFIX + cleanId);
        if (stored) {
          const parsed = JSON.parse(stored) as StudentDetails;
          syncedStudentRegistry[cleanId] = parsed;
          return parsed;
        }
      } catch (e) {
        console.error('Error reading synced student from storage:', e);
      }
    }

    return null;
  }

  /**
   * Registers/caches student details in memory and localStorage
   */
  public static setSyncedStudent(studentId: string, details: StudentDetails): void {
    const cleanId = (studentId || '').trim();
    if (!cleanId) return;

    syncedStudentRegistry[cleanId] = details;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_PREFIX + cleanId, JSON.stringify(details));
        localStorage.setItem(ACTIVE_STUDENT_KEY, cleanId);
      } catch (e) {
        console.error('Error saving synced student to storage:', e);
      }
    }
  }

  /**
   * Clears synced student registry
   */
  public static clearSyncedStudent(studentId?: string): void {
    const cleanId = (studentId || '').trim();
    if (cleanId) {
      delete syncedStudentRegistry[cleanId];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(STORAGE_PREFIX + cleanId);
          if (localStorage.getItem(ACTIVE_STUDENT_KEY) === cleanId) {
            localStorage.removeItem(ACTIVE_STUDENT_KEY);
          }
        } catch (_) {}
      }
    } else {
      for (const key of Object.keys(syncedStudentRegistry)) {
        delete syncedStudentRegistry[key];
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(ACTIVE_STUDENT_KEY);
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(STORAGE_PREFIX)) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch (_) {}
      }
    }
  }

  /**
   * Synchronizes genuine real-time data from Presidency University SIMS using ID and password.
   * Directly follows the authentication and multi-tab crawling formula from ai_studio_code (1).py.
   * Zero dummy or fallback data is substituted.
   * By default, skips Exam Admit Card to keep initial login fast and defer admit card fetch.
   */
  public static async syncWithPresidency(
    studentId: string,
    password?: string,
    options?: { skipAdmitCard?: boolean }
  ): Promise<PuSyncResult> {
    const cleanId = studentId.trim();
    const cleanPass = (password || '').trim();
    const skipAdmitCard = options?.skipAdmitCard ?? true;

    if (!cleanId) {
      return {
        success: false,
        studentData: null as any,
        source: 'live_portal',
        message: 'Student ID is required.'
      };
    }

    if (!cleanPass) {
      return {
        success: false,
        studentData: null as any,
        source: 'live_portal',
        message: 'Password is required to authenticate with Presidency University SIMS.'
      };
    }

    try {
      const response = await fetch('/api/pu-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: cleanId,
          password: cleanPass,
          skipAdmitCard
        })
      });

      const result = await response.json();

      if (response.ok && result.success && result.studentData) {
        // Defensive data merging: if any tab failed or timed out, preserve existing cached data
        const existingStudent = this.getSyncedStudent(cleanId);
        const tabStatus = result.tabStatus as Record<string, boolean> | undefined;

        let mergedStudent: StudentDetails = result.studentData;
        if (existingStudent) {
          mergedStudent = {
            ...result.studentData,
            profile: {
              ...result.studentData.profile,
              photo: result.studentData.profile?.photo || existingStudent.profile?.photo,
              name: result.studentData.profile?.name || existingStudent.profile?.name,
              cgpa: result.studentData.profile?.cgpa || existingStudent.profile?.cgpa,
              accountBalance: typeof result.studentData.profile?.accountBalance === 'number' 
                ? result.studentData.profile.accountBalance 
                : existingStudent.profile?.accountBalance
            },
            // Preserve registered courses if the tab fetch failed or returned 0 while previous records existed
            registeredCourses: (tabStatus && tabStatus['Registered Courses'] === false && result.studentData.registeredCourses.length === 0 && existingStudent.registeredCourses.length > 0)
              ? existingStudent.registeredCourses
              : result.studentData.registeredCourses,
            // Preserve completed courses if the tab fetch failed
            completedCourses: (tabStatus && tabStatus['Completed Courses'] === false && result.studentData.completedCourses.length === 0 && existingStudent.completedCourses.length > 0)
              ? existingStudent.completedCourses
              : result.studentData.completedCourses,
            // Preserve class schedule if tab fetch failed
            schedule: (tabStatus && tabStatus['Class Schedule'] === false && result.studentData.schedule.length === 0 && existingStudent.schedule.length > 0)
              ? existingStudent.schedule
              : result.studentData.schedule,
            // Preserve financial transactions & statement summary if tab fetch failed
            transactions: (tabStatus && tabStatus['Accounts Overview'] === false && tabStatus['Semester Statement'] === false && result.studentData.transactions.length === 0 && existingStudent.transactions.length > 0)
              ? existingStudent.transactions
              : result.studentData.transactions,
            statementSummary: result.studentData.statementSummary || existingStudent.statementSummary,
            instalments: (result.studentData.instalments && result.studentData.instalments.length > 0)
              ? result.studentData.instalments
              : existingStudent.instalments,
            // Preserve related teachers if tab fetch failed
            teachers: (tabStatus && tabStatus['Related Teachers'] === false && result.studentData.teachers.length === 0 && existingStudent.teachers.length > 0)
              ? existingStudent.teachers
              : result.studentData.teachers,
            // Preserve bank slip fees if tab fetch failed
            bankSlipFees: (result.studentData.bankSlipFees && result.studentData.bankSlipFees.length > 0)
              ? result.studentData.bankSlipFees
              : existingStudent.bankSlipFees,
            // Preserve previously fetched Exam Admit Card records across regular syncs
            exams: (result.studentData.exams && result.studentData.exams.length > 0)
              ? result.studentData.exams
              : (existingStudent.exams || [])
          };
        }

        this.setSyncedStudent(cleanId, mergedStudent);
        return {
          success: true,
          studentData: mergedStudent,
          source: 'live_portal',
          message: result.message || 'Presidency University SIMS data synchronized successfully'
        };
      } else {
        return {
          success: false,
          studentData: null as any,
          source: 'live_portal',
          message: result.error || 'Authentication failed. Please verify your Student ID and Password.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        studentData: null as any,
        source: 'live_portal',
        message: `Presidency University SIMS network connection error: ${err.message || 'Server unreachable'}`
      };
    }
  }

  /**
   * On-demand lazy fetch for Exam Admit Card & routine only.
   * Authenticates with Presidency SIMS and retrieves examination routines & clearance without recrawling all other tabs.
   * Automatically updates cached student details in sync registry and localStorage.
   */
  public static async fetchAdmitCardOnly(
    studentId: string,
    password?: string
  ): Promise<{ success: boolean; exams: StudentDetails['exams']; hasRestriction: boolean; message?: string }> {
    const cleanId = studentId.trim();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        exams: [],
        hasRestriction: false,
        message: 'Student ID and password are required to fetch Exam Admit Card.'
      };
    }

    try {
      const response = await fetch('/api/pu-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: cleanId,
          password: cleanPass,
          admitCardOnly: true
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const exams = result.exams || [];
        const hasRestriction = Boolean(result.hasRestriction);

        // Update local registry with newly fetched exams and balance restriction if needed
        const existingStudent = this.getSyncedStudent(cleanId);
        if (existingStudent) {
          const updatedStudent: StudentDetails = {
            ...existingStudent,
            exams,
            profile: {
              ...existingStudent.profile,
              // If SIMS reported restriction and balance wasn't negative, reflect restriction
              accountBalance: hasRestriction && existingStudent.profile.accountBalance >= 0
                ? -1
                : existingStudent.profile.accountBalance
            }
          };
          this.setSyncedStudent(cleanId, updatedStudent);
        }

        return {
          success: true,
          exams,
          hasRestriction,
          message: result.message || 'Exam Admit Card retrieved successfully.'
        };
      } else {
        return {
          success: false,
          exams: [],
          hasRestriction: false,
          message: result.error || 'Unable to retrieve Exam Admit Card from Presidency SIMS.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        exams: [],
        hasRestriction: false,
        message: `Presidency SIMS connection error: ${err.message || 'Server unreachable'}`
      };
    }
  }
}

