'use client';

import { useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['mod+k'], description: 'Open command palette' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['esc'], description: 'Close modals/dialogs' },
  { keys: ['/'], description: 'Focus search (on projects page)' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcut(['?'], () => {
    setIsOpen(true);
  });

  useKeyboardShortcut(['escape'], () => {
    if (isOpen) setIsOpen(false);
  });

  if (!isOpen) return null;

  const formatKeys = (keys: string[]) => {
    return keys.map((key) => {
      if (key === 'mod') {
        return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
      }
      if (key === 'esc') return 'Esc';
      return key.toUpperCase();
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50">
        <div className="bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-black dark:border-white/10">
            <div className="flex items-center gap-3">
              <Keyboard className="text-crimson" size={24} />
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-black dark:text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-crimson transition-colors rounded-none hover:bg-crimson/10 border border-transparent hover:border-black dark:hover:border-white min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="p-6 space-y-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-black/10 dark:border-white/5 last:border-0"
              >
                <span className="text-slate-800 dark:text-gray-300 font-bold uppercase tracking-wide text-sm">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {formatKeys(shortcut.keys).map((key, keyIndex) => (
                    <span key={keyIndex} className="inline-flex items-center">
                      <kbd className="px-2.5 py-1.5 bg-slate-100 dark:bg-dark border-2 border-black dark:border-white/20 rounded-none text-xs font-mono text-crimson font-extrabold shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#ffffff]">
                        {key}
                      </kbd>
                      {keyIndex < formatKeys(shortcut.keys).length - 1 && (
                        <span className="mx-1 text-gray-500 font-bold">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-black dark:border-white/10 bg-slate-50 dark:bg-dark text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
            Press <kbd className="px-2 py-1 bg-white dark:bg-dark-lighter border-2 border-black dark:border-white/20 rounded-none text-crimson">Esc</kbd> to close
          </div>
        </div>
      </div>
    </>
  );
}

