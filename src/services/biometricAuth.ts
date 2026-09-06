export interface WebAuthnSupportStatus {
  isSupported: boolean;
  hasPlatformAuthenticator: boolean;
  isIframe: boolean;
  registeredIds: string[];
}

export interface BiometricAuthResult {
  success: boolean;
  password?: string;
  errorCode?: 'cancelled' | 'not_supported' | 'not_registered' | 'iframe_restricted' | 'failed';
  errorMessage?: string;
}

export interface BiometricRegisterResult {
  success: boolean;
  errorCode?: 'cancelled' | 'not_supported' | 'iframe_restricted' | 'failed';
  errorMessage?: string;
}

export const biometricAuth = {
  isAvailable: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    try {
      if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        return available;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  checkSupport: async (): Promise<WebAuthnSupportStatus> => {
    if (typeof window === 'undefined') {
      return { isSupported: false, hasPlatformAuthenticator: false, isIframe: false, registeredIds: [] };
    }

    const isSupported = !!(window.PublicKeyCredential && navigator.credentials);
    let hasPlatformAuthenticator = false;
    let isIframe = false;

    try {
      isIframe = window.self !== window.top;
    } catch {
      isIframe = true;
    }

    if (isSupported) {
      try {
        if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
          hasPlatformAuthenticator = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
      } catch (e) {
        console.warn('Error checking platform authenticator:', e);
      }
    }

    const registeredIds = biometricAuth.getRegisteredStudentIds();

    return {
      isSupported,
      hasPlatformAuthenticator,
      isIframe,
      registeredIds,
    };
  },

  hasRegisteredBiometric: (studentId?: string): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    if (!studentId) {
      const keys = Object.keys(localStorage);
      return keys.some(key => key.startsWith('pu_bio_'));
    }
    return !!localStorage.getItem(`pu_bio_${studentId.trim()}`);
  },

  getRegisteredStudentIds: (): string[] => {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith('pu_bio_'))
      .map(key => key.replace('pu_bio_', ''));
  },

  getBiometricDetails: (studentId: string) => {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const stored = localStorage.getItem(`pu_bio_${studentId.trim()}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  register: async (studentId: string, passwordToStore: string): Promise<BiometricRegisterResult> => {
    const cleanId = studentId.trim();
    if (!cleanId || !passwordToStore) {
      return { success: false, errorCode: 'failed', errorMessage: 'Student ID and password are required.' };
    }

    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
      return {
        success: false,
        errorCode: 'not_supported',
        errorMessage: 'Web Authentication API is not supported on this browser or platform.'
      };
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Presidency University SIMS",
        },
        user: {
          id: userId,
          name: cleanId,
          displayName: `Student ${cleanId}`,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      if (!credential) {
        return { success: false, errorCode: 'failed', errorMessage: 'No credential was returned by the authenticator.' };
      }

      // Base64 encode the password for local autofill
      const encodedPass = btoa(encodeURIComponent(passwordToStore));
      const rawIdArray = Array.from(new Uint8Array(credential.rawId));
      const credentialId = btoa(String.fromCharCode.apply(null, rawIdArray));

      const bioData = {
        studentId: cleanId,
        credentialId,
        encodedPass,
        enrolledAt: new Date().toISOString(),
        deviceLabel: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop / Laptop'
      };

      localStorage.setItem(`pu_bio_${cleanId}`, JSON.stringify(bioData));
      return { success: true };
    } catch (err: any) {
      console.error("Biometric registration failed:", err);
      const name = err?.name || '';
      const msg = err?.message || '';

      if (name === 'NotAllowedError' || msg.includes('cancel') || msg.includes('abort')) {
        return { success: false, errorCode: 'cancelled', errorMessage: 'Biometric registration was cancelled or timed out.' };
      }
      if (name === 'SecurityError' || msg.includes('iframe') || msg.includes('cross-origin')) {
        return { 
          success: false, 
          errorCode: 'iframe_restricted', 
          errorMessage: 'WebAuthn is restricted inside iframe preview. Please open in a new tab.' 
        };
      }
      return { success: false, errorCode: 'failed', errorMessage: msg || 'Failed to register biometric authenticator.' };
    }
  },

  authenticate: async (studentId: string): Promise<string | null> => {
    const res = await biometricAuth.authenticateDetailed(studentId);
    return res.password || null;
  },

  authenticateDetailed: async (studentId: string): Promise<BiometricAuthResult> => {
    const cleanId = studentId.trim();
    if (!cleanId) {
      return { success: false, errorCode: 'failed', errorMessage: 'Please enter or select a Student ID.' };
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, errorCode: 'not_supported', errorMessage: 'Web Storage is unavailable.' };
    }

    const stored = localStorage.getItem(`pu_bio_${cleanId}`);
    if (!stored) {
      return { 
        success: false, 
        errorCode: 'not_registered', 
        errorMessage: `No biometric credential enrolled for Student ID ${cleanId}.` 
      };
    }

    try {
      const { credentialId, encodedPass } = JSON.parse(stored);
      if (!credentialId || !encodedPass) {
        return { success: false, errorCode: 'failed', errorMessage: 'Corrupted biometric record.' };
      }

      if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
        return { 
          success: false, 
          errorCode: 'not_supported', 
          errorMessage: 'Web Authentication API is not supported on this device.' 
        };
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Convert credentialId back to Uint8Array
      const binaryString = atob(credentialId);
      const credIdBuffer = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        credIdBuffer[i] = binaryString.charCodeAt(i);
      }

      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: credIdBuffer,
          type: "public-key"
        }],
        userVerification: "preferred",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({ publicKey });
      if (!assertion) {
        return { success: false, errorCode: 'failed', errorMessage: 'Authentication prompt did not return credentials.' };
      }

      const password = decodeURIComponent(atob(encodedPass));
      return { success: true, password };
    } catch (err: any) {
      console.error("Biometric authentication failed:", err);
      const name = err?.name || '';
      const msg = err?.message || '';

      if (name === 'NotAllowedError' || msg.includes('cancel') || msg.includes('abort')) {
        return { success: false, errorCode: 'cancelled', errorMessage: 'Biometric verification was cancelled or timed out.' };
      }
      if (name === 'SecurityError' || msg.includes('iframe') || msg.includes('cross-origin')) {
        return { 
          success: false, 
          errorCode: 'iframe_restricted', 
          errorMessage: 'WebAuthn is restricted inside iframe preview. Please open in a new tab.' 
        };
      }
      return { success: false, errorCode: 'failed', errorMessage: msg || 'Biometric verification error.' };
    }
  },

  deleteBiometric: (studentId: string): boolean => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    localStorage.removeItem(`pu_bio_${studentId.trim()}`);
    return true;
  }
};

