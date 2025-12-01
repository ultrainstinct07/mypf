'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScrollableHeight = documentHeight - windowHeight;
      const scrollProgress = totalScrollableHeight > 0 
        ? (scrollTop / totalScrollableHeight) * 100 
        : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-dark z-50">
      <div
        className="h-full bg-gradient-to-r from-cyan to-cyan-secondary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

