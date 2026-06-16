'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { Search, ArrowRight, X } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useCtfOptional } from './CtfProvider';

import type { TacticMeta } from '@/types/tactics';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  keywords?: string[];
  action?: 'open-terminal';
  category?: string;
}

const baseCommands: CommandItem[] = [
  { id: 'home', label: 'Go to Home', href: '/', keywords: ['home', 'main'] },
  { id: 'about', label: 'About Me', href: '/#about', keywords: ['about', 'bio'] },
  { id: 'expertise', label: 'Expertise', href: '/#expertise', keywords: ['skills', 'capabilities'] },
  { id: 'projects', label: 'Projects', href: '/projects', keywords: ['work', 'portfolio', 'all', 'gallery'] },
  { id: 'tactics', label: 'Security Tactics', href: '/tactics', keywords: ['pentesting', 'hardening', 'tools', 'security', 'commands', 'cheat sheets'] },
  {
    id: 'ad-void',
    label: 'AD-Void Cheat Sheet',
    description: 'Active Directory attack notes & scenarios',
    href: 'https://ad-void.void999.space/',
    keywords: ['active directory', 'ad', 'red team', 'kerberos', 'bloodhound', 'cheat sheet', 'blog'],
  },
  { id: 'faq', label: 'FAQ', href: '/#faq', keywords: ['questions', 'help'] },
  { id: 'contact', label: 'Contact', href: '/#contact', keywords: ['email', 'reach'] },
];

const fuseOptions: IFuseOptions<CommandItem> = {
  keys: [
    { name: 'label', weight: 0.7 },
    { name: 'description', weight: 0.2 },
    { name: 'keywords', weight: 0.1 },
  ],
  threshold: 0.3,
};

interface CommandPaletteProps {
  tactics: TacticMeta[];
}

export default function CommandPalette({ tactics }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const ctf = useCtfOptional();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo(() => {
    const tacticsList = (tactics || []).map((t) => ({
      id: `tactic-${t.category}-${t.slug}`,
      label: t.title,
      description: `${t.category.charAt(0).toUpperCase() + t.category.slice(1)} Tactic — ${t.description}`,
      href: `/tactics/${t.category}/${t.slug}`,
      keywords: [t.category, t.subcategory || '', ...t.tags],
      category: t.category,
    }));

    const base = [...baseCommands, ...tacticsList];
    if (!ctf?.progress.voidDiscovered) return base;
    return [
      ...base,
      {
        id: 'void-terminal',
        label: 'Open VOID Terminal',
        description: 'Operation VOID999 infiltration shell',
        href: '#terminal',
        keywords: ['void', 'ctf', 'terminal', 'flag', 'hack'],
        action: 'open-terminal' as const,
      },
    ];
  }, [tactics, ctf?.progress.voidDiscovered]);

  useKeyboardShortcut(['mod+k'], () => {
    setIsOpen(true);
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const fuse = useMemo(() => new Fuse(commands, fuseOptions), [commands]);
  const filteredCommands = query.trim()
    ? fuse.search(query).map((result) => result.item)
    : commands;


  const handleSelect = (command: CommandItem) => {
    setIsOpen(false);
    if (command.action === 'open-terminal') {
      ctf?.openTerminal();
      return;
    }
    if (command.href.startsWith('http://') || command.href.startsWith('https://')) {
      window.open(command.href, '_blank', 'noopener,noreferrer');
      return;
    }
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
        <div className="bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black dark:border-white/10 bg-slate-50 dark:bg-black">
            <Search className="text-slate-500 dark:text-gray-400" size={20} />
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
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-gray-500 outline-none font-bold uppercase tracking-wide text-sm"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-500 dark:text-gray-405 hover:text-crimson transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Command List */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto py-2 bg-white dark:bg-dark-card"
          >
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => handleSelect(command)}
                  className={`w-full px-4 py-3 text-left hover:bg-crimson/10 transition-colors flex items-center gap-3 border-l-4 min-h-[44px] touch-manipulation ${
                    index === selectedIndex
                      ? 'bg-crimson text-white border-crimson'
                      : 'text-slate-700 dark:text-gray-300 border-transparent'
                  }`}
                >
                  <ArrowRight
                    size={16}
                    className={`transition-opacity ${
                      index === selectedIndex ? 'opacity-100 text-white' : 'opacity-0 text-crimson'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-extrabold uppercase tracking-wide text-sm">{command.label}</div>
                    {command.description && (
                      <div className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${
                        index === selectedIndex ? 'text-white/80' : 'text-slate-500 dark:text-gray-400'
                      }`}>
                        {command.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">
                No commands found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t-2 border-black dark:border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center justify-between bg-slate-50 dark:bg-black">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark border-2 border-black dark:border-white/20 rounded-none text-crimson font-extrabold">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark border-2 border-black dark:border-white/20 rounded-none text-crimson font-extrabold">
                  Enter
                </kbd>{' '}
                Select
              </span>
            </div>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark border-2 border-black dark:border-white/20 rounded-none text-crimson font-extrabold">
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

