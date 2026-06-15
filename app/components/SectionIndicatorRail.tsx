'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomeSectionSpy } from '@/app/hooks/useHomeSectionSpy';
import { useBoldScrollMotion } from '@/app/hooks/useBoldScrollMotion';
import { HOME_RAIL_SECTIONS } from '@/lib/home-sections';
import { smoothScrollToSectionId } from '@/lib/smoothScroll';

export default function SectionIndicatorRail() {
  const { isHome, pastHero, activeSection, sectionProgress } = useHomeSectionSpy();
  const motionEnabled = useBoldScrollMotion();
  const [mounted, setMounted] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSectionClick = useCallback((id: string) => {
    setPendingSection(id);
    smoothScrollToSectionId(id, {
      onComplete: () => setPendingSection(null),
    });
  }, []);

  const highlightedSection = pendingSection ?? activeSection;

  if (!isHome || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {pastHero && (
        <motion.nav
          key="section-rail"
          aria-label="Page sections"
          initial={motionEnabled ? { opacity: 0, x: 28 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={motionEnabled ? { opacity: 0, x: 28 } : undefined}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="relative border-2 border-black/80 dark:border-white/15 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-[4px_4px_0px_rgba(217,4,41,0.35)] dark:shadow-[4px_4px_0px_rgba(217,4,41,0.5)] min-w-[11.5rem] overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-1 bg-black/10 dark:bg-white/10"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-crimson to-crimson-secondary origin-top transition-[height] duration-150 ease-out"
              style={{ height: `${sectionProgress * 100}%` }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-none bg-crimson/10 blur-xl"
            />

            <ul className="relative flex flex-col py-1">
              {HOME_RAIL_SECTIONS.map(({ id, label }, index) => {
                const isActive = highlightedSection === id;

                return (
                  <li key={id}>
                    <button
                      type="button"
                      aria-label={`Go to ${label} section`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => handleSectionClick(id)}
                      className={`group w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-l-2 ${
                        isActive
                          ? 'border-crimson bg-crimson/10 text-black dark:text-white'
                          : 'border-transparent text-black/70 hover:text-black hover:bg-black/[0.04] dark:text-white/70 dark:hover:text-white dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span
                        className={`relative shrink-0 h-2.5 w-2.5 rounded-full border-2 ${
                          isActive
                            ? 'border-crimson bg-crimson scale-110 section-dot-pulse'
                            : 'border-black/25 dark:border-white/30 bg-transparent group-hover:border-crimson group-hover:bg-crimson/25'
                        }`}
                      />
                      <span className="text-[10px] font-extrabold tabular-nums text-crimson">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider">
                        {label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>,
    document.body
  );
}
