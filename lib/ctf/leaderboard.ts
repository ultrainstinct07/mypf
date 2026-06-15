import { prisma, isDatabaseConfigured } from '@/lib/db';
import type { LeaderboardEntry } from '@/types/ctf';

const MAX_ENTRIES = 100;

export function isLeaderboardOnline(): boolean {
  return isDatabaseConfigured();
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const rows = await prisma.ctfLeaderboardEntry.findMany({
      orderBy: { completedAt: 'asc' },
      take: MAX_ENTRIES,
      select: { handle: true, completedAt: true },
    });

    return rows.map((row) => ({
      handle: row.handle,
      completedAt: row.completedAt.toISOString(),
    }));
  } catch (error) {
    console.error('[ctf] leaderboard read failed:', error);
    return [];
  }
}

export async function addLeaderboardEntry(
  handle: string,
  completedAt: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'Leaderboard storage is not configured.' };
  }

  try {
    const existing = await prisma.ctfLeaderboardEntry.findUnique({
      where: { handle },
      select: { id: true },
    });

    if (existing) {
      return { ok: false, error: 'Handle already registered on the hall of fame.' };
    }

    await prisma.ctfLeaderboardEntry.create({
      data: {
        handle,
        completedAt: new Date(completedAt),
      },
    });

    const count = await prisma.ctfLeaderboardEntry.count();
    if (count > MAX_ENTRIES) {
      const overflow = await prisma.ctfLeaderboardEntry.findMany({
        orderBy: { completedAt: 'desc' },
        skip: MAX_ENTRIES,
        select: { id: true },
      });
      if (overflow.length > 0) {
        await prisma.ctfLeaderboardEntry.deleteMany({
          where: { id: { in: overflow.map((row) => row.id) } },
        });
      }
    }

    return { ok: true };
  } catch (error) {
    console.error('[ctf] leaderboard write failed:', error);
    return { ok: false, error: 'Could not register handle.' };
  }
}

export function sanitizeHandle(handle: string): string | null {
  const trimmed = handle.trim();
  if (!trimmed || trimmed.length > 20) return null;
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return null;
  return trimmed;
}
