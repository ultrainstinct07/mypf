'use client';

import { useEffect, useState } from 'react';

function getBoldScrollMotionEnabled() {
  if (typeof window === 'undefined') return false;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.innerWidth < 768;
  return !reduced && !mobile;
}

export function useBoldScrollMotion() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(getBoldScrollMotionEnabled());
    update();

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedQuery.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      reducedQuery.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return enabled;
}
