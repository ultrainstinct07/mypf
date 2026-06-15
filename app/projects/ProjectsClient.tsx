'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ConfidentialEngagementsSection from '../components/ConfidentialEngagementsSection';
import ProjectSearch from '../components/ProjectSearch';
import ProjectFilter from '../components/ProjectFilter';
import { ArrowLeft, Lock, FolderOpen } from 'lucide-react';
import { searchProjects, filterProjects, getAllTags, getAllTechStack } from '@/lib/search';
import { trackEvent } from '@/lib/analytics';
import type { Project } from '@/types';
import type { SearchFilters } from '@/types';
import { CONFIDENTIAL_STATS } from '@/lib/confidential-engagements';

interface ProjectsClientProps {
  projects: Project[];
}

type ProjectView = 'public' | 'confidential';

export default function ProjectsClient({ projects: allProjects }: ProjectsClientProps) {
  const [activeView, setActiveView] = useState<ProjectView>('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) {
        trackEvent({ type: 'search', data: { query: searchQuery } });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Track filter changes
  useEffect(() => {
    if (filters.tags?.length || filters.techStack?.length) {
      trackEvent({ type: 'filter', data: filters });
    }
  }, [filters]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let results = allProjects;

    // Apply filters first
    if (filters.tags?.length || filters.techStack?.length) {
      results = filterProjects(results, filters);
    }

    // Then apply search
    if (debouncedQuery.trim()) {
      const searchResults = searchProjects(results, debouncedQuery);
      return searchResults.map((result) => result.item);
    }

    return results;
  }, [allProjects, filters, debouncedQuery]);

  const availableTags = useMemo(() => getAllTags(allProjects), [allProjects]);
  const availableTechStack = useMemo(
    () => getAllTechStack(allProjects),
    [allProjects]
  );

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <section className="relative overflow-hidden bg-white dark:bg-black border-b-2 border-black dark:border-white/10 transition-colors duration-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 dark:opacity-30" />
        
        <div className="container-custom relative z-10 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-crimson hover:text-crimson-secondary font-bold uppercase tracking-wider text-xs transition-colors mb-6 sm:mb-8 group min-h-[44px] touch-manipulation"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase mb-6 text-black dark:text-white">
            All <span className="text-crimson">Work</span>
          </h1>
          
          <p className="text-slate-700 dark:text-gray-300 text-lg sm:text-xl font-medium max-w-3xl">
            Open-source security tools and research alongside {CONFIDENTIAL_STATS.displayLabel}{' '}
            professional engagements delivered under client confidentiality agreements.
          </p>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-12 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-black/10 dark:border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-crimson">{allProjects.length}</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-450">Public Projects</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-crimson">{CONFIDENTIAL_STATS.displayLabel}</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-450">Confidential Engagements</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-crimson">NDA</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-450">Protected Scope</div>
            </div>
          </div>
        </div>
      </section>

      {/* View toggle */}
      <section className="py-6 bg-white dark:bg-black border-b-2 border-black dark:border-white/10">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveView('public')}
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-wider border-2 transition-all min-h-[44px] touch-manipulation ${
                activeView === 'public'
                  ? 'bg-crimson text-white border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]'
                  : 'bg-white dark:bg-dark-card text-black dark:text-white border-black dark:border-white/20 hover:border-crimson'
              }`}
            >
              <FolderOpen size={16} />
              Public Projects ({allProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView('confidential')}
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-wider border-2 border-dashed transition-all min-h-[44px] touch-manipulation ${
                activeView === 'confidential'
                  ? 'bg-crimson text-white border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]'
                  : 'bg-white dark:bg-dark-card text-black dark:text-white border-black dark:border-white/20 hover:border-crimson'
              }`}
            >
              <Lock size={16} />
              Confidential ({CONFIDENTIAL_STATS.displayLabel})
            </button>
          </div>
        </div>
      </section>

      {activeView === 'public' && (
        <>
      {/* Search and Filter Section */}
      <section className="py-8 bg-slate-50 dark:bg-dark-card border-b-2 border-black dark:border-white/10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <ProjectSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects by name, tags, or tech stack..."
              />
            </div>
            <ProjectFilter
              availableTags={availableTags}
              availableTechStack={availableTechStack}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Results count */}
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-550 dark:text-gray-400">
            Showing {filteredProjects.length} of {allProjects.length} projects
            {(searchQuery || filters.tags?.length || filters.techStack?.length) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="ml-2 text-crimson hover:text-crimson-secondary font-bold uppercase tracking-wider text-xs underline min-h-[44px] touch-manipulation"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredProjects.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  }
                }
              }}
            >
              <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.05,
                    }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-slate-500 dark:text-gray-400 text-base sm:text-lg mb-4 sm:mb-6">
                No projects found matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="btn-primary"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
        </>
      )}

      {activeView === 'confidential' && (
        <section className="section-padding">
          <div className="container-custom">
            <ConfidentialEngagementsSection />
          </div>
        </section>
      )}
    </main>
  );
}

