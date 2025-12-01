'use client';

import { useEffect, useState, useCallback } from 'react';

interface ParallaxOptions {
  speed?: number; // Multiplier for scroll effect (0.1 = slow, 1 = normal speed)
  direction?: 'up' | 'down'; // Direction of parallax movement
  disabled?: boolean; // Disable on mobile/reduced motion
}

interface ParallaxValue {
  y: number;
  opacity: number;
}

export function useParallax(options: ParallaxOptions = {}): ParallaxValue {
  const { speed = 0.3, direction = 'up', disabled = false } = options;
  const [parallaxValue, setParallaxValue] = useState<ParallaxValue>({ y: 0, opacity: 1 });

  const handleScroll = useCallback(() => {
    if (disabled) return;

    const scrollY = window.scrollY;
    const multiplier = direction === 'up' ? -1 : 1;
    const y = scrollY * speed * multiplier;
    
    // Calculate opacity based on scroll (fade out as user scrolls down)
    const maxScroll = window.innerHeight;
    const opacity = Math.max(0, 1 - (scrollY / maxScroll) * 0.5);

    setParallaxValue({ y, opacity });
  }, [speed, direction, disabled]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || disabled) {
      setParallaxValue({ y: 0, opacity: 1 });
      return;
    }

    // Check if mobile (disable parallax on small screens for performance)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setParallaxValue({ y: 0, opacity: 1 });
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, disabled]);

  return parallaxValue;
}

// Hook for multiple parallax layers
export function useMultiParallax(layers: ParallaxOptions[]): ParallaxValue[] {
  const [values, setValues] = useState<ParallaxValue[]>(
    layers.map(() => ({ y: 0, opacity: 1 }))
  );

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;

    const newValues = layers.map(({ speed = 0.3, direction = 'up', disabled = false }) => {
      if (disabled) return { y: 0, opacity: 1 };
      
      const multiplier = direction === 'up' ? -1 : 1;
      const y = scrollY * speed * multiplier;
      const opacity = Math.max(0, 1 - (scrollY / maxScroll) * 0.3);
      
      return { y, opacity };
    });

    setValues(newValues);
  }, [layers]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    if (prefersReducedMotion || isMobile) {
      setValues(layers.map(() => ({ y: 0, opacity: 1 })));
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, layers]);

  return values;
}

