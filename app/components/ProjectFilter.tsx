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
        className="inline-flex items-center gap-2 px-4 py-2 bg-dark-lighter border border-white/5 rounded-lg hover:border-cyan/50 transition-all"
      >
        <Filter size={18} />
        <span>Filter</span>
        {totalActive > 0 && (
          <span className="px-2 py-0.5 bg-cyan text-dark text-xs font-semibold rounded-full">
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
          <div className="absolute z-50 mt-2 w-80 bg-dark-lighter border border-white/10 rounded-lg shadow-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Filters</h3>
              {totalActive > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-cyan hover:text-cyan-secondary flex items-center gap-1"
                >
                  <X size={14} />
                  Clear all
                </button>
              )}
            </div>

            {/* Tags Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => {
                  const isActive = filters.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan text-dark border border-cyan'
                          : 'bg-dark border border-white/5 text-gray-300 hover:border-cyan/50'
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
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTechStack.map((tech) => {
                  const isActive = filters.techStack?.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan text-dark border border-cyan'
                          : 'bg-dark border border-white/5 text-gray-300 hover:border-cyan/50'
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

