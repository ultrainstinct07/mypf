'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { preferences, updatePreferences, systemPrefersDark } = usePreferences();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark =
    preferences.theme === 'dark' ||
    (preferences.theme === 'system' && systemPrefersDark);

  const toggleTheme = () => {
    updatePreferences({ theme: isDark ? 'light' : 'dark' });
  };

  if (!mounted) {
    return (
      <div
        className="h-9 w-[4.5rem] shrink-0 rounded-none border-2 border-black/10 dark:border-white/10 bg-slate-100 dark:bg-dark-card"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Dark mode enabled. Switch to light mode.' : 'Light mode enabled. Switch to dark mode.'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="group relative h-9 w-[4.5rem] shrink-0 overflow-hidden rounded-none border-2 border-black bg-slate-100 shadow-[2px_2px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000000] dark:border-white/20 dark:bg-dark-card dark:shadow-[2px_2px_0px_rgba(255,255,255,0.12)] dark:hover:shadow-[3px_3px_0px_rgba(255,255,255,0.12)] touch-manipulation"
    >
      <span
        aria-hidden
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-4px)] border-2 border-black bg-crimson shadow-[1px_1px_0px_#000000] transition-transform duration-200 ease-out dark:border-white ${
          isDark ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
        }`}
      />

      <span className="relative z-10 grid h-full w-full grid-cols-2">
        <span className="flex items-center justify-center">
          <Sun
            size={15}
            strokeWidth={2.5}
            className={`transition-colors duration-200 ${
              !isDark
                ? 'text-white'
                : 'text-slate-500 group-hover:text-slate-700 dark:text-gray-500 dark:group-hover:text-gray-300'
            }`}
          />
        </span>
        <span className="flex items-center justify-center">
          <Moon
            size={15}
            strokeWidth={2.5}
            className={`transition-colors duration-200 ${
              isDark
                ? 'text-white'
                : 'text-slate-500 group-hover:text-slate-700 dark:text-gray-500 dark:group-hover:text-gray-300'
            }`}
          />
        </span>
      </span>
    </button>
  );
}
