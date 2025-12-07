/**
 * Dezi OIDC Client
 * 
 * Handles all Dezi-specific OIDC operations:
 * - Discovery endpoint fetching
 * - Authorization URL generation with PKCE
 * - Token exchange
 * - UserInfo fetching and JWE/JWS processing
 * 
 * SECURITY NOTES:
 * - Private keys should be loaded from environment variables for development
 * - In production, use a secret manager (e.g., AWS Secrets Manager, HashiCorp Vault) or HSM
 * - Never log private keys, raw JWE content, or raw assertions
 */

import * as jose from 'jose';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types
// ============================================================================

export interface DeziOIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  privateKeyPem: string; // PEM-encoded private key for JWE decryption
}

export interface OIDCDiscoveryDocument {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
}

export interface PKCEParams {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
  nonce: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export interface DeziClaims {
  dezi_nummer: string;
  abonnee_nummer: string;
  rol_code: string;
  rol_naam: string;
  // Additional claims that may be present
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  nonce?: string;
  [key: string]: unknown;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Load Dezi OIDC configuration from environment variables.
 * 
 * Required environment variables:
 * - DEZI_ISSUER: The Dezi OIDC issuer URL
 * - DEZI_CLIENT_ID: Your registered client ID
 * - DEZI_REDIRECT_URI: The callback URL for your application
 * - DEZI_PRIVATE_KEY: PEM-encoded private key for JWE decryption
 * 
 * Optional:
 * - DEZI_CLIENT_SECRET: Client secret (if using confidential client)
 */
export function getDeziConfig(): DeziOIDCConfig {
  const issuer = process.env.DEZI_ISSUER;
  const clientId = process.env.DEZI_CLIENT_ID;
  const redirectUri = process.env.DEZI_REDIRECT_URI;
  const privateKeyPem = process.env.DEZI_PRIVATE_KEY;

  if (!issuer || !clientId || !redirectUri || !privateKeyPem) {
    throw new Error(
      'Missing required Dezi configuration. Please set DEZI_ISSUER, DEZI_CLIENT_ID, DEZI_REDIRECT_URI, and DEZI_PRIVATE_KEY environment variables.'
    );
  }

  return {
    issuer,
    clientId,
    clientSecret: process.env.DEZI_CLIENT_SECRET,
    redirectUri,
    privateKeyPem,
  };
}

// ============================================================================
// Discovery
// ============================================================================

let cachedDiscovery: OIDCDiscoveryDocument | null = null;
let discoveryFetchedAt: number = 0;
const DISCOVERY_CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch OIDC discovery document from Dezi's well-known endpoint.
 * Results are cached for 1 hour.
 */
export async function fetchDiscoveryDocument(issuer: string): Promise<OIDCDiscoveryDocument> {
  const now = Date.now();
  
  if (cachedDiscovery && (now - discoveryFetchedAt) < DISCOVERY_CACHE_TTL) {
    return cachedDiscovery;
  }

  const discoveryUrl = `${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`;
  
  const response = await fetch(discoveryUrl, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC discovery document: ${response.status} ${response.statusText}`);
  }

  cachedDiscovery = await response.json();
  discoveryFetchedAt = now;

  return cachedDiscovery!;
}

// ============================================================================
// PKCE
// ============================================================================

/**
 * Generate PKCE parameters for Authorization Code flow.
 * Uses S256 challenge method as required by NL GOV profiles.
 */
export async function generatePKCEParams(): Promise<PKCEParams> {
  // Generate code verifier (43-128 characters, URL-safe)
  const codeVerifier = jose.base64url.encode(crypto.getRandomValues(new Uint8Array(32)));
  
  // Generate code challenge using S256 method
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = jose.base64url.encode(new Uint8Array(digest));

  // Generate state and nonce for CSRF and replay protection
  const state = uuidv4();
  const nonce = uuidv4();

  return {
    codeVerifier,
    codeChallenge,
    state,
    nonce,
  };
}

// ============================================================================
// Authorization
// ============================================================================

/**
 * Build the authorization URL for redirecting users to Dezi login.
 */
export function buildAuthorizationUrl(
  authorizationEndpoint: string,
  clientId: string,
  redirectUri: string,
  pkceParams: PKCEParams,
  scopes: string[] = ['openid']
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state: pkceParams.state,
    nonce: pkceParams.nonce,
    code_challenge: pkceParams.codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${authorizationEndpoint}?${params.toString()}`;
}

// ============================================================================
// Token Exchange
// ============================================================================

/**
 * Exchange authorization code for tokens at Dezi's token endpoint.
 */
export async function exchangeCodeForTokens(
  tokenEndpoint: string,
  code: string,
  codeVerifier: string,
  clientId: string,
  redirectUri: string,
  clientSecret?: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Add client authentication if using confidential client
  if (clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    headers['Authorization'] = `Basic ${credentials}`;
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// UserInfo and JWE/JWS Processing
// ============================================================================

/**
 * Fetch userinfo from Dezi's userinfo endpoint.
 * The response is a JWE containing a signed JWS assertion.
 */
export async function fetchUserInfo(
  userinfoEndpoint: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/jwt', // Request JWT format
    },
  });

  if (!response.ok) {
    throw new Error(`UserInfo request failed: ${response.status} ${response.statusText}`);
  }

  // The response body is the JWE
  return response.text();
}

/**
 * Decrypt JWE using our private key.
 * 
 * SECURITY: The private key should be loaded from a secure source.
 * In production, consider using HSM or a secret manager.
 */
export async function decryptJWE(jwe: string, privateKeyPem: string): Promise<string> {
  // Import the private key
  const privateKey = await jose.importPKCS8(privateKeyPem, 'RSA-OAEP-256');
  
  // Decrypt the JWE
  const { plaintext } = await jose.compactDecrypt(jwe, privateKey);
  
  // The plaintext is the inner JWS
  return new TextDecoder().decode(plaintext);
}

/**
 * Verify JWS using Dezi's JWKS and extract claims.
 * 
 * Validates:
 * - Signature using Dezi's public keys
 * - Issuer matches expected value
 * - Audience matches our client ID (if present)
 * - Token is not expired (exp)
 * - Token is not used before valid (nbf)
 */
export async function verifyJWSAndExtractClaims(
  jws: string,
  jwksUri: string,
  expectedIssuer: string,
  expectedAudience: string,
  expectedNonce?: string
): Promise<DeziClaims> {
  // Create JWKS remote key set
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

  // Verify the JWS
  const { payload } = await jose.jwtVerify(jws, JWKS, {
    issuer: expectedIssuer,
    audience: expectedAudience,
    clockTolerance: 60, // Allow 60 seconds clock skew
  });

  // Validate nonce if provided
  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new Error('Nonce mismatch - possible replay attack');
  }

  // Extract and validate required Dezi claims
  const claims = payload as unknown as DeziClaims;

  if (!claims.dezi_nummer) {
    throw new Error('Missing required claim: dezi_nummer');
  }

  if (!claims.abonnee_nummer) {
    throw new Error('Missing required claim: abonnee_nummer');
  }

  if (!claims.rol_code || !claims.rol_naam) {
    throw new Error('Missing required role claims: rol_code and/or rol_naam');
  }

  return claims;
}

// ============================================================================
// Complete Flow Helper
// ============================================================================

/**
 * Process the complete userinfo flow:
 * 1. Fetch userinfo (JWE)
 * 2. Decrypt JWE to get JWS
 * 3. Verify JWS and extract claims
 * 
 * This is the main function to call after token exchange.
 */
export async function processUserInfo(
  config: DeziOIDCConfig,
  discovery: OIDCDiscoveryDocument,
  accessToken: string,
  expectedNonce?: string
): Promise<DeziClaims> {
  // Fetch the JWE from userinfo endpoint
  const jwe = await fetchUserInfo(discovery.userinfo_endpoint, accessToken);

  // Decrypt the JWE to get the inner JWS
  const jws = await decryptJWE(jwe, config.privateKeyPem);

  // Verify the JWS and extract claims
  const claims = await verifyJWSAndExtractClaims(
    jws,
    discovery.jwks_uri,
    config.issuer,
    config.clientId,
    expectedNonce
  );

  return claims;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Mask sensitive data for display purposes.
 * Shows only the last 4 characters of identifiers.
 */
export function maskSensitiveData(value: string): string {
  if (!value || value.length <= 4) {
    return '****';
  }
  return '*'.repeat(value.length - 4) + value.slice(-4);
}

/**
 * Create a safe version of claims for logging/display.
 * Masks sensitive identifiers.
 */
export function createSafeClaimsForDisplay(claims: DeziClaims): Record<string, unknown> {
  return {
    ...claims,
    dezi_nummer: maskSensitiveData(claims.dezi_nummer),
    abonnee_nummer: maskSensitiveData(claims.abonnee_nummer),
    sub: claims.sub ? maskSensitiveData(claims.sub) : undefined,
  };
}
