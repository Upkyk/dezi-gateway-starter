/**
 * Session Management
 * 
 * Handles application session creation, validation, and destruction.
 * Uses secure httpOnly cookies for session storage.
 * 
 * SECURITY NOTES:
 * - Sessions are signed using a secret key from environment variables
 * - Cookies are httpOnly, secure (in production), and sameSite=strict
 * - Session data is stored server-side; only session ID is in cookie
 */

import * as jose from 'jose';
import { cookies } from 'next/headers';

// ============================================================================
// Types
// ============================================================================

export interface SessionData {
  userId: string;
  deziNummer: string;
  abonneeNummer: string;
  rolCode: string;
  rolNaam: string;
  displayName?: string;
  createdAt: number;
  expiresAt: number;
}

export interface PKCESessionData {
  codeVerifier: string;
  state: string;
  nonce: string;
  createdAt: number;
}

// ============================================================================
// Configuration
// ============================================================================

const SESSION_COOKIE_NAME = 'dezi_session';
const PKCE_COOKIE_NAME = 'dezi_pkce';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const PKCE_DURATION = 10 * 60 * 1000; // 10 minutes for PKCE flow

/**
 * Get the session secret from environment variables.
 * This secret is used to sign and verify session tokens.
 */
function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET environment variable must be set and at least 32 characters long'
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Determine if we're in production mode for secure cookie settings.
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// ============================================================================
// Session Token Creation and Verification
// ============================================================================

/**
 * Create a signed JWT session token.
 */
async function createSessionToken(data: SessionData): Promise<string> {
  const secret = getSessionSecret();
  
  const token = await new jose.SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(data.expiresAt / 1000))
    .sign(secret);

  return token;
}

/**
 * Verify and decode a session token.
 */
async function verifySessionToken(token: string): Promise<SessionData | null> {
  try {
    const secret = getSessionSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Validate required fields
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.deziNummer !== 'string' ||
      typeof payload.abonneeNummer !== 'string' ||
      typeof payload.rolCode !== 'string' ||
      typeof payload.rolNaam !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      deziNummer: payload.deziNummer,
      abonneeNummer: payload.abonneeNummer,
      rolCode: payload.rolCode,
      rolNaam: payload.rolNaam,
      displayName: payload.displayName as string | undefined,
      createdAt: payload.createdAt as number,
      expiresAt: payload.expiresAt as number,
    };
  } catch {
    // Token verification failed (expired, invalid signature, etc.)
    return null;
  }
}

// ============================================================================
// PKCE Session (for OAuth flow)
// ============================================================================

/**
 * Store PKCE parameters in a short-lived cookie for the OAuth callback.
 */
export async function storePKCESession(data: Omit<PKCESessionData, 'createdAt'>): Promise<void> {
  const sessionData: PKCESessionData = {
    ...data,
    createdAt: Date.now(),
  };

  const secret = getSessionSecret();
  const token = await new jose.SignJWT({ ...sessionData })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + PKCE_DURATION) / 1000))
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(PKCE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax', // 'lax' is needed for OAuth redirects from external IdP
    path: '/',
    maxAge: Math.floor(PKCE_DURATION / 1000),
  });
}

/**
 * Retrieve and validate PKCE session from cookie.
 * The cookie is deleted after retrieval (one-time use).
 */
export async function getPKCESession(): Promise<PKCESessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PKCE_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = getSessionSecret();
    const { payload } = await jose.jwtVerify(token, secret);

    // Delete the PKCE cookie (one-time use)
    cookieStore.delete(PKCE_COOKIE_NAME);

    if (
      typeof payload.codeVerifier !== 'string' ||
      typeof payload.state !== 'string' ||
      typeof payload.nonce !== 'string'
    ) {
      return null;
    }

    return {
      codeVerifier: payload.codeVerifier,
      state: payload.state,
      nonce: payload.nonce,
      createdAt: payload.createdAt as number,
    };
  } catch {
    // Token verification failed
    cookieStore.delete(PKCE_COOKIE_NAME);
    return null;
  }
}

// ============================================================================
// Application Session
// ============================================================================

/**
 * Create a new application session after successful Dezi login.
 */
export async function createSession(data: Omit<SessionData, 'createdAt' | 'expiresAt'>): Promise<void> {
  const now = Date.now();
  const sessionData: SessionData = {
    ...data,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };

  const token = await createSessionToken(sessionData);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict', // Strict for application session - no CSRF concerns
    path: '/',
    maxAge: Math.floor(SESSION_DURATION / 1000),
  });
}

/**
 * Get the current session if valid.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

/**
 * Destroy the current session (logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if a valid session exists.
 */
export async function hasValidSession(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// ============================================================================
// Session Utilities
// ============================================================================

/**
 * Require a valid session, throwing an error if not present.
 * Useful for protected API routes.
 */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized: No valid session');
  }
  return session;
}
