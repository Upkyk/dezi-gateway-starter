/**
 * Next.js Middleware
 * 
 * Handles route protection for the application.
 * Protected routes require a valid session cookie.
 * 
 * Note: Full session validation happens in the route handlers.
 * This middleware only checks for cookie presence as a first-pass filter.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/auth/dezi/login'];

const SESSION_COOKIE_NAME = 'dezi_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const hasSession = !!sessionCookie?.value;

  // Check if accessing a protected route without a session
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('error', 'session_required');
    loginUrl.searchParams.set('message', 'Je moet inloggen om deze pagina te bekijken.');
    return NextResponse.redirect(loginUrl);
  }

  // Optionally redirect authenticated users away from login page
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
