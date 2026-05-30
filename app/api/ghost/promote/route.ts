import { NextRequest, NextResponse } from 'next/server';
import { ghostClient } from '@/lib/ghost';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { forkId } = body;

    if (!forkId) {
      return NextResponse.json({ error: 'forkId is required' }, { status: 400 });
    }

    const success = await ghostClient.promoteFork(forkId);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
