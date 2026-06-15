'use client';

interface AmbientScanOverlayProps {
  onScanComplete: () => void;
}

export default function AmbientScanOverlay({ onScanComplete }: AmbientScanOverlayProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="ambient-scan-sweep absolute left-0 right-0 h-[2px]"
        onAnimationIteration={onScanComplete}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(217,4,41,0.2) 12%, rgba(217,4,41,0.85) 50%, rgba(217,4,41,0.2) 88%, transparent 100%)',
          boxShadow:
            '0 0 18px rgba(217,4,41,0.55), 0 0 36px rgba(217,4,41,0.25), 0 -24px 48px rgba(217,4,41,0.12)',
        }}
      />
    </div>
  );
}
