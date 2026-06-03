import React, { Suspense, lazy } from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Loader2 } from 'lucide-react';

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
      </Suspense>
    );
  }

  return (
    <ReactLenis root>
      <Suspense fallback={<LoadingFallback />}>
        <MobileLayout {...portalLogic} />
      </Suspense>
    </ReactLenis>
  );
}

