'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, X, Pin, Crosshair, Shield, Terminal, ChevronRight, Menu } from 'lucide-react';
import type { TacticCategory, TacticSubcategoryInfo } from '@/types/tactics';

interface TacticsFloatingNavProps {
  category: TacticCategory;
  currentSlug: string;
  subcategories: TacticSubcategoryInfo[];
  onPinChange?: (pinned: boolean) => void;
}

const categoryColors: Record<TacticCategory, { accent: string; text: string; bg: string; hoverBg: string; border: string }> = {
  pentesting: {
    accent: 'crimson',
    text: 'text-crimson',
    bg: 'bg-crimson',
    hoverBg: 'hover:bg-crimson/10',
    border: 'border-crimson',
  },
  hardening: {
    accent: '#10b981',
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    hoverBg: 'hover:bg-emerald-500/10',
    border: 'border-emerald-500',
  },
  tools: {
    accent: '#f59e0b',
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    hoverBg: 'hover:bg-amber-500/10',
    border: 'border-amber-500',
  },
};

const categoryIcons: Record<TacticCategory, React.ElementType> = {
  pentesting: Crosshair,
  hardening: Shield,
  tools: Terminal,
};

export default function TacticsFloatingNav({
  category,
  currentSlug,
  subcategories,
  onPinChange,
}: TacticsFloatingNavProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const colors = categoryColors[category];
  const CategoryIcon = categoryIcons[category];

  // Save/load pin preference from local storage
  useEffect(() => {
    const saved = localStorage.getItem(`tactics-nav-pinned-${category}`);
    if (saved === 'false') {
      const handle = requestAnimationFrame(() => {
        setIsPinned(false);
        setIsOpen(false);
        onPinChange?.(false);
      });
      return () => cancelAnimationFrame(handle);
    } else {
      const handle = requestAnimationFrame(() => {
        setIsPinned(true);
        setIsOpen(true);
        onPinChange?.(true);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [category, onPinChange]);

  // Handle keyboard shortcuts (e.g. '/' or Ctrl+K to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem(`tactics-nav-pinned-${category}`, String(newPinned));
    onPinChange?.(newPinned);
  };

  // Filter tactics based on search
  const filteredSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return subcategories;
    const q = searchQuery.toLowerCase();
    return subcategories
      .map((sub) => ({
        ...sub,
        items: sub.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.tags.some((tag) => tag.toLowerCase().includes(q))
        ),
      }))
      .filter((sub) => sub.items.length > 0);
  }, [searchQuery, subcategories]);

  // Auto-close on route changes on mobile
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMobileOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [currentSlug]);

  return (
    <>
      {/* Desktop Navigation */}
      <div 
        className="hidden lg:block relative z-40"
        onMouseEnter={() => !isPinned && setIsOpen(true)}
        onMouseLeave={() => !isPinned && setIsOpen(false)}
      >
        {/* Minimized strip */}
        <div 
          className={`fixed left-0 top-20 bottom-0 w-12 bg-theme-secondary border-r-2 border-black dark:border-white/10 flex flex-col items-center py-6 space-y-6 transition-all duration-300 ${
            isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className={`p-2 bg-theme-card border-2 border-black dark:border-white/15 ${colors.text}`}>
            <CategoryIcon size={18} />
          </div>
          <div className="h-full flex flex-col justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-theme-muted writing-vertical select-none cursor-default">
              {category} services
            </span>
          </div>
        </div>

        {/* Expanded Navigation Drawer */}
        <div
          ref={panelRef}
          className={`fixed left-0 top-20 bottom-0 bg-theme-card border-r-2 border-black dark:border-white/10 flex flex-col transition-all duration-300 shadow-[5px_0px_20px_rgba(0,0,0,0.15)] dark:shadow-[5px_0px_20px_rgba(0,0,0,0.4)] ${
            isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full pointer-events-none'
          }`}
          style={{ height: 'calc(100vh - 5rem)' }}
        >
          {/* Header */}
          <div className="p-4 border-b-2 border-black dark:border-white/10 flex items-center justify-between bg-theme-secondary">
            <div className="flex items-center gap-2">
              <CategoryIcon size={16} className={colors.text} />
              <span className="font-syne font-extrabold uppercase text-sm tracking-tight text-theme-primary">
                {category} KB
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={togglePin}
                className={`p-1.5 border border-transparent hover:border-black/15 dark:hover:border-white/15 hover:bg-theme-secondary transition-all ${
                  isPinned ? colors.text : 'text-theme-muted'
                }`}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                <Pin size={14} className={isPinned ? 'rotate-45' : ''} />
              </button>
              {!isPinned && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-transparent hover:border-black/15 dark:hover:border-white/15 hover:bg-theme-secondary text-theme-muted hover:text-theme-primary transition-all"
                  title="Close sidebar"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-black/10 dark:border-white/10 bg-theme-secondary/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={14} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Quick search... (Press '/')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-theme-card border-2 border-black/20 dark:border-white/10 text-theme-primary placeholder:text-theme-muted font-mono text-xs focus:outline-none focus:border-black dark:focus:border-white/30 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
            {filteredSubcategories.length === 0 ? (
              <p className="text-xs font-mono text-theme-muted text-center py-4">No services match search.</p>
            ) : (
              filteredSubcategories.map((sub) => (
                <div key={sub.id} className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-theme-muted border-b border-black/5 dark:border-white/5 pb-1">
                    {sub.label}
                  </h4>
                  <ul className="space-y-1">
                    {sub.items.map((item) => {
                      const isActive = item.slug === currentSlug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/tactics/${category}/${item.slug}`}
                            className={`group flex items-center justify-between px-2.5 py-1.5 border text-xs transition-all ${
                              isActive
                                ? `bg-theme-secondary ${colors.border} ${colors.text} font-bold`
                                : 'border-transparent text-theme-muted hover:text-theme-primary hover:bg-theme-secondary/60'
                            }`}
                          >
                            <span className="truncate pr-2">{item.title}</span>
                            {isActive ? (
                              <span className="w-1.5 h-1.5 bg-current rounded-full" />
                            ) : (
                              <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button and Drawer */}
      <div className="lg:hidden">
        {/* Floating action button on mobile bottom-left */}
        <div className="fixed bottom-6 left-6 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className={`w-12 h-12 text-white flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,0.3)] border-2 border-black dark:border-white/20 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all ${
              category === 'pentesting' ? 'bg-crimson' : category === 'hardening' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            aria-label="Toggle navigation drawer"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Slide-in Drawer overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-theme-card border-r-2 border-black dark:border-white/10 z-50 flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b-2 border-black dark:border-white/10 flex items-center justify-between bg-theme-secondary">
                  <div className="flex items-center gap-2">
                    <CategoryIcon size={16} className={colors.text} />
                    <span className="font-syne font-extrabold uppercase text-sm tracking-tight text-theme-primary">
                      {category} KB
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 border border-transparent hover:border-black/15 dark:hover:border-white/15 hover:bg-theme-secondary text-theme-muted hover:text-theme-primary transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-black/10 dark:border-white/10 bg-theme-secondary/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={14} />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-theme-card border-2 border-black/20 dark:border-white/10 text-theme-primary placeholder:text-theme-muted font-mono text-xs focus:outline-none focus:border-black dark:focus:border-white/30 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {filteredSubcategories.length === 0 ? (
                    <p className="text-xs font-mono text-theme-muted text-center py-4">No services match search.</p>
                  ) : (
                    filteredSubcategories.map((sub) => (
                      <div key={sub.id} className="space-y-2">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-theme-muted border-b border-black/5 dark:border-white/5 pb-1">
                          {sub.label}
                        </h4>
                        <ul className="space-y-1">
                          {sub.items.map((item) => {
                            const isActive = item.slug === currentSlug;
                            return (
                              <li key={item.slug}>
                                <Link
                                  href={`/tactics/${category}/${item.slug}`}
                                  className={`flex items-center justify-between px-2.5 py-2 border text-xs transition-all ${
                                    isActive
                                      ? `bg-theme-secondary ${colors.border} ${colors.text} font-bold`
                                      : 'border-transparent text-theme-muted hover:text-theme-primary hover:bg-theme-secondary/60'
                                  }`}
                                >
                                  <span className="truncate pr-2">{item.title}</span>
                                  {isActive && <span className="w-1.5 h-1.5 bg-current rounded-full" />}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
