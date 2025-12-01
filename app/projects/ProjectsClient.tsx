'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ProjectSearch from '../components/ProjectSearch';
import ProjectFilter from '../components/ProjectFilter';
import { ArrowLeft } from 'lucide-react';
import { searchProjects, filterProjects, getAllTags, getAllTechStack } from '@/lib/search';
import { trackEvent } from '@/lib/analytics';
import type { Project } from '@/types';
import type { SearchFilters } from '@/types';

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects: allProjects }: ProjectsClientProps) {
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
    <main className="min-h-screen bg-slate-50 dark:bg-dark transition-colors duration-300">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-dark dark:via-dark dark:to-dark-lighter border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 dark:opacity-20" />
        
        <div className="container-custom relative z-10 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan hover:text-sky-600 dark:hover:text-cyan-secondary transition-colors mb-6 sm:mb-8 group min-h-[44px] touch-manipulation"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-slate-900 dark:text-white">
            All <span className="text-gradient-cyan">Projects</span>
          </h1>
          
          <p className="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-3xl">
            A comprehensive collection of my security research, automation tools, and AI-powered solutions.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200 dark:border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan">{allProjects.length}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan">Security</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Primary Focus</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan">AI/ML</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Integration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="section-padding border-b border-slate-200 dark:border-white/5">
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
          <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
            Showing {filteredProjects.length} of {allProjects.length} projects
            {(searchQuery || filters.tags?.length || filters.techStack?.length) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="ml-2 text-cyan-600 dark:text-cyan hover:text-sky-600 dark:hover:text-cyan-secondary underline min-h-[44px] touch-manipulation"
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
    </main>
  );
}

