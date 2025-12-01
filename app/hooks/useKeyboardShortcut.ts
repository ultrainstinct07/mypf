'use client';

import { useEffect } from 'react';

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrlOrCmd = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      const keyString = [
        ctrlOrCmd && 'mod',
        shift && 'shift',
        alt && 'alt',
        key,
      ]
        .filter(Boolean)
        .join('+');

      if (keys.includes(keyString)) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, enabled]);
}

