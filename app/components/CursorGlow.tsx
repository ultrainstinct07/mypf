'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  // Use motion values for smoother animation
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Add spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Check if device is touch-based
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsTouch(hasTouch || isSmallScreen);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Track mouse position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  // Detect interactive element hovers
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') !== null ||
      target.closest('a') !== null ||
      target.closest('[role="button"]') !== null ||
      target.classList.contains('cursor-pointer') ||
      getComputedStyle(target).cursor === 'pointer';

    setIsHovering(isInteractive);
  }, []);

  // Hide cursor when leaving window
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouch, handleMouseMove, handleMouseOver, handleMouseLeave]);

  // Don't render on touch devices or if not visible
  if (isTouch) return null;

  return (
    <>
      {/* Main glow effect */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-multiply dark:mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Outer glow */}
        <motion.div
          className="rounded-full bg-cyan-600/20 dark:bg-cyan/10"
          animate={{
            width: isHovering ? 150 : 100,
            height: isHovering ? 150 : 100,
            opacity: isVisible ? (isHovering ? 0.4 : 0.2) : 0,
          }}
          transition={{
            width: { type: 'spring', stiffness: 300, damping: 25 },
            height: { type: 'spring', stiffness: 300, damping: 25 },
            opacity: { duration: 0.2 },
          }}
          style={{
            filter: 'blur(30px)',
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-cyan-600 dark:bg-cyan"
          animate={{
            width: isHovering ? 12 : 8,
            height: isHovering ? 12 : 8,
            opacity: isVisible ? 0.8 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }}
        />
      </motion.div>

      {/* Interactive ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2 border-cyan-600/50 dark:border-cyan/50"
          animate={{
            width: isHovering ? 40 : 24,
            height: isHovering ? 40 : 24,
            opacity: isVisible ? (isHovering ? 0.8 : 0.4) : 0,
            scale: isHovering ? 1.2 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      </motion.div>
    </>
  );
}

