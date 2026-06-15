'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useBoldScrollMotion } from '../hooks/useBoldScrollMotion';

const GRID_COLUMNS = [20, 40, 60, 80];

export default function ScrollAmbientBackground() {
  const motionEnabled = useBoldScrollMotion();
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight, { passive: true });
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const fadeStart = viewportHeight * 0.35;
  const fadeEnd = viewportHeight * 1.1;

  const scrollOpacity = useTransform(scrollY, [fadeStart, fadeEnd], [0, 0.45]);
  const scanLineY = useTransform(scrollY, (value) => value * 0.12);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: motionEnabled ? scrollOpacity : 0.12 }}
    >
      <div
        className="absolute inset-0 opacity-[0.14] dark:opacity-[0.1]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 35px,
            rgba(217, 4, 41, 0.1) 35px,
            rgba(217, 4, 41, 0.1) 70px
          )`,
        }}
      />

      {GRID_COLUMNS.map((pct) => (
        <div
          key={pct}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${pct}%`,
            background: 'rgba(255, 255, 255, 0.07)',
          }}
        />
      ))}

      {motionEnabled && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-px will-change-transform"
            style={{
              y: scanLineY,
              top: '18%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(217,4,41,0.25) 15%, rgba(217,4,41,0.75) 50%, rgba(217,4,41,0.25) 85%, transparent 100%)',
            }}
          />
          <motion.div
            className="absolute left-0 right-0 h-px will-change-transform"
            style={{
              y: scanLineY,
              top: '62%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)',
            }}
          />
        </>
      )}
    </motion.div>
  );
}
