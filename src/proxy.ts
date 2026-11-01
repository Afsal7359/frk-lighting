import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

/**
 * Next.js 16 Proxy Convention (replaces deprecated middleware.ts)
 * Protects admin dashboard and restricted routes server-side.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding /admin/login
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/');
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!isLoginPage && !session) {
      // Unauthenticated user trying to access /admin -> redirect to /admin/login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && session) {
      // Already authenticated user visiting /admin/login -> redirect to /admin
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
