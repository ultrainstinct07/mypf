'use client';

import { useEffect } from 'react';
import { usePreferences } from '../hooks/usePreferences';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, systemPrefersDark } = usePreferences();

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

  return <>{children}</>;
}

