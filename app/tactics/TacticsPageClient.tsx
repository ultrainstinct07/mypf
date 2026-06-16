'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Crosshair, Shield, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { TacticCategoryInfo, TacticMeta } from '@/types/tactics';

const categoryIcons: Record<string, React.ElementType> = {
  crosshair: Crosshair,
  shield: Shield,
  terminal: Terminal,
};

const categoryAccentClasses: Record<string, string> = {
  pentesting: 'border-crimson hover:shadow-[5px_5px_0px_rgba(217,4,41,0.4)]',
  hardening: 'border-emerald-500 hover:shadow-[5px_5px_0px_rgba(16,185,129,0.4)]',
  tools: 'border-amber-500 hover:shadow-[5px_5px_0px_rgba(245,158,11,0.4)]',
};

const categoryIconBg: Record<string, string> = {
  pentesting: 'bg-crimson/10 text-crimson',
  hardening: 'bg-emerald-500/10 text-emerald-500',
  tools: 'bg-amber-500/10 text-amber-500',
};

interface TacticsPageClientProps {
  categories: TacticCategoryInfo[];
  allTactics: TacticMeta[];
}

export default function TacticsPageClient({ categories, allTactics }: TacticsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTactics = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allTactics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery, allTactics]);

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 border-b-2 border-black dark:border-white/10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-crimson text-white border border-black dark:border-white/20">
                Knowledge Base
              </span>
              <span className="text-sm font-mono text-theme-muted">
                {totalCount} tactics
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-syne font-extrabold uppercase tracking-tight mb-4">
              <span className="text-theme-primary">Security</span>{' '}
              <span className="text-crimson">Tactics</span>
            </h1>

            <p className="text-lg sm:text-xl text-theme-muted max-w-2xl mb-10 leading-relaxed">
              Curated reference guides for penetration testing, system hardening, and security tooling — built from real-world engagements.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
              <input
                type="text"
                id="tactics-search"
                placeholder="Search tactics, tools, techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-theme-secondary border-2 border-black dark:border-white/15 text-theme-primary placeholder:text-theme-muted font-mono text-sm focus:outline-none focus:border-crimson transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted hover:text-crimson transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery.trim() && (
        <section className="py-8 border-b-2 border-black dark:border-white/10">
          <div className="container-custom">
            <p className="text-sm font-mono text-theme-muted mb-4">
              {filteredTactics.length} result{filteredTactics.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
            {filteredTactics.length > 0 ? (
              <div className="grid gap-2">
                {filteredTactics.map((tactic) => (
                  <Link
                    key={`${tactic.category}-${tactic.slug}`}
                    href={`/tactics/${tactic.category}/${tactic.slug}`}
                    className="flex items-center justify-between p-4 border-2 border-black/10 dark:border-white/10 hover:border-crimson transition-all group bg-theme-card"
                  >
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-theme-muted">
                        {tactic.category}
                        {tactic.subcategory && ` / ${tactic.subcategory.replace(/-/g, ' ')}`}
                      </span>
                      <h3 className="font-syne font-bold text-theme-primary group-hover:text-crimson transition-colors">
                        {tactic.title}
                      </h3>
                    </div>
                    <ArrowRight size={16} className="text-theme-muted group-hover:text-crimson transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-theme-muted">No tactics match your search.</p>
            )}
          </div>
        </section>
      )}

      {/* Category Cards */}
      {!searchQuery.trim() && (
        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((cat, i) => {
                const Icon = categoryIcons[cat.icon] || Terminal;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Link
                      href={cat.href}
                      className={`block p-6 sm:p-8 border-2 border-black dark:border-white/15 bg-theme-card shadow-[3px_3px_0px_rgba(0,0,0,0.15)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.05)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 group ${categoryAccentClasses[cat.id]}`}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 mb-5 ${categoryIconBg[cat.id]}`}>
                        <Icon size={24} />
                      </div>

                      <h2 className="text-2xl font-syne font-extrabold uppercase tracking-tight text-theme-primary mb-2">
                        {cat.label}
                      </h2>

                      <p className="text-theme-muted text-sm leading-relaxed mb-6">
                        {cat.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-theme-muted">
                          {cat.count} {cat.count === 1 ? 'guide' : 'guides'}
                        </span>
                        <ArrowRight
                          size={18}
                          className="text-theme-muted group-hover:text-crimson group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
