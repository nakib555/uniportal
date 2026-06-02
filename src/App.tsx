import React from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { MobileLayout } from './components/layout/MobileLayout';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { LoginView } from './views/LoginView';
import { useMediaQuery } from './hooks/useMediaQuery';

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
          <LoginView />
       </ReactLenis>
    );
  }

  // Mobile layout gets wrapping smooth scroll.
  // Desktop layout has its own height 100vh management and doesn't use document smooth scrolling directly in the same way, or handles it internally.
  if (isDesktop) {
    return <DesktopLayout {...portalLogic} />;
  }

  return (
    <ReactLenis root>
      <MobileLayout {...portalLogic} />
    </ReactLenis>
  );
}
