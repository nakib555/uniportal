import React, { Suspense, lazy } from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Loader2 } from 'lucide-react';
import { SyncPortalDialog } from './components/SyncPortalDialog';
import { LoginView } from './views/LoginView';
import { ErrorBoundary } from './components/ErrorBoundary';

const MobileLayout = lazy(() => import('./components/layout/MobileLayout').then(module => ({ default: module.MobileLayout })));
const DesktopLayout = lazy(() => import('./components/layout/DesktopLayout').then(module => ({ default: module.DesktopLayout })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
    <Loader2 className="w-8 h-8 animate-spin text-[#8c1515] dark:text-[#ef4444]" />
  </div>
);

function AuthenticatedPortal({ isDesktop }: { isDesktop: boolean }) {
  const portalLogic = usePortalLogic();

  // Mobile layout gets wrapping smooth scroll.
  // Desktop layout has its own height 100vh management.
  if (isDesktop) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DesktopLayout {...portalLogic} />
        <SyncPortalDialog portal={portalLogic} />
      </Suspense>
    );
  }

  return (
    <ReactLenis root>
      <Suspense fallback={<LoadingFallback />}>
        <MobileLayout {...portalLogic} />
        <SyncPortalDialog portal={portalLogic} />
      </Suspense>
    </ReactLenis>
  );
}

export default function App() {
  const { isLoggedIn, isDarkMode } = useAppStore();
  const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint

  React.useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Absolute 30-Minute Session Timeout with Auto-logout (Regardless of Activity)
  React.useEffect(() => {
    if (!isLoggedIn) return;

    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes absolute session duration

    // Ensure session expiration is set once upon login
    const existingExpiresAt = localStorage.getItem('pu_session_expires_at');
    if (!existingExpiresAt) {
      localStorage.setItem('pu_session_expires_at', String(Date.now() + SESSION_DURATION));
    } else if (Date.now() >= Number(existingExpiresAt)) {
      localStorage.setItem('pu_auto_logged_out', 'true');
      useAppStore.getState().setIsLoggedIn(false);
      return;
    }

    const checkSessionExpiration = () => {
      const currentExpiresAt = localStorage.getItem('pu_session_expires_at');
      if (currentExpiresAt && Date.now() >= Number(currentExpiresAt)) {
        localStorage.setItem('pu_auto_logged_out', 'true');
        useAppStore.getState().setIsLoggedIn(false);
      }
    };

    // Run expiration check every 3 seconds
    const intervalId = setInterval(checkSessionExpiration, 3000);

    // Immediate check when tab becomes visible or focused (e.g. laptop wake or returning to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSessionExpiration();
      }
    };
    const handleFocus = () => {
      checkSessionExpiration();
    };

    // Cross-tab synchronization: if logged out or expired in another tab, update immediately
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pu_session_expires_at' || e.key === 'pu_is_logged_in') {
        checkSessionExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isLoggedIn]);

  return (
    <ErrorBoundary>
      {!isLoggedIn ? (
        <LoginView />
      ) : (
        <AuthenticatedPortal isDesktop={isDesktop} />
      )}
    </ErrorBoundary>
  );
}

