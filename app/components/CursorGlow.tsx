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
      {/* Inner square pointer */}
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
          className="rounded-none bg-crimson"
          animate={{
            width: isHovering ? 10 : 6,
            height: isHovering ? 10 : 6,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }}
        />
      </motion.div>

      {/* Interactive square border */}
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
          className="rounded-none border-2 border-crimson"
          animate={{
            width: isHovering ? 36 : 22,
            height: isHovering ? 36 : 22,
            opacity: isVisible ? (isHovering ? 1 : 0.6) : 0,
            rotate: isHovering ? 45 : 0,
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

