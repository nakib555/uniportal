export const biometricAuth = {
  isAvailable: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      return false;
    }
  },

  hasRegisteredBiometric: (studentId?: string): boolean => {
    if (!studentId) {
      // Check if any biometric is registered
      const keys = Object.keys(localStorage);
      return keys.some(key => key.startsWith('pu_bio_'));
    }
    return !!localStorage.getItem(`pu_bio_${studentId}`);
  },

  getRegisteredStudentIds: (): string[] => {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith('pu_bio_'))
      .map(key => key.replace('pu_bio_', ''));
  },

  register: async (studentId: string, passwordToStore: string): Promise<boolean> => {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "UniPortal",
        },
        user: {
          id: userId,
          name: studentId,
          displayName: studentId,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      if (!credential) return false;

      // Base64 encode the password (weak obfuscation, mainly for convenience storage)
      const encodedPass = btoa(encodeURIComponent(passwordToStore));
      const bioData = {
        credentialId: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(credential.rawId)))),
        encodedPass
      };

      localStorage.setItem(`pu_bio_${studentId}`, JSON.stringify(bioData));
      return true;
    } catch (err) {
      console.error("Biometric registration failed:", err);
      return false;
    }
  },

  authenticate: async (studentId: string): Promise<string | null> => {
    try {
      const stored = localStorage.getItem(`pu_bio_${studentId}`);
      if (!stored) return null;

      const { credentialId, encodedPass } = JSON.parse(stored);
      if (!credentialId || !encodedPass) return null;

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Convert credentialId back to ArrayBuffer
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
        userVerification: "required",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({ publicKey });
      if (!assertion) return null;

      // Success! Decode the password
      return decodeURIComponent(atob(encodedPass));
    } catch (err) {
      console.error("Biometric authentication failed:", err);
      return null;
    }
  }
};
