'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, ArrowRight, X } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  keywords?: string[];
}

const commands: CommandItem[] = [
  { id: 'home', label: 'Go to Home', href: '/', keywords: ['home', 'main'] },
  { id: 'about', label: 'About Me', href: '/#about', keywords: ['about', 'bio'] },
  { id: 'expertise', label: 'Expertise', href: '/#expertise', keywords: ['skills', 'capabilities'] },
  { id: 'projects', label: 'Projects', href: '/#projects', keywords: ['work', 'portfolio'] },
  { id: 'all-projects', label: 'All Projects', href: '/projects', keywords: ['all', 'gallery'] },
  { id: 'faq', label: 'FAQ', href: '/#faq', keywords: ['questions', 'help'] },
  { id: 'contact', label: 'Contact', href: '/#contact', keywords: ['email', 'reach'] },
];

const fuseOptions: Fuse.IFuseOptions<CommandItem> = {
  keys: [
    { name: 'label', weight: 0.7 },
    { name: 'description', weight: 0.2 },
    { name: 'keywords', weight: 0.1 },
  ],
  threshold: 0.3,
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcut(['mod+k'], () => {
    setIsOpen(true);
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const fuse = new Fuse(commands, fuseOptions);
  const filteredCommands = query.trim()
    ? fuse.search(query).map((result) => result.item)
    : commands;

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  const handleSelect = (command: CommandItem) => {
    setIsOpen(false);
    if (command.href.startsWith('/#')) {
      const id = command.href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      router.push(command.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
      scrollToSelected();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      scrollToSelected();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  const scrollToSelected = () => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-50">
        <div className="bg-dark-lighter border border-white/10 rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-cyan transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Command List */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto py-2"
          >
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => handleSelect(command)}
                  className={`w-full px-4 py-3 text-left hover:bg-cyan/10 transition-colors flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-cyan/20 text-cyan'
                      : 'text-gray-300'
                  }`}
                >
                  <ArrowRight
                    size={16}
                    className={`transition-opacity ${
                      index === selectedIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    {command.description && (
                      <div className="text-sm text-gray-400">
                        {command.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-400">
                No commands found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 text-xs text-gray-400 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-2 py-1 bg-dark border border-white/10 rounded">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="px-2 py-1 bg-dark border border-white/10 rounded">
                  Enter
                </kbd>{' '}
                Select
              </span>
            </div>
            <span>
              <kbd className="px-2 py-1 bg-dark border border-white/10 rounded">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

