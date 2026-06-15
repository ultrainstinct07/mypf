'use client';

import type { MotionValue } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ParticleCloudPhase = 'splash' | 'ambient' | 'hidden';

export interface AmbientCameraMotionValues {
  zoom: MotionValue<number>;
  orbitX: MotionValue<number>;
  orbitY: MotionValue<number>;
}

interface ParticleCloudContextValue {
  phase: ParticleCloudPhase;
  canvasOpacity: number;
  ambientOpacity: MotionValue<number> | null;
  ambientCamera: AmbientCameraMotionValues | null;
  splashVisible: boolean;
  ambientEnabled: boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  setAmbientOpacity: (value: MotionValue<number> | null) => void;
  setAmbientCamera: (values: AmbientCameraMotionValues | null) => void;
  dismissSplash: () => void;
  showSplash: boolean;
}

const ParticleCloudContext = createContext<ParticleCloudContextValue | null>(null);

export function ParticleCloudProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<ParticleCloudPhase>('splash');
  const [splashVisible, setSplashVisible] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [ambientOpacity, setAmbientOpacity] = useState<MotionValue<number> | null>(null);
  const [ambientCamera, setAmbientCamera] = useState<AmbientCameraMotionValues | null>(null);
  const [ambientScrollOpacity, setAmbientScrollOpacity] = useState(0);

  const dismissSplash = useCallback(() => {
    setSplashVisible(false);
    setPhase(ambientEnabled ? 'ambient' : 'hidden');
  }, [ambientEnabled]);

  useEffect(() => {
    if (phase === 'hidden' && ambientEnabled && !splashVisible) {
      setPhase('ambient');
    }
    if (phase === 'ambient' && !ambientEnabled) {
      setPhase('hidden');
    }
  }, [ambientEnabled, phase, splashVisible]);

  useEffect(() => {
    if (!ambientOpacity || splashVisible || phase !== 'ambient') return;

    const sync = (value: number) => setAmbientScrollOpacity(value);
    sync(ambientOpacity.get());
    return ambientOpacity.on('change', sync);
  }, [ambientOpacity, phase, splashVisible]);

  const canvasOpacity = useMemo(() => {
    if (phase === 'splash') return 1;
    if (phase === 'ambient') return ambientScrollOpacity;
    return 0;
  }, [phase, ambientScrollOpacity]);

  const value = useMemo(
    () => ({
      phase,
      canvasOpacity,
      ambientOpacity,
      ambientCamera,
      splashVisible,
      ambientEnabled,
      setAmbientEnabled,
      setAmbientOpacity,
      setAmbientCamera,
      dismissSplash,
      showSplash: splashVisible,
    }),
    [
      phase,
      canvasOpacity,
      ambientOpacity,
      ambientCamera,
      splashVisible,
      ambientEnabled,
      dismissSplash,
    ]
  );

  return (
    <ParticleCloudContext.Provider value={value}>{children}</ParticleCloudContext.Provider>
  );
}

export function useParticleCloud() {
  const context = useContext(ParticleCloudContext);
  if (!context) {
    throw new Error('useParticleCloud must be used within ParticleCloudProvider');
  }
  return context;
}
