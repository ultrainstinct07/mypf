'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';
import { useCtf } from '@/app/components/CtfProvider';
import CtfLeaderboard from '@/app/components/CtfLeaderboard';

export default function VoidPageClient() {
  const { discoverVoid, openTerminal, canOpenTerminal, progress } = useCtf();

  useEffect(() => {
    discoverVoid();
  }, [discoverVoid]);

  return (
    <main className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container-custom py-16 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 hover:text-crimson transition-colors"
        >
          <ArrowLeft size={14} />
          Return to surface
        </Link>

        <div className="space-y-4" data-void="discovered">
          <p className="text-crimson text-sm uppercase tracking-[0.3em]">Sector VOID</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase">
            Unauthorized Access Detected
          </h1>
          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
            You found a path the crawlers were told to ignore. This sector holds infiltration
            artifacts for Operation VOID999. Inspect everything — source, terminal, assistant.
          </p>
        </div>

        <div className="border-2 border-white/10 p-6 space-y-4 bg-white/5">
          <div className="flex items-center gap-2 text-crimson">
            <Terminal size={18} />
            <span className="text-xs uppercase tracking-wider">Operator Briefing</span>
          </div>
          <ul className="text-sm space-y-2 text-gray-400 list-disc list-inside">
            <li>Stage 1 flag is embedded in this page&apos;s HTML comments.</li>
            <li>Open the VOID terminal with Ctrl+Shift+` after extracting recon intel.</li>
            <li>Submit flags via the terminal to advance through all five stages.</li>
          </ul>
          {canOpenTerminal && (
            <button
              type="button"
              onClick={openTerminal}
              className="px-4 py-2 bg-crimson text-white text-xs uppercase tracking-wider border-2 border-crimson hover:bg-crimson/90 transition-colors"
            >
              Open Terminal
            </button>
          )}
        </div>

        {progress.completedStages.includes(5) && <CtfLeaderboard />}

        {!progress.completedStages.includes(5) && (
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            Complete all five stages to unlock the hall of fame.
          </p>
        )}
      </div>
    </main>
  );
}
