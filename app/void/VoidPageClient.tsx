'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';
import { useCtf } from '@/app/components/CtfProvider';
import CtfLeaderboard from '@/app/components/CtfLeaderboard';
import { CTF_STAGES } from '@/lib/ctf/challenges';
import { CTF_START_HINT, CTF_STAGE_HINTS, CTF_TITLE } from '@/lib/ctf/public-hints';
import type { CtfStageId } from '@/types/ctf';

export default function VoidPageClient() {
  const { discoverVoid, openTerminal, canOpenTerminal, progress } = useCtf();

  useEffect(() => {
    discoverVoid();
  }, [discoverVoid]);

  const stageIds = Object.keys(CTF_STAGE_HINTS).map(Number) as CtfStageId[];

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
            artifacts for {CTF_TITLE}. Inspect everything — source, terminal, assistant.
          </p>
          <p className="text-gray-500 max-w-2xl text-xs leading-relaxed border-l-2 border-crimson/40 pl-4">
            {CTF_START_HINT}
          </p>
        </div>

        <div className="border-2 border-white/10 p-6 space-y-5 bg-white/5">
          <div className="flex items-center gap-2 text-crimson">
            <Terminal size={18} />
            <span className="text-xs uppercase tracking-wider">Operator Briefing — 5 Stages</span>
          </div>

          <ol className="space-y-4">
            {stageIds.map((stageId) => {
              const stage = CTF_STAGES.find((item) => item.id === stageId);
              const complete = progress.completedStages.includes(stageId);

              return (
                <li
                  key={stageId}
                  className={`border-l-2 pl-4 ${complete ? 'border-[#00ff78]/60' : 'border-white/15'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">
                      Stage {stageId}
                    </span>
                    {stage && (
                      <span className="text-[10px] uppercase tracking-wider text-crimson">
                        {stage.name}
                      </span>
                    )}
                    {complete && (
                      <span className="text-[10px] uppercase tracking-wider text-[#00ff78]">
                        [ cleared ]
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{CTF_STAGE_HINTS[stageId]}</p>
                </li>
              );
            })}
          </ol>

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Terminal uplink: Ctrl+Shift+` — submit flags with{' '}
            <code className="text-gray-300">submit &lt;flag&gt;</code> or{' '}
            <code className="text-gray-300">submit --final &lt;flag&gt;</code> for stage 5.
          </p>

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
