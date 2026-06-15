'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function ShareButton({
  url,
  title,
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || document.title;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white dark:bg-dark-card border-2 border-black dark:border-white rounded-none hover:border-crimson hover:bg-crimson/10 dark:hover:border-crimson dark:hover:bg-crimson/10 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all font-bold uppercase tracking-wider text-xs touch-manipulation ${className}`}
      aria-label="Share"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} className="text-black dark:text-white" />
          <span className="text-black dark:text-white">Share</span>
        </>
      )}
    </button>
  );
}

