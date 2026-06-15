import { NextResponse } from 'next/server';
import { validateStageFlag } from '@/lib/ctf/validate';
import { getClientIp, isRateLimited } from '@/lib/ctf/rate-limit';
import type { CtfStageId } from '@/types/ctf';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`ctf-submit:${ip}`)) {
    return NextResponse.json(
      { success: false, message: 'Rate limit exceeded. Slow down.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const stage = Number(body.stage) as CtfStageId;
    const flag = typeof body.flag === 'string' ? body.flag : '';
    const completedStages = Array.isArray(body.completedStages)
      ? body.completedStages.filter((s: unknown) => typeof s === 'number')
      : [];

    if (!stage || stage < 1 || stage > 5 || !flag) {
      return NextResponse.json(
        { success: false, message: 'Invalid submission payload.' },
        { status: 400 }
      );
    }

    const result = validateStageFlag(stage, flag, completedStages);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Malformed request.' },
      { status: 400 }
    );
  }
}
