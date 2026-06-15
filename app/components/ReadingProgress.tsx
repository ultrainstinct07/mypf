'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
  showReadingTime?: boolean;
  wordsPerMinute?: number;
}

export default function ReadingProgress({
  targetRef,
  showReadingTime = true,
  wordsPerMinute = 200,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Calculate reading time from content
    if (showReadingTime) {
      const content = targetRef?.current || document.querySelector('article, .mdx-content');
      if (content) {
        const text = content.textContent || '';
        const wordCount = text.trim().split(/\s+/).length;
        const estimatedTime = Math.ceil(wordCount / wordsPerMinute);
        setReadingTime(estimatedTime);
        setTimeRemaining(estimatedTime);
      }
    }
  }, [targetRef, showReadingTime, wordsPerMinute]);

  useEffect(() => {
    const handleScroll = () => {
      // Get content element bounds
      const content = targetRef?.current || document.querySelector('article, .mdx-content');
      
      if (!content) {
        // Fallback to document progress
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const totalScrollable = documentHeight - windowHeight;
        const scrollProgress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;
        setProgress(Math.min(100, scrollProgress));
        setIsVisible(scrollTop > 100);
        return;
      }

      const contentRect = content.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the content has been scrolled past
      const contentTop = contentRect.top + window.scrollY;
      const contentBottom = contentTop + contentRect.height;
      const scrollTop = window.scrollY + windowHeight * 0.3; // Offset for reading position
      
      // Only show progress when in the content area
      const hasStartedReading = scrollTop > contentTop;
      const contentProgress = hasStartedReading 
        ? Math.min(100, ((scrollTop - contentTop) / (contentRect.height)) * 100)
        : 0;

      setProgress(contentProgress);
      setIsVisible(hasStartedReading && contentProgress < 100);

      // Update time remaining
      if (readingTime > 0) {
        const remaining = Math.ceil(readingTime * (1 - contentProgress / 100));
        setTimeRemaining(remaining);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef, readingTime]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-14 sm:top-16 left-0 right-0 z-30"
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-200 dark:bg-dark border-b-2 border-black dark:border-white/10">
            <motion.div
              className="h-full bg-crimson"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>

          {/* Reading time indicator */}
          {showReadingTime && readingTime > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-4 top-3 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-gray-300 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]"
            >
              <Clock size={12} className="text-crimson" />
              <span>
                {timeRemaining > 0 
                  ? `${timeRemaining} min left`
                  : 'Almost done!'
                }
              </span>
              <span className="text-crimson font-extrabold ml-1">
                {Math.round(progress)}%
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

