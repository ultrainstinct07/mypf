'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial state

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    const startPosition = window.scrollY;
    const duration = 600;
    let startTime: number | null = null;

    // Ease-out cubic for smooth deceleration
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - ease));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20 
          }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-20 sm:bottom-28 right-4 sm:right-6 z-50 group touch-manipulation"
          aria-label="Scroll to top"
        >
          {/* Button */}
          <motion.div
            className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none flex items-center justify-center shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.25)] hover:shadow-[5px_5px_0px_#D90429] dark:hover:shadow-[5px_5px_0px_#D90429] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all touch-manipulation"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ 
                repeat: isHovered ? Infinity : 0,
                repeatType: "reverse",
                duration: 0.4,
              }}
            >
              <ArrowUp 
                size={20} 
                className="text-black dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors duration-300" 
              />
            </motion.div>
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border-2 border-black dark:bg-dark-card dark:border-white rounded-none text-xs font-bold uppercase tracking-wider text-black dark:text-white whitespace-nowrap shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]"
              >
                Back to top
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

