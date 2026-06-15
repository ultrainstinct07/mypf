import { createHash, timingSafeEqual } from 'crypto';
import { CTF_FLAG_HASHES } from './flags.server';
import { CTF_NEXT_HINTS } from './challenges';
import type { CtfStageId, CtfSubmitResponse } from '@/types/ctf';
import { createCompletionProof } from './signing';

function hashFlag(flag: string): string {
  return createHash('sha256').update(flag.trim()).digest('hex');
}

function flagsMatch(submitted: string, expectedHash: string): boolean {
  const submittedHash = hashFlag(submitted);
  try {
    return timingSafeEqual(
      Buffer.from(submittedHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch {
    return false;
  }
}

export function validateStageFlag(
  stage: CtfStageId,
  flag: string,
  completedStages: CtfStageId[] = []
): CtfSubmitResponse {
  const expectedHash = CTF_FLAG_HASHES[stage];
  if (!expectedHash) {
    return { success: false, message: 'Invalid stage.' };
  }

  const priorStage = (stage - 1) as CtfStageId;
  if (stage > 1 && !completedStages.includes(priorStage)) {
    return {
      success: false,
      message: `Stage ${priorStage} must be cleared before stage ${stage}.`,
    };
  }

  if (!flagsMatch(flag, expectedHash)) {
    return { success: false, message: 'Invalid flag. Keep digging.' };
  }

  const isFinal = stage === 5;
  const response: CtfSubmitResponse = {
    success: true,
    message: isFinal
      ? 'ROOT ACCESS GRANTED. Domain pwned. Welcome to the void.'
      : `Stage ${stage} cleared.`,
    nextHint: CTF_NEXT_HINTS[stage],
    completed: isFinal,
  };

  if (isFinal) {
    response.proofToken = createCompletionProof();
  }

  return response;
}
