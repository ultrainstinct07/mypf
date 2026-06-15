'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      rafRef.current = null;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScrollableHeight = documentHeight - windowHeight;
      const scrollProgress =
        totalScrollableHeight > 0 ? (scrollTop / totalScrollableHeight) * 100 : 0;

      if (Math.abs(lastProgressRef.current - scrollProgress) < 0.05) return;

      lastProgressRef.current = scrollProgress;
      if (barRef.current) {
        barRef.current.style.width = `${scrollProgress}%`;
      }
    };

    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-dark z-50">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-crimson to-crimson-secondary transition-[width] duration-150 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  );
}
