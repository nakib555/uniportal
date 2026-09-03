import React from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { useMediaQuery } from './hooks/useMediaQuery';
import { SyncPortalDialog } from './components/SyncPortalDialog';
import { LoginView } from './views/LoginView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MobileLayout } from './components/layout/MobileLayout';
import { DesktopLayout } from './components/layout/DesktopLayout';

function AuthenticatedPortal({ isDesktop }: { isDesktop: boolean }) {
  const portalLogic = usePortalLogic();

  // Mobile layout gets wrapping smooth scroll.
  // Desktop layout has its own height 100vh management.
  if (isDesktop) {
    return (
      <>
        <DesktopLayout {...portalLogic} />
        <SyncPortalDialog portal={portalLogic} />
      </>
    );
  }

  return (
    <ReactLenis root>
      <MobileLayout {...portalLogic} />
      <SyncPortalDialog portal={portalLogic} />
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

