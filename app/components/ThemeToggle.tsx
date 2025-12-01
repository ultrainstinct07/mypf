'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { usePreferences, type Theme } from '../hooks/usePreferences';

export default function ThemeToggle() {
  const { preferences, updatePreferences } = usePreferences();

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const currentTheme = themes.find((t) => t.value === preferences.theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  const handleClick = () => {
    const currentIndex = themes.findIndex((t) => t.value === preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updatePreferences({ theme: themes[nextIndex].value });
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg border transition-all group bg-slate-100 border-slate-200 hover:border-cyan-600/50 hover:bg-cyan-600/10 dark:bg-dark-lighter dark:border-white/5 dark:hover:border-cyan/50 dark:hover:bg-cyan/10"
      aria-label={`Switch theme. Current: ${currentTheme.label}`}
      title={`Current: ${currentTheme.label}. Click to switch.`}
    >
      <CurrentIcon
        size={18}
        className="text-slate-600 group-hover:text-cyan-600 dark:text-gray-300 dark:group-hover:text-cyan transition-colors"
      />
    </button>
  );
}

