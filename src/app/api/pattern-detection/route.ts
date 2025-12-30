// app/api/pattern-detection/route.ts

import { runPatternDetection } from '@/lib/pattern-detector';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await runPatternDetection();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pattern detection failed:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}