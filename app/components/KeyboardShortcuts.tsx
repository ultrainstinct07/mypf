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
        <div className="bg-dark-lighter border border-white/10 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Keyboard className="text-cyan" size={24} />
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-cyan transition-colors rounded-lg hover:bg-cyan/10"
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
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <span className="text-gray-300">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {formatKeys(shortcut.keys).map((key, keyIndex) => (
                    <span key={keyIndex}>
                      <kbd className="px-2.5 py-1.5 bg-dark border border-white/10 rounded text-xs font-mono text-cyan">
                        {key}
                      </kbd>
                      {keyIndex < formatKeys(shortcut.keys).length - 1 && (
                        <span className="mx-1 text-gray-500">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-dark text-center text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-dark-lighter border border-white/10 rounded">Esc</kbd> to close
          </div>
        </div>
      </div>
    </>
  );
}

