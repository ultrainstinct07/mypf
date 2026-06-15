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
  const next = { ...progress, voidDiscovered: true };
  saveCtfProgress(next);
  return next;
}

export function completeStage(
  progress: CtfProgress,
  stage: CtfStageId,
  proofToken?: string
): CtfProgress {
  const completedStages = progress.completedStages.includes(stage)
    ? progress.completedStages
    : [...progress.completedStages, stage].sort((a, b) => a - b);

  const next: CtfProgress = {
    ...progress,
    completedStages,
    proofToken: proofToken ?? progress.proofToken,
    completedAt: stage === 5 ? new Date().toISOString() : progress.completedAt,
  };

  saveCtfProgress(next);
  return next;
}

export function setTokenExported(progress: CtfProgress): CtfProgress {
  const next = { ...progress, tokenExported: true };
  saveCtfProgress(next);
  return next;
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
