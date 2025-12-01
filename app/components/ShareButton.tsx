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
      className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-dark-lighter border border-white/5 rounded-lg hover:border-cyan/50 hover:bg-cyan/10 transition-all touch-manipulation ${className}`}
      aria-label="Share"
    >
      {copied ? (
        <>
          <Check size={18} className="text-green-400" />
          <span className="text-sm text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={18} className="text-gray-300" />
          <span className="text-sm text-gray-300">Share</span>
        </>
      )}
    </button>
  );
}

