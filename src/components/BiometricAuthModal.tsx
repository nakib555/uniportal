import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Fingerprint,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  KeyRound,
  Info
} from 'lucide-react';
import { biometricAuth, WebAuthnSupportStatus } from '../services/biometricAuth';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (studentId: string, password: string) => Promise<void>;
  currentStudentId?: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentStudentId = '',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'enroll' | 'info'>('signin');
  const [status, setStatus] = useState<WebAuthnSupportStatus | null>(null);
  const [targetStudentId, setTargetStudentId] = useState(currentStudentId);
  const [portalPassword, setPortalPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const refreshStatus = async () => {
    const s = await biometricAuth.checkSupport();
    setStatus(s);
    if (s.registeredIds.length === 0 && !targetStudentId) {
      setActiveTab('enroll');
    } else if (s.registeredIds.length > 0 && !targetStudentId) {
      setTargetStudentId(s.registeredIds[0]);
      setActiveTab('signin');
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
      setActionError('');
      setActionSuccess('');
      if (currentStudentId) {
        setTargetStudentId(currentStudentId);
      }
    }
  }, [isOpen, currentStudentId]);

  const handleAuthenticate = async (studentIdToUse: string) => {
    if (!studentIdToUse.trim()) {
      setActionError('Please select or enter a Student ID.');
      return;
    }

    setIsLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const result = await biometricAuth.authenticateDetailed(studentIdToUse.trim());
      if (result.success && result.password) {
        setActionSuccess('Biometric signature verified! Signing into Presidency portal...');
        await onSuccessLogin(studentIdToUse.trim(), result.password);
        onClose();
      } else {
        if (result.errorCode === 'iframe_restricted') {
          setActionError('WebAuthn is blocked inside preview iframe. Please click "Open in New Tab" below.');
        } else if (result.errorCode === 'cancelled') {
          setActionError('Biometric prompt was cancelled or timed out.');
        } else if (result.errorCode === 'not_registered') {
          setActionError(`No passkey registered for Student ID ${studentIdToUse}. Please enroll it first.`);
          setActiveTab('enroll');
        } else {
          setActionError(result.errorMessage || 'Biometric verification failed.');
        }
      }
    } catch (err: any) {
      setActionError(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId.trim() || !portalPassword.trim()) {
      setActionError('Please enter both your Student ID and your Portal Password.');
      return;
    }

    setIsLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const regResult = await biometricAuth.register(targetStudentId.trim(), portalPassword.trim());
      if (regResult.success) {
        setActionSuccess('Device passkey successfully enrolled!');
        await refreshStatus();
        // Automatically proceed to sign in
        setTimeout(async () => {
          await onSuccessLogin(targetStudentId.trim(), portalPassword.trim());
          onClose();
        }, 600);
      } else {
        if (regResult.errorCode === 'iframe_restricted') {
          setActionError('WebAuthn hardware access is restricted inside preview iframe. Please open the app in a new tab.');
        } else if (regResult.errorCode === 'cancelled') {
          setActionError('Biometric setup was cancelled or timed out on your device.');
        } else {
          setActionError(regResult.errorMessage || 'Failed to register device passkey.');
        }
      }
    } catch (err: any) {
      setActionError(err?.message || 'Enrollment error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePasskey = (id: string) => {
    biometricAuth.deleteBiometric(id);
    refreshStatus();
    setActionSuccess(`Removed passkey for Student ID ${id}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleOpenStandalone = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c1515]/10 dark:bg-[#ef4444]/15 text-[#8c1515] dark:text-[#ef4444] flex items-center justify-center shrink-0">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-stone-900 dark:text-white">
                WebAuthn & Biometric Sign-In
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500 dark:text-stone-400">
                FIDO2 Touch ID, Face ID, Windows Hello & Security Keys
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl mt-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setActionError(''); setActionSuccess(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-stone-700 text-[#8c1515] dark:text-[#ef4444] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            One-Touch Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('enroll'); setActionError(''); setActionSuccess(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'enroll'
                ? 'bg-white dark:bg-stone-700 text-[#8c1515] dark:text-[#ef4444] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Enroll Device
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('info'); setActionError(''); setActionSuccess(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'info'
                ? 'bg-white dark:bg-stone-700 text-[#8c1515] dark:text-[#ef4444] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Device Status
          </button>
        </div>

        {/* Status Alerts */}
        {actionError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{actionError}</div>
          </div>
        )}

        {actionSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{actionSuccess}</div>
          </div>
        )}

        {/* Tab 1: One-Touch Sign In */}
        {activeTab === 'signin' && (
          <div className="space-y-4 pt-2">
            {status?.registeredIds && status.registeredIds.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Select an enrolled account to authenticate with your device sensor:
                </p>

                <div className="space-y-2">
                  {status.registeredIds.map((id) => (
                    <div
                      key={id}
                      className="p-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between hover:border-[#8c1515]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#8c1515]/10 dark:bg-[#ef4444]/15 text-[#8c1515] dark:text-[#ef4444] rounded-lg">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">
                            Student #{id}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            Passkey enrolled on this device
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAuthenticate(id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Fingerprint className="w-3.5 h-3.5" />}
                          Sign In
                        </button>
                        <button
                          type="button"
                          title="Remove passkey"
                          onClick={() => handleDeletePasskey(id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                    No Passkey Enrolled on This Device
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Link your Student ID and password to this browser once to enable instant biometric login.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('enroll')}
                  className="w-full py-2.5 bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Enroll Device Passkey Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Enroll Device */}
        {activeTab === 'enroll' && (
          <form onSubmit={handleEnroll} className="space-y-3 pt-2">
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Pair your Student ID with this device's Touch ID, Face ID, or Windows Hello. Next time, you won't need to type your password.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Student ID</label>
              <input
                type="text"
                required
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                placeholder="e.g. 20230001"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Presidency SIMS Password</label>
              <input
                type="password"
                required
                value={portalPassword}
                onChange={(e) => setPortalPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 focus:border-[#8c1515]"
              />
              <p className="text-[10px] text-stone-500">
                Your password is kept securely in your local hardware credential vault.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-[#8c1515] dark:bg-[#ef4444] hover:bg-[#731010] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waiting for Device Biometric Sensor...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Touch Sensor & Enroll Device</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Device Diagnostics & Support */}
        {activeTab === 'info' && (
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-2 text-xs border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                <span className="text-stone-600 dark:text-stone-400">WebAuthn API</span>
                <span className={`font-bold flex items-center gap-1 ${status?.isSupported ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {status?.isSupported ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {status?.isSupported ? 'Supported' : 'Not Supported'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                <span className="text-stone-600 dark:text-stone-400">Platform Authenticator</span>
                <span className={`font-bold flex items-center gap-1 ${status?.hasPlatformAuthenticator ? 'text-emerald-600' : 'text-stone-500'}`}>
                  {status?.hasPlatformAuthenticator ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                  {status?.hasPlatformAuthenticator ? 'Touch ID / Face ID Ready' : 'External / Pin / Key'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-stone-600 dark:text-stone-400">Active Passkeys</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {status?.registeredIds.length || 0} registered
                </span>
              </div>
            </div>

            {status?.isIframe && (
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-xs space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Running in Web Preview
                </p>
                <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                  Browser security rules restrict hardware biometric sensors inside embedded iframes. Open in a new tab for native Touch ID, Face ID, or Windows Hello.
                </p>
                <button
                  type="button"
                  onClick={handleOpenStandalone}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in New Tab
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
