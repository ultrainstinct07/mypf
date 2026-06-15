import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const PROOF_TTL_MS = 60 * 60 * 1000;

function getSigningSecret(): string | null {
  return process.env.CTF_SIGNING_SECRET ?? null;
}

export function createCompletionProof(): string | undefined {
  const secret = getSigningSecret();
  if (!secret) return undefined;

  const issuedAt = Date.now();
  const nonce = randomBytes(8).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

export function verifyCompletionProof(token: string): boolean {
  const secret = getSigningSecret();
  if (!secret) return false;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [issuedAtStr, nonce, signature] = decoded.split('.');
    if (!issuedAtStr || !nonce || !signature) return false;

    const issuedAt = Number(issuedAtStr);
    if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > PROOF_TTL_MS) {
      return false;
    }

    const payload = `${issuedAtStr}.${nonce}`;
    const expected = createHmac('sha256', secret).update(payload).digest('hex');

    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
