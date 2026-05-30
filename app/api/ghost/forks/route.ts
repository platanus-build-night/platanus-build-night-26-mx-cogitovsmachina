import { NextRequest, NextResponse } from 'next/server';
import { ghostClient } from '@/lib/ghost';

export const runtime = 'edge';

export async function GET() {
  try {
    const forks = await ghostClient.getActiveForks();
    return NextResponse.json(forks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceDb } = body;

    const newFork = await ghostClient.createFork(sourceDb || 'production_main');
    return NextResponse.json(newFork);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
