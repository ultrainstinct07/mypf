'use client';

import { useEffect, useMemo, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { useParticleCloud } from './ParticleCloudProvider';
import { useParticleCloudEnabled } from '@/app/hooks/useParticleCloudEnabled';

const FADE_OUT_DISTANCE = 400;

export default function PostHeroParticleBackground() {
  const { setAmbientEnabled, setAmbientOpacity, setAmbientCamera, showSplash } =
    useParticleCloud();
  const webglEnabled = useParticleCloudEnabled();
  const [viewportHeight, setViewportHeight] = useState(800);
  const [contactTop, setContactTop] = useState(8000);
  const [projectsTop, setProjectsTop] = useState(4000);
  const [isDark, setIsDark] = useState(true);

  const { scrollY } = useScroll();

  const fadeStart = viewportHeight * 0.75;
  const fadeEnd = viewportHeight * 1.1;
  const fadeOutEnd = contactTop;
  const fadeOutStart = Math.max(fadeEnd + 50, contactTop - FADE_OUT_DISTANCE);
  const midContentScroll = Math.max(fadeEnd + 100, projectsTop);

  const darkPeak = 0.42;
  const lightPeak = 0.42;

  const darkOpacity = useTransform(
    scrollY,
    [0, fadeStart, fadeEnd, fadeOutStart, fadeOutEnd],
    [0, 0, darkPeak, darkPeak, 0]
  );
  const lightOpacity = useTransform(
    scrollY,
    [0, fadeStart, fadeEnd, fadeOutStart, fadeOutEnd],
    [0, 0, lightPeak, lightPeak, 0]
  );
  const scrollOpacity = isDark ? darkOpacity : lightOpacity;

  const scrollZoom = useTransform(
    scrollY,
    [fadeStart, fadeEnd, midContentScroll, fadeOutStart, fadeOutEnd],
    [600, 520, 460, 400, 600]
  );

  const scrollOrbitX = useTransform(
    scrollY,
    [fadeStart, fadeEnd, midContentScroll, fadeOutStart, fadeOutEnd],
    [0, 0.08, 0.18, 0.12, 0]
  );

  const scrollOrbitY = useTransform(
    scrollY,
    [fadeStart, fadeEnd, midContentScroll, fadeOutStart, fadeOutEnd],
    [0, 0.35, 1.1, 1.85, 0]
  );

  const ambientCamera = useMemo(
    () => ({
      zoom: scrollZoom,
      orbitX: scrollOrbitX,
      orbitY: scrollOrbitY,
    }),
    [scrollZoom, scrollOrbitX, scrollOrbitY]
  );

  useEffect(() => {
    setAmbientEnabled(true);
    return () => setAmbientEnabled(false);
  }, [setAmbientEnabled]);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight, { passive: true });
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const measureSections = () => {
      const contact = document.getElementById('contact');
      const projects = document.getElementById('projects');
      setContactTop(contact?.offsetTop ?? document.documentElement.scrollHeight);
      setProjectsTop(projects?.offsetTop ?? viewportHeight * 2.5);
    };

    measureSections();
    window.addEventListener('resize', measureSections, { passive: true });
    const timer = window.setTimeout(measureSections, 500);

    return () => {
      window.removeEventListener('resize', measureSections);
      clearTimeout(timer);
    };
  }, [viewportHeight]);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!webglEnabled || showSplash) {
      setAmbientOpacity(null);
      setAmbientCamera(null);
      return;
    }

    setAmbientOpacity(scrollOpacity);
    setAmbientCamera(ambientCamera);

    return () => {
      setAmbientOpacity(null);
      setAmbientCamera(null);
    };
  }, [
    webglEnabled,
    showSplash,
    scrollOpacity,
    ambientCamera,
    setAmbientOpacity,
    setAmbientCamera,
  ]);

  return null;
}
