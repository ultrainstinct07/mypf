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
          {/* Glow effect background */}
          <motion.div
            className="absolute inset-0 bg-cyan-600/30 dark:bg-cyan/30 rounded-full blur-xl"
            animate={{
              scale: isHovered ? 1.5 : 1,
              opacity: isHovered ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Button */}
          <motion.div
            className="relative w-12 h-12 sm:w-11 sm:h-11 bg-white border-2 border-cyan-600/50 dark:bg-dark-lighter dark:border-cyan/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg dark:shadow-none touch-manipulation"
            whileHover={{ 
              boxShadow: '0 0 30px rgba(8, 145, 178, 0.5)',
            }}
            whileTap={{ scale: 0.9 }}
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
                className="text-cyan-600 group-hover:text-cyan-700 dark:text-cyan dark:group-hover:text-white transition-colors duration-300" 
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
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-cyan-600/30 dark:bg-dark-lighter dark:border-cyan/30 rounded-lg text-sm text-cyan-600 dark:text-cyan whitespace-nowrap shadow-md dark:shadow-none"
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

