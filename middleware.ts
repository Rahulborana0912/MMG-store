import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSupabaseCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );
  const isAuthenticated = Boolean(hasSupabaseCookie);

  // If unauthenticated user attempts to visit /admin or /account
  if ((pathname.startsWith('/admin') || pathname.startsWith('/account')) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Ensure no-store headers on sensitive routes to prevent bfcache restoration
  const response = NextResponse.next();
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/api/auth')
  ) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/api/auth/:path*',
  ],
};
