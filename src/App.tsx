import React, { Suspense, lazy } from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Loader2 } from 'lucide-react';
import { SyncPortalDialog } from './components/SyncPortalDialog';

const MobileLayout = lazy(() => import('./components/layout/MobileLayout').then(module => ({ default: module.MobileLayout })));
const DesktopLayout = lazy(() => import('./components/layout/DesktopLayout').then(module => ({ default: module.DesktopLayout })));
const LoginView = lazy(() => import('./views/LoginView').then(module => ({ default: module.LoginView })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
    <Loader2 className="w-8 h-8 animate-spin text-[#8c1515] dark:text-[#ef4444]" />
  </div>
);

export default function App() {
  const portalLogic = usePortalLogic();
  const { isLoggedIn, isDarkMode } = useAppStore();
  const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint

  React.useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // 30 Minutes Session Timeout with Auto-logout
  React.useEffect(() => {
    if (!isLoggedIn) return;

    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const updateSessionExpiration = () => {
      localStorage.setItem('pu_session_expires_at', String(Date.now() + SESSION_DURATION));
    };

    const expiresAt = localStorage.getItem('pu_session_expires_at');
    if (!expiresAt) {
      updateSessionExpiration();
    } else if (Date.now() > Number(expiresAt)) {
      localStorage.setItem('pu_auto_logged_out', 'true');
      useAppStore.getState().setIsLoggedIn(false);
      return;
    }

    let lastWrite = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastWrite > 5000) {
        updateSessionExpiration();
        lastWrite = now;
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    const intervalId = setInterval(() => {
      const currentExpiresAt = localStorage.getItem('pu_session_expires_at');
      if (currentExpiresAt && Date.now() > Number(currentExpiresAt)) {
        localStorage.setItem('pu_auto_logged_out', 'true');
        useAppStore.getState().setIsLoggedIn(false);
      }
    }, 5000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
       <ReactLenis root>
          <Suspense fallback={<LoadingFallback />}>
             <LoginView />
          </Suspense>
       </ReactLenis>
    );
  }

  // Mobile layout gets wrapping smooth scroll.
  // Desktop layout has its own height 100vh management and doesn't use document smooth scrolling directly in the same way, or handles it internally.
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

