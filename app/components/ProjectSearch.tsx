'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  className?: string;
}

export default function ProjectSearch({
  value,
  onChange,
  placeholder = 'Search projects...',
  onFocus,
  className = '',
}: ProjectSearchProps) {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'recent-searches',
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchValue: string) => {
    onChange(searchValue);
    if (searchValue.trim() && !recentSearches.includes(searchValue.trim())) {
      setRecentSearches([searchValue.trim(), ...recentSearches].slice(0, 5));
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const filteredRecent = recentSearches.filter((search) =>
    search.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setShowSuggestions(true);
            onFocus?.();
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-crimson dark:focus:border-crimson shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)] transition-all font-bold uppercase tracking-wider text-xs"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-crimson transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showSuggestions && filteredRecent.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] overflow-hidden"
        >
          <div className="px-3 py-2 text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-black dark:border-white/10 font-bold">
            Recent Searches
          </div>
          {filteredRecent.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full px-4 py-2.5 text-left text-xs text-slate-700 dark:text-gray-300 hover:bg-crimson hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-wider min-h-[36px] touch-manipulation"
            >
              <Search size={14} className="text-slate-400 dark:text-gray-500" />
              {search}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

