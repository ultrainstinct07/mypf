'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Text */}
        <h1 className="font-display text-9xl md:text-[12rem] font-bold text-gradient-cyan mb-4">
          404
        </h1>
        
        {/* Error message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 opacity-20">
          <svg
            className="w-full max-w-md mx-auto"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="150" r="100" stroke="currentColor" strokeWidth="2" className="text-cyan" />
            <circle cx="200" cy="150" r="80" stroke="currentColor" strokeWidth="2" className="text-cyan-secondary" />
            <circle cx="200" cy="150" r="60" stroke="currentColor" strokeWidth="2" className="text-cyan" />
          </svg>
        </div>
      </div>
    </main>
  );
}

