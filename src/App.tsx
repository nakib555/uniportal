import React from 'react';
import { usePortalLogic } from './hooks/usePortalLogic';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './desktop/DesktopLayout';
import { ReactLenis } from 'lenis/react';

export default function App() {
  const portalLogic = usePortalLogic();

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
