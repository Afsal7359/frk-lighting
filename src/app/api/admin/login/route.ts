import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@frklighting.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

    const cleanInputEmail = (email || '').trim().toLowerCase();
    const cleanExpectedEmail = expectedEmail.trim().toLowerCase();

    if (cleanInputEmail === cleanExpectedEmail && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        email: cleanExpectedEmail,
      });

      // Set a secure session cookie
      response.cookies.set('frk_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid email address or password. Please check your credentials in .env.local',
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server error during authentication',
      },
      { status: 500 }
    );
  }
}
