/**
 * Dezi Callback Route Handler
 * 
 * GET /auth/dezi/callback
 * 
 * Handles the OAuth callback from Dezi:
 * 1. Validates state parameter against stored PKCE session
 * 2. Exchanges authorization code for tokens
 * 3. Fetches and processes userinfo (JWE -> JWS -> claims)
 * 4. Upserts user in database
 * 5. Creates login event for audit
 * 6. Creates application session
 * 7. Redirects to dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  getDeziConfig,
  fetchDiscoveryDocument,
  exchangeCodeForTokens,
  processUserInfo,
} from '@/lib/deziClient';
import { getPKCESession, createSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors from Dezi
  if (error) {
    console.error('Dezi OAuth error:', error, errorDescription);
    return redirectWithError('oauth_error', errorDescription || error);
  }

  // Validate required parameters
  if (!code || !state) {
    return redirectWithError('invalid_callback', 'Missing code or state parameter');
  }

  try {
    // Retrieve and validate PKCE session
    const pkceSession = await getPKCESession();
    if (!pkceSession) {
      return redirectWithError('session_expired', 'PKCE session expired or not found');
    }

    // Validate state to prevent CSRF
    if (pkceSession.state !== state) {
      return redirectWithError('state_mismatch', 'State parameter mismatch - possible CSRF attack');
    }

    // Load configuration and discovery
    const config = getDeziConfig();
    const discovery = await fetchDiscoveryDocument(config.issuer);

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      discovery.token_endpoint,
      code,
      pkceSession.codeVerifier,
      config.clientId,
      config.redirectUri,
      config.clientSecret
    );

    // Process userinfo (fetch JWE, decrypt, verify JWS, extract claims)
    const claims = await processUserInfo(
      config,
      discovery,
      tokens.access_token,
      pkceSession.nonce
    );

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { deziNummer: claims.dezi_nummer },
      update: {
        displayName: claims.rol_naam || undefined,
        updatedAt: new Date(),
      },
      create: {
        deziNummer: claims.dezi_nummer,
        displayName: claims.rol_naam || undefined,
      },
    });

    // Get client info for audit logging
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const userAgent = headersList.get('user-agent') || undefined;

    // Create login event for audit trail
    await prisma.loginEvent.create({
      data: {
        userId: user.id,
        abonneeNummer: claims.abonnee_nummer,
        deziRoleCode: claims.rol_code,
        deziRoleName: claims.rol_naam,
        ipAddress,
        userAgent,
      },
    });

    // Create application session
    await createSession({
      userId: user.id,
      deziNummer: claims.dezi_nummer,
      abonneeNummer: claims.abonnee_nummer,
      rolCode: claims.rol_code,
      rolNaam: claims.rol_naam,
      displayName: user.displayName || undefined,
    });

    // Redirect to dashboard
    const dashboardUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error('Callback processing failed:', error);
    
    // Determine error type for user-friendly message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Token exchange failed')) {
      return redirectWithError('token_error', 'Failed to exchange authorization code');
    }
    if (errorMessage.includes('UserInfo')) {
      return redirectWithError('userinfo_error', 'Failed to retrieve user information');
    }
    if (errorMessage.includes('decrypt') || errorMessage.includes('JWE')) {
      return redirectWithError('decryption_error', 'Failed to decrypt user information');
    }
    if (errorMessage.includes('verify') || errorMessage.includes('JWS')) {
      return redirectWithError('verification_error', 'Failed to verify user information');
    }
    
    return redirectWithError('callback_error', 'Authentication callback failed');
  }
}

/**
 * Helper to redirect to landing page with error parameters.
 */
function redirectWithError(errorCode: string, message: string): NextResponse {
  const errorUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  errorUrl.searchParams.set('error', errorCode);
  errorUrl.searchParams.set('message', message);
  return NextResponse.redirect(errorUrl);
}
