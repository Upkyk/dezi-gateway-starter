/**
 * Dezi Login Route Handler
 * 
 * GET /auth/dezi/login
 * 
 * Initiates the OIDC Authorization Code flow with PKCE:
 * 1. Generates PKCE parameters (code_verifier, code_challenge, state, nonce)
 * 2. Stores PKCE params in a secure cookie for the callback
 * 3. Redirects user to Dezi's authorization endpoint
 */

import { NextResponse } from 'next/server';
import {
  getDeziConfig,
  fetchDiscoveryDocument,
  generatePKCEParams,
  buildAuthorizationUrl,
} from '@/lib/deziClient';
import { storePKCESession } from '@/lib/session';

export async function GET() {
  try {
    // Load Dezi configuration from environment
    const config = getDeziConfig();

    // Fetch OIDC discovery document
    const discovery = await fetchDiscoveryDocument(config.issuer);

    // Generate PKCE parameters
    const pkceParams = await generatePKCEParams();

    // Store PKCE parameters in a secure cookie for the callback
    await storePKCESession({
      codeVerifier: pkceParams.codeVerifier,
      state: pkceParams.state,
      nonce: pkceParams.nonce,
    });

    // Build the authorization URL
    const authUrl = buildAuthorizationUrl(
      discovery.authorization_endpoint,
      config.clientId,
      config.redirectUri,
      pkceParams,
      ['openid'] // Scopes - adjust as needed for your Dezi configuration
    );

    // Redirect to Dezi's authorization endpoint
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Login initiation failed:', error);
    
    // Redirect to landing page with error
    const errorUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    errorUrl.searchParams.set('error', 'login_failed');
    errorUrl.searchParams.set('message', 'Failed to initiate Dezi login');
    
    return NextResponse.redirect(errorUrl);
  }
}
