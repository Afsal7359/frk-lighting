import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) {
    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  }

  return NextResponse.json({
    authenticated: false,
  }, { status: 401 });
}
