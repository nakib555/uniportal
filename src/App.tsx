import React from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './desktop/DesktopLayout';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';
import { LoginView } from './views/LoginView';

export default function App() {
  const portalLogic = usePortalLogic();
  const { isLoggedIn, isDarkMode } = useAppStore();

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

  return (
    <ReactLenis root>
      <div className="md:hidden">
        <MobileLayout {...portalLogic} />
      </div>
      <div className="hidden md:block">
        <DesktopLayout {...portalLogic} />
      </div>
    </ReactLenis>
  );
}
