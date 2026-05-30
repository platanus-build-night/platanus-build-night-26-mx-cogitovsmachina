import { NextRequest, NextResponse } from 'next/server';
import { memoryClient } from '@/lib/memory';

export const runtime = 'edge';

export async function GET() {
  try {
    const history = await memoryClient.getFullHistory();
    return NextResponse.json(history);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, type } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }

    const newSegment = await memoryClient.syncSegment(key, value, type || 'working');
    return NextResponse.json(newSegment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
