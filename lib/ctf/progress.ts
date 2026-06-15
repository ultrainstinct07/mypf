'use client';

import {
  CTF_STORAGE_KEY,
  DEFAULT_CTF_PROGRESS,
  type CtfProgress,
  type CtfStageId,
} from '@/types/ctf';

export function loadCtfProgress(): CtfProgress {
  if (typeof window === 'undefined') return DEFAULT_CTF_PROGRESS;

  try {
    const stored = localStorage.getItem(CTF_STORAGE_KEY);
    if (!stored) return DEFAULT_CTF_PROGRESS;
    return { ...DEFAULT_CTF_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CTF_PROGRESS;
  }
}

export function saveCtfProgress(progress: CtfProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CTF_STORAGE_KEY, JSON.stringify(progress));
}

export function markVoidDiscovered(progress: CtfProgress): CtfProgress {
  if (progress.voidDiscovered) return progress;
  return { ...progress, voidDiscovered: true };
}

export function completeStage(
  progress: CtfProgress,
  stage: CtfStageId,
  proofToken?: string
): CtfProgress {
  if (progress.completedStages.includes(stage) && !proofToken) {
    return progress;
  }

  const completedStages = progress.completedStages.includes(stage)
    ? progress.completedStages
    : [...progress.completedStages, stage].sort((a, b) => a - b);

  return {
    ...progress,
    completedStages,
    proofToken: proofToken ?? progress.proofToken,
    completedAt: stage === 5 ? new Date().toISOString() : progress.completedAt,
  };
}

export function setTokenExported(progress: CtfProgress): CtfProgress {
  if (progress.tokenExported) return progress;
  return { ...progress, tokenExported: true };
}

export function getCurrentStage(progress: CtfProgress): number {
  if (!progress.voidDiscovered) return 0;
  if (progress.completedStages.length === 0) return 1;
  const max = Math.max(...progress.completedStages);
  return max >= 5 ? 5 : max + 1;
}

export function isStageComplete(progress: CtfProgress, stage: CtfStageId): boolean {
  return progress.completedStages.includes(stage);
}
