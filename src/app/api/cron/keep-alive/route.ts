import { NextResponse } from 'next/server';
import { recordKeepAlivePing, getKeepAliveStatus } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const log = await recordKeepAlivePing('cron', 'Scheduled 2-day database keep-alive ping');
    const status = await getKeepAliveStatus();

    return NextResponse.json({
      success: true,
      message: 'Database keep-alive ping successful. Supabase project kept active!',
      timestamp: log.timestamp,
      hoursSinceLastPing: status.hoursSinceLastPing,
      status: status.status
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to ping database'
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
