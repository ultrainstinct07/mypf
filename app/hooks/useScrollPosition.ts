'use client';

import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      
      setScrollPosition(currentScrollY);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    updateScrollPosition();

    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, [lastScrollY]);

  return { scrollPosition, scrollDirection };
}

