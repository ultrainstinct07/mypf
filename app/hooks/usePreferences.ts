'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: Theme;
  reducedMotion: boolean;
  animationsEnabled: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  animationsEnabled: true,
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'user-preferences',
    defaultPreferences
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect system preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setSystemPrefersDark(mediaQuery.matches);
    setReducedMotion(motionQuery.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const effectiveTheme =
      preferences.theme === 'system'
        ? systemPrefersDark
          ? 'dark'
          : 'light'
        : preferences.theme;

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [preferences.theme, systemPrefersDark]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const effectiveReducedMotion =
    preferences.reducedMotion || reducedMotion;

  return {
    preferences,
    updatePreferences,
    systemPrefersDark,
    reducedMotion: effectiveReducedMotion,
    animationsEnabled: preferences.animationsEnabled && !effectiveReducedMotion,
  };
}

