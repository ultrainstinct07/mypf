'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParticleCloud } from './ParticleCloudProvider';
import { useParticleCloudEnabled } from '@/app/hooks/useParticleCloudEnabled';
import TerminalLoaderPanel from './TerminalLoaderPanel';

const SPLASH_DURATION_MS = 2500;
const EXIT_DURATION_S = 0.55;

export default function SiteLoadingScreen() {
  const { showSplash, dismissSplash } = useParticleCloud();
  const webglEnabled = useParticleCloudEnabled();
  const [overlayVisible, setOverlayVisible] = useState(showSplash);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const startTimeRef = useRef<number>(0);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (showSplash) {
      const handle = requestAnimationFrame(() => {
        setOverlayVisible(true);
      });
      dismissedRef.current = false;
      return () => cancelAnimationFrame(handle);
    }
  }, [showSplash]);

  const finishSplash = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setProgress(100);
    setAnnouncement('Site loaded');
    setOverlayVisible(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    dismissSplash();
    document.body.style.overflow = '';
  }, [dismissSplash]);

  useEffect(() => {
    if (!showSplash || !overlayVisible) return;

    startTimeRef.current = Date.now();
    document.body.style.overflow = 'hidden';

    const skipTimer = window.setTimeout(() => setCanSkip(true), 500);
    const autoDismissTimer = window.setTimeout(finishSplash, SPLASH_DURATION_MS);

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeProgress = Math.min(elapsed / SPLASH_DURATION_MS, 1);
      setProgress(Math.min(100, Math.round(timeProgress * 100)));
    };

    const interval = window.setInterval(tick, 50);
    tick();

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoDismissTimer);
      clearInterval(interval);
    };
  }, [showSplash, overlayVisible, finishSplash]);

  if (!showSplash && !overlayVisible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {overlayVisible && (
        <motion.div
          key="site-loader"
          role="dialog"
          aria-modal="true"
          aria-busy={progress < 100}
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION_S, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => canSkip && finishSplash()}
        >
          <span className="sr-only" aria-live="polite">
            {announcement}
          </span>

          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, transparent 0%, transparent 60%, rgba(5,5,5,0.25) 100%)',
            }}
          />

          <div className="absolute inset-x-4 bottom-8 sm:bottom-10 lg:bottom-12 lg:right-8 lg:left-auto lg:translate-x-0 flex justify-center lg:justify-end pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full lg:w-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: EXIT_DURATION_S, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <TerminalLoaderPanel
                progress={progress}
                webglEnabled={webglEnabled}
                canSkip={canSkip}
                onSkip={finishSplash}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
