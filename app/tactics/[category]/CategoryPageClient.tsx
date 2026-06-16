'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Search, X } from 'lucide-react';
import type { TacticCategory, TacticSubcategoryInfo } from '@/types/tactics';

const categoryLabels: Record<TacticCategory, string> = {
  pentesting: 'Pentesting Tactics',
  hardening: 'Hardening Tactics',
  tools: 'Tool Tactics',
};

const categoryDescriptions: Record<TacticCategory, string> = {
  pentesting: 'Offensive security techniques covering web vulnerabilities and service/protocol exploitation.',
  hardening: 'Defense-focused guides for securing servers, services, and network infrastructure.',
  tools: 'Security tool references — purpose, features, common commands, and practical examples.',
};

const categoryAccentLine: Record<TacticCategory, string> = {
  pentesting: 'bg-crimson',
  hardening: 'bg-emerald-500',
  tools: 'bg-amber-500',
};

interface CategoryPageClientProps {
  category: TacticCategory;
  subcategories: TacticSubcategoryInfo[];
  totalCount: number;
}

export default function CategoryPageClient({ category, subcategories, totalCount }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-28 sm:pt-32 pb-10 border-b-2 border-black dark:border-white/10">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-mono text-theme-muted mb-6">
              <Link href="/tactics" className="hover:text-crimson transition-colors">
                Tactics
              </Link>
              <span>/</span>
              <span className="text-theme-primary font-semibold">{categoryLabels[category]}</span>
            </div>

            <div className={`w-12 h-1 mb-4 ${categoryAccentLine[category]}`} />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-theme-primary mb-3">
              {categoryLabels[category]}
            </h1>

            <p className="text-theme-muted max-w-2xl mb-8">
              {categoryDescriptions[category]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
                {totalCount} guides available
              </span>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={14} />
                <input
                  type="text"
                  id="category-search"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 bg-theme-secondary border-2 border-black/20 dark:border-white/10 text-theme-primary placeholder:text-theme-muted font-mono text-xs focus:outline-none focus:border-crimson transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-crimson"
                    aria-label="Clear"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14">
        <div className="container-custom">
          {filtered.length === 0 && searchQuery.trim() && (
            <p className="text-theme-muted font-mono text-sm">No matches for &ldquo;{searchQuery}&rdquo;</p>
          )}

          {filtered.map((sub, si) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: si * 0.05 }}
              className="mb-12"
            >
              {subcategories.length > 1 && (
                <h2 className="text-xl font-syne font-bold uppercase tracking-tight text-theme-primary mb-5 flex items-center gap-3">
                  <span className={`w-2 h-2 ${categoryAccentLine[category]}`} />
                  {sub.label}
                  <span className="text-xs font-mono font-normal text-theme-muted lowercase">
                    ({sub.items.length})
                  </span>
                </h2>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sub.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tactics/${category}/${item.slug}`}
                    className="group flex items-center justify-between p-4 border-2 border-black/10 dark:border-white/10 hover:border-crimson bg-theme-card transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(217,4,41,0.3)]"
                  >
                    <div className="min-w-0">
                      <h3 className="font-syne font-bold text-theme-primary group-hover:text-crimson transition-colors truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-theme-muted mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-theme-muted group-hover:text-crimson transition-colors ml-3 shrink-0" />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t-2 border-black/10 dark:border-white/10">
            <Link
              href="/tactics"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-theme-muted hover:text-crimson transition-colors"
            >
              <ArrowLeft size={14} />
              All Tactics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
