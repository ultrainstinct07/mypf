'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementPageView, getPageViewCount } from '@/lib/analytics';

interface VisitorCounterProps {
  className?: string;
  showIcon?: boolean;
}

export default function VisitorCounter({
  className = '',
  showIcon = true,
}: VisitorCounterProps) {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const newCount = incrementPageView();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(newCount);
  }, []);

  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next === 7) {
      console.info(
        '%c[void999]%c terminal uplink: Ctrl+Shift+` (after /void discovery)',
        'color:#D90429;font-weight:bold',
        'color:inherit'
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      aria-label={`${count.toLocaleString()} page views`}
    >
      {showIcon && <Eye size={16} className="text-gray-400" />}
      <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">
        <span className="text-crimson font-extrabold">{count.toLocaleString()}</span> views
      </span>
    </button>
  );
}

