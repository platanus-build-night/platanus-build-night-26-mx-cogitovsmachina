import { NextRequest, NextResponse } from 'next/server';
import { ghostClient } from '@/lib/ghost';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { forkId, sql } = body;

    if (!forkId || !sql) {
      return NextResponse.json({ error: 'forkId and sql are required' }, { status: 400 });
    }

    const result = await ghostClient.executeQuery(forkId, sql);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
