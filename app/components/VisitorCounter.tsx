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
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    if (!hasIncremented) {
      const newCount = incrementPageView();
      setCount(newCount);
      setHasIncremented(true);
    } else {
      setCount(getPageViewCount());
    }
  }, [hasIncremented]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Eye size={16} className="text-gray-400" />}
      <span className="text-sm text-gray-400">
        <span className="text-cyan font-semibold">{count.toLocaleString()}</span> views
      </span>
    </div>
  );
}

