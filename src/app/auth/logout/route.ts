/**
 * Logout Route Handler
 * 
 * GET /auth/logout
 * 
 * Destroys the application session and redirects to landing page.
 */

import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function GET() {
  try {
    // Destroy the session cookie
    await destroySession();

    // Redirect to landing page
    const homeUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    return NextResponse.redirect(homeUrl);
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Still redirect to home even if logout fails
    const homeUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    return NextResponse.redirect(homeUrl);
  }
}
