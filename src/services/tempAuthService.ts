/**
 * Session-scoped temporary credential storage for on-demand lazy operations.
 * Credentials are stored in memory and sessionStorage only for the active session,
 * never written to persistent localStorage, and automatically wiped on logout or window closure.
 */

interface TempCredentials {
  studentId: string;
  password: string;
  timestamp: number;
}

const SESSION_KEY = 'pu_temp_session_auth';
let inMemoryCredentials: TempCredentials | null = null;

export const tempAuthService = {
  /**
   * Save temporary credentials for current active session
   */
  setTempCredentials(studentId: string, password: string): void {
    const cleanId = (studentId || '').trim();
    const cleanPass = (password || '').trim();
    if (!cleanId || !cleanPass) return;

    const data: TempCredentials = {
      studentId: cleanId,
      password: cleanPass,
      timestamp: Date.now()
    };

    inMemoryCredentials = data;

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
      } catch (err) {
        console.warn('Unable to write temporary credentials to sessionStorage:', err);
      }
    }
  },

  /**
   * Retrieve temporary credentials if available
   */
  getTempCredentials(studentId?: string | null): { studentId: string; password: string } | null {
    let creds = inMemoryCredentials;

    if (!creds && typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
          creds = JSON.parse(stored) as TempCredentials;
          inMemoryCredentials = creds;
        }
      } catch (err) {
        console.warn('Unable to read temporary credentials from sessionStorage:', err);
      }
    }

    if (!creds) return null;

    // Check if 30-minute session deadline has passed
    if (typeof window !== 'undefined' && window.localStorage) {
      const expiresAt = Number(localStorage.getItem('pu_session_expires_at') || 0);
      if (expiresAt > 0 && Date.now() >= expiresAt) {
        tempAuthService.clearTempCredentials();
        return null;
      }
    }

    // Also check max 30-minute timestamp on the credential itself
    if (creds.timestamp && (Date.now() - creds.timestamp > 30 * 60 * 1000)) {
      tempAuthService.clearTempCredentials();
      return null;
    }

    // Verify studentId matches if provided
    if (studentId && creds.studentId !== studentId.trim()) {
      return null;
    }

    return {
      studentId: creds.studentId,
      password: creds.password
    };
  },

  /**
   * Clear all temporary credentials immediately (e.g. on logout)
   */
  clearTempCredentials(): void {
    inMemoryCredentials = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (_) {}
    }
  }
};
