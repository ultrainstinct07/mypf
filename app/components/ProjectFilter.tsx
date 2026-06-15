'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { SearchFilters } from '@/types';

interface ProjectFilterProps {
  availableTags: string[];
  availableTechStack: string[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export default function ProjectFilter({
  availableTags,
  availableTechStack,
  filters,
  onFiltersChange,
  className = '',
}: ProjectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeTagCount = (filters.tags || []).length;
  const activeTechCount = (filters.techStack || []).length;
  const totalActive = activeTagCount + activeTechCount;

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const toggleTech = (tech: string) => {
    const currentTech = filters.techStack || [];
    const newTech = currentTech.includes(tech)
      ? currentTech.filter((t) => t !== tech)
      : [...currentTech, tech];
    onFiltersChange({ ...filters, techStack: newTech });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none hover:border-crimson dark:hover:border-crimson transition-all text-slate-900 dark:text-white font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)] min-h-[44px] touch-manipulation"
      >
        <Filter size={16} />
        <span>Filter</span>
        {totalActive > 0 && (
          <span className="px-2 py-0.5 bg-crimson text-white text-[10px] font-extrabold rounded-none border border-black dark:border-white/20">
            {totalActive}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-80 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold uppercase text-sm text-slate-900 dark:text-white">Filters</h3>
              {totalActive > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold uppercase tracking-wider text-crimson hover:text-crimson-secondary flex items-center gap-1 min-h-[36px] touch-manipulation"
                >
                  <X size={14} />
                  Clear all
                </button>
              )}
            </div>

            {/* Tags Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => {
                  const isActive = filters.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all border-2 min-h-[36px] touch-manipulation ${
                        isActive
                          ? 'bg-crimson text-white border-black dark:border-white shadow-[1px_1px_0px_#000000]'
                          : 'bg-slate-100 dark:bg-dark border-black/10 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-crimson dark:hover:border-crimson'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2 block">
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTechStack.map((tech) => {
                  const isActive = filters.techStack?.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all border-2 min-h-[36px] touch-manipulation ${
                        isActive
                          ? 'bg-crimson text-white border-black dark:border-white shadow-[1px_1px_0px_#000000]'
                          : 'bg-slate-100 dark:bg-dark border-black/10 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-crimson dark:hover:border-crimson'
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

