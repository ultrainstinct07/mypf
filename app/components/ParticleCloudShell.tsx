'use client';

import dynamic from 'next/dynamic';
import { ParticleCloudProvider } from './ParticleCloudProvider';
import SiteLoadingScreen from './SiteLoadingScreen';

const ParticleCloudCanvas = dynamic(() => import('./ParticleCloudCanvas'), {
  ssr: false,
});

export default function ParticleCloudShell({ children }: { children: React.ReactNode }) {
  return (
    <ParticleCloudProvider>
      {children}
      <ParticleCloudCanvas />
      <SiteLoadingScreen />
    </ParticleCloudProvider>
  );
}
