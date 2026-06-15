'use client';

import { SITE_CONFIG } from '@/lib/constants';

interface TerminalLoaderPanelProps {
  progress: number;
  webglEnabled: boolean;
  canSkip: boolean;
  onSkip: () => void;
}

const BOOT_LINES = [
  { threshold: 0, text: '[ OK ] Initializing node mesh' },
  { threshold: 25, text: '[ OK ] Linking security modules' },
  { threshold: 50, text: '[ OK ] Mapping attack surface' },
  { threshold: 75, text: '[ .. ] Handshake in progress...' },
];

export default function TerminalLoaderPanel({
  progress,
  webglEnabled,
  canSkip,
  onSkip,
}: TerminalLoaderPanelProps) {
  const visibleLines = BOOT_LINES.filter((line) => progress >= line.threshold);
  const handshakeLine =
    progress >= 75
      ? `[ .. ] Handshake in progress... ${Math.min(progress, 99)}%`
      : null;

  return (
    <div className="w-full max-w-lg font-mono text-xs sm:text-sm">
      <div className="border-2 border-[#00ff78]/40 bg-[#0a0a0a]/95 shadow-[0_0_24px_rgba(0,255,120,0.12)] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-[#00ff78]/25 px-3 py-2 bg-black/80">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-crimson" aria-hidden />
            <span className="h-2.5 w-2.5 bg-[#00ff78]/60" aria-hidden />
            <span className="h-2.5 w-2.5 border border-[#00ff78]/40" aria-hidden />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-crimson">
            root@void999 — boot sequence
          </span>
        </div>

        <div className="space-y-1.5 px-4 py-4 min-h-[140px]">
          <p className="text-crimson font-bold">
            <span className="text-[#00ff78]">[SECOPS]</span> {SITE_CONFIG.name}
          </p>
          <p className="text-[#ff4444] text-[11px] uppercase tracking-wide">
            {SITE_CONFIG.role}
          </p>

          <div className="pt-2 space-y-1">
            {visibleLines.map((line) => (
              <p key={line.threshold} className="text-[#00ff78]">
                {line.threshold === 75 && handshakeLine ? handshakeLine : line.text}
              </p>
            ))}
          </div>

          <p className="pt-2 text-[#00ff78]">
            <span className="text-crimson">root@void999:~#</span>{' '}
            {progress >= 100 ? (
              <span className="text-[#ff4444]">access granted</span>
            ) : (
              <span>awaiting uplink</span>
            )}
            <span className="inline-block w-2 animate-pulse text-crimson">_</span>
          </p>
        </div>

        <div className="border-t border-[#00ff78]/20 px-4 py-3">
          <div className="h-1.5 border border-[#00ff78]/30 bg-black overflow-hidden">
            <div
              className="h-full bg-[#00ff78] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider">
            <span className="text-[#00ff78]">
              {webglEnabled ? 'Node mesh active' : 'Static fallback'}
            </span>
            <span className="text-crimson font-bold">{progress}%</span>
          </div>
          {canSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00ff78]/70 hover:text-crimson transition-colors"
            >
              Enter site →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
