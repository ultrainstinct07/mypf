import { NextResponse } from 'next/server';
import {
  addLeaderboardEntry,
  getLeaderboard,
  isLeaderboardOnline,
  sanitizeHandle,
} from '@/lib/ctf/leaderboard';
import { verifyCompletionProof } from '@/lib/ctf/signing';
import { getClientIp, isRateLimited } from '@/lib/ctf/rate-limit';

export async function GET() {
  const entries = await getLeaderboard();
  return NextResponse.json({
    entries: entries.slice(0, 25),
    online: isLeaderboardOnline(),
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`ctf-leaderboard:${ip}`)) {
    return NextResponse.json(
      { success: false, message: 'Rate limit exceeded.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const handle = sanitizeHandle(typeof body.handle === 'string' ? body.handle : '');
    const proofToken = typeof body.proofToken === 'string' ? body.proofToken : '';

    if (!handle) {
      return NextResponse.json(
        { success: false, message: 'Handle must be 1–20 alphanumeric/underscore characters.' },
        { status: 400 }
      );
    }

    if (!proofToken || !verifyCompletionProof(proofToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired completion proof.' },
        { status: 403 }
      );
    }

    const result = await addLeaderboardEntry(handle, new Date().toISOString());
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error ?? 'Could not register handle.' },
        { status: result.error?.includes('not configured') ? 503 : 409 }
      );
    }

    const entries = await getLeaderboard();
    return NextResponse.json({ success: true, entries: entries.slice(0, 25) });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Malformed request.' },
      { status: 400 }
    );
  }
}
