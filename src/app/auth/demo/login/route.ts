/**
 * Demo Login Route Handler
 * 
 * GET /auth/demo/login
 * 
 * Creates a demo session for testing purposes WITHOUT real Dezi authentication.
 * This allows you to view the dashboard and test the UI without Dezi credentials.
 * 
 * ⚠️ ONLY FOR DEVELOPMENT - Remove or disable in production!
 */

import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/?error=demo_disabled', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      const errorUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      errorUrl.searchParams.set('error', 'database_not_configured');
      errorUrl.searchParams.set('message', 'Database niet geconfigureerd. Zie README voor setup instructies.');
      return NextResponse.redirect(errorUrl);
    }

    // Demo user data
    const demoDeziNummer = 'DEMO-12345678';
    const demoData = {
      deziNummer: demoDeziNummer,
      displayName: 'Demo Gebruiker',
      abonneeNummer: '98765432',
      deziRoleCode: '01',
      deziRoleName: 'Huisarts',
    };

    // Find or create demo user
    let user = await prisma.user.findUnique({
      where: { deziNummer: demoDeziNummer },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          deziNummer: demoData.deziNummer,
          displayName: demoData.displayName,
        },
      });
    } else {
      // Update display name if it changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: { displayName: demoData.displayName },
      });
    }

    // Create a login event
    await prisma.loginEvent.create({
      data: {
        userId: user.id,
        abonneeNummer: demoData.abonneeNummer,
        deziRoleCode: demoData.deziRoleCode,
        deziRoleName: demoData.deziRoleName,
        ipAddress: '127.0.0.1',
        userAgent: 'Demo Mode',
      },
    });

    // Create session
    await createSession({
      userId: user.id,
      deziNummer: user.deziNummer,
      displayName: user.displayName || undefined,
      abonneeNummer: demoData.abonneeNummer,
      rolCode: demoData.deziRoleCode,
      rolNaam: demoData.deziRoleName,
    });

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Demo login failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    errorUrl.searchParams.set('error', 'demo_login_failed');
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Failed to create demo session');
    
    return NextResponse.redirect(errorUrl);
  }
}
