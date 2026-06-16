'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight, Copy, Check, List } from 'lucide-react';
import type { TacticCategory, TacticMeta, TacticSubcategoryInfo } from '@/types/tactics';
import TacticsFloatingNav from '@/app/components/tactics/TacticsFloatingNav';

const categoryLabels: Record<TacticCategory, string> = {
  pentesting: 'Pentesting',
  hardening: 'Hardening',
  tools: 'Tools',
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TacticDetailClientProps {
  category: TacticCategory;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  subcategory?: string;
  htmlContent: string;
  prev: TacticMeta | null;
  next: TacticMeta | null;
  subcategories: TacticSubcategoryInfo[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all rounded"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function TacticDetailClient({
  category,
  slug,
  title,
  description,
  tags,
  subcategory,
  htmlContent,
  prev,
  next,
  subcategories,
}: TacticDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [tocOpen, setTocOpen] = useState(false);
  const [isNavPinned, setIsNavPinned] = useState(false);

  // Build TOC from rendered headings
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('h2, h3');
    const items: TocItem[] = [];
    headings.forEach((el) => {
      const id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
      el.id = id;
      items.push({
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });
    setToc(items);
  }, [htmlContent]);

  // Track active heading
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  // Add copy buttons to code blocks
  useEffect(() => {
    if (!contentRef.current) return;
    const codeBlocks = contentRef.current.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
      pre.style.position = 'relative';
      // We handle copy via React portal-style approach below
    });
  }, [htmlContent]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isNavPinned ? 'lg:pl-80' : 'lg:pl-12'}`}>
      <TacticsFloatingNav
        category={category}
        currentSlug={slug}
        subcategories={subcategories}
        onPinChange={setIsNavPinned}
      />
      {/* Header */}
      <section className="pt-28 sm:pt-32 pb-8 border-b-2 border-black dark:border-white/10">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-mono text-theme-muted mb-6 flex-wrap">
              <Link href="/tactics" className="hover:text-crimson transition-colors">
                Tactics
              </Link>
              <ChevronRight size={12} />
              <Link href={`/tactics/${category}`} className="hover:text-crimson transition-colors">
                {categoryLabels[category]}
              </Link>
              {subcategory && (
                <>
                  <ChevronRight size={12} />
                  <span className="capitalize">{subcategory.replace(/-/g, ' ')}</span>
                </>
              )}
              <ChevronRight size={12} />
              <span className="text-theme-primary font-semibold">{title}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-theme-primary mb-3">
              {title}
            </h1>

            {description && (
              <p className="text-theme-muted max-w-3xl text-sm sm:text-base mb-4">{description}</p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-black/15 dark:border-white/15 text-theme-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="py-10 sm:py-14">
        <div className="container-custom">
          <div className="flex gap-10">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <div
                ref={contentRef}
                className="mdx-content tactics-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Prev / Next Navigation */}
              <nav className="mt-14 pt-8 border-t-2 border-black/10 dark:border-white/10 grid grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/tactics/${category}/${prev.slug}`}
                    className="group p-4 border-2 border-black/10 dark:border-white/10 hover:border-crimson transition-all"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted flex items-center gap-1">
                      <ArrowLeft size={10} />
                      Previous
                    </span>
                    <span className="block font-syne font-bold text-theme-primary group-hover:text-crimson transition-colors mt-1 truncate">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/tactics/${category}/${next.slug}`}
                    className="group p-4 border-2 border-black/10 dark:border-white/10 hover:border-crimson transition-all text-right"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted flex items-center gap-1 justify-end">
                      Next
                      <ArrowRight size={10} />
                    </span>
                    <span className="block font-syne font-bold text-theme-primary group-hover:text-crimson transition-colors mt-1 truncate">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            </motion.article>

            {/* Desktop TOC */}
            {toc.length > 0 && (
              <aside className="hidden xl:block w-56 shrink-0">
                <div className="sticky top-24">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-theme-muted mb-3 font-bold">
                    On this page
                  </h4>
                  <nav className="space-y-1 border-l-2 border-black/10 dark:border-white/10">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`block text-xs transition-all py-0.5 ${
                          item.level === 3 ? 'pl-6' : 'pl-3'
                        } ${
                          activeId === item.id
                            ? 'text-crimson font-semibold border-l-2 border-crimson -ml-[2px]'
                            : 'text-theme-muted hover:text-theme-primary'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>

          {/* Mobile TOC Toggle */}
          {toc.length > 0 && (
            <div className="xl:hidden fixed bottom-6 right-6 z-30">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-12 h-12 bg-crimson text-white flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,0.3)] border-2 border-black dark:border-white/20 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all"
                aria-label="Table of contents"
              >
                <List size={20} />
              </button>

              {tocOpen && (
                <>
                  <div className="fixed inset-0 bg-black/40 z-[-1]" onClick={() => setTocOpen(false)} />
                  <div className="absolute bottom-14 right-0 w-64 max-h-80 overflow-y-auto bg-white dark:bg-[#0D0D0D] border-2 border-black dark:border-white/15 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] p-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-theme-muted mb-3 font-bold">
                      On this page
                    </h4>
                    <nav className="space-y-1.5">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setTocOpen(false);
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`block text-xs transition-all ${
                            item.level === 3 ? 'pl-4' : ''
                          } ${
                            activeId === item.id
                              ? 'text-crimson font-semibold'
                              : 'text-theme-muted hover:text-theme-primary'
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
