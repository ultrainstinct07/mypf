'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 text-black dark:text-white transition-colors duration-300">
      <div className="text-center max-w-2xl">
        {/* 404 Text */}
        <h1 className="font-syne text-9xl md:text-[12rem] font-extrabold uppercase text-crimson mb-4">
          404
        </h1>
        
        {/* Error message */}
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            <Home size={18} />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 opacity-30">
          <svg
            className="w-full max-w-md mx-auto"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="100" y="50" width="200" height="200" stroke="currentColor" strokeWidth="2" className="text-crimson" />
            <rect x="120" y="70" width="160" height="160" stroke="currentColor" strokeWidth="2" className="text-crimson" style={{ opacity: 0.6 }} />
            <rect x="140" y="90" width="120" height="120" stroke="currentColor" strokeWidth="2" className="text-crimson" style={{ opacity: 0.3 }} />
          </svg>
        </div>
      </div>
    </main>
  );
}

