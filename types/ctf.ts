export type CtfStageId = 1 | 2 | 3 | 4 | 5;

export interface CtfStage {
  id: CtfStageId;
  name: string;
  hint: string;
}

export interface CtfProgress {
  voidDiscovered: boolean;
  completedStages: CtfStageId[];
  tokenExported: boolean;
  proofToken: string | null;
  completedAt: string | null;
}

export interface LeaderboardEntry {
  handle: string;
  completedAt: string;
}

export interface CtfSubmitRequest {
  stage: CtfStageId;
  flag: string;
}

export interface CtfSubmitResponse {
  success: boolean;
  message: string;
  nextHint?: string;
  completed?: boolean;
  proofToken?: string;
}

export interface CtfLeaderboardPostRequest {
  handle: string;
  proofToken: string;
}

export const CTF_STORAGE_KEY = 'void999-ctf-progress';

export const DEFAULT_CTF_PROGRESS: CtfProgress = {
  voidDiscovered: false,
  completedStages: [],
  tokenExported: false,
  proofToken: null,
  completedAt: null,
};
