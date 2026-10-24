import { NextResponse } from 'next/server';
import { checkMongoStatus } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await checkMongoStatus();
  return NextResponse.json({
    success: true,
    status,
    timestamp: new Date().toISOString(),
  });
}
