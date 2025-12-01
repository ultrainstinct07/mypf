'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-dark to-dark-lighter border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="container-custom relative z-10 py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan hover:text-cyan-secondary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            All <span className="text-gradient-cyan">Projects</span>
          </h1>
          
          <p className="text-gray-300 text-xl max-w-3xl">
            A comprehensive collection of my security research, automation tools, and AI-powered solutions.
          </p>

          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-cyan">{allProjects.length}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan">Security</div>
              <div className="text-sm text-gray-400">Primary Focus</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan">AI/ML</div>
              <div className="text-sm text-gray-400">Integration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="section-padding border-b border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <div className="text-sm text-gray-400">
            Showing {filteredProjects.length} of {allProjects.length} projects
            {(searchQuery || filters.tags?.length || filters.techStack?.length) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="ml-2 text-cyan hover:text-cyan-secondary underline"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-6">
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

