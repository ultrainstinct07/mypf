'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HOME_RAIL_SECTIONS, HOME_SECTION_IDS } from '@/lib/home-sections';

function computePastHero() {
  const hero = document.getElementById('hero');
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.bottom <= window.innerHeight * 0.25;
}

function computeSectionProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const totalScrollableHeight = documentHeight - windowHeight;
  if (totalScrollableHeight <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / totalScrollableHeight));
}

function pickActiveSection(sectionRatios: Map<string, number>) {
  let bestId = '';
  let bestRatio = 0;
  HOME_RAIL_SECTIONS.forEach(({ id }) => {
    const ratio = sectionRatios.get(id) ?? 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = id;
    }
  });
  return bestId && bestRatio > 0 ? bestId : '';
}

export function useHomeSectionSpy() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [sectionProgress, setSectionProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(-1);
  const lastPastHeroRef = useRef<boolean | null>(null);
  const pastHeroRef = useRef(false);

  useEffect(() => {
    if (!isHome) {
      setPastHero(false);
      setActiveSection('');
      setSectionProgress(0);
      pastHeroRef.current = false;
      return;
    }

    const sectionRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (!pastHeroRef.current) return;

        entries.forEach((entry) => {
          sectionRatios.set(entry.target.id, entry.intersectionRatio);
        });

        const bestId = pickActiveSection(sectionRatios);
        if (bestId) {
          setActiveSection(bestId);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    HOME_RAIL_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const heroObserver = new IntersectionObserver(
      () => {
        const nextPastHero = computePastHero();
        pastHeroRef.current = nextPastHero;

        if (lastPastHeroRef.current !== nextPastHero) {
          lastPastHeroRef.current = nextPastHero;
          setPastHero(nextPastHero);
        }

        if (!nextPastHero) {
          setActiveSection('');
        }
      },
      { threshold: [0, 0.05, 0.15, 0.25, 0.5, 0.75, 1] }
    );

    const hero = document.getElementById('hero');
    if (hero) heroObserver.observe(hero);

    const updateScrollMetrics = () => {
      rafRef.current = null;

      const nextPastHero = computePastHero();
      pastHeroRef.current = nextPastHero;

      if (lastPastHeroRef.current !== nextPastHero) {
        lastPastHeroRef.current = nextPastHero;
        setPastHero(nextPastHero);
      }

      if (!nextPastHero) {
        setActiveSection('');
      } else {
        const bestId = pickActiveSection(sectionRatios);
        if (bestId) {
          setActiveSection(bestId);
        }
      }

      const progress = computeSectionProgress();
      if (Math.abs(lastProgressRef.current - progress) >= 0.005) {
        lastProgressRef.current = progress;
        setSectionProgress(progress);
      }
    };

    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(updateScrollMetrics);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isHome]);

  return {
    isHome,
    pastHero: isHome && pastHero,
    activeSection: isHome ? activeSection : '',
    sectionProgress: isHome ? sectionProgress : 0,
    sectionIds: HOME_SECTION_IDS,
  };
}
