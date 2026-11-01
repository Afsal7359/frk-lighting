import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, checkRateLimit, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting for Brute Force Protection (max 6 attempts per 10 minutes)
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateCheck = checkRateLimit(`login:${clientIp}`, 6, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSec),
          },
        }
      );
    }

    const { email, password } = await req.json();

    // 2. Server-side only credentials (do not expose via NEXT_PUBLIC)
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@frklighting.com').trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin';

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = typeof password === 'string' ? password : '';

    // Constant-time-like check
    const isEmailMatch = inputEmail === expectedEmail;
    const isPassMatch = inputPassword === expectedPassword;

    if (isEmailMatch && isPassMatch) {
      // 3. Generate Cryptographically Signed HMAC Session Token
      const token = await createSessionToken(expectedEmail);

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        email: expectedEmail,
      });

      // 4. Set Secure, HTTP-Only Cookie
      response.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      },
      { status: 401 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Server error during authentication';
    return NextResponse.json(
      {
        success: false,
        message: errMessage,
      },
      { status: 500 }
    );
  }
}
