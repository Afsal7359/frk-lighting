/**
 * FRK Lighting Solutions - Secure Admin Authentication & Token Management
 * Uses native Web Crypto API (HMAC-SHA256) compatible with Next.js 16 Proxy,
 * Edge Runtime, and Node.js environments.
 */

export const ADMIN_COOKIE_NAME = 'frk_admin_session';

interface SessionPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

// In-memory rate limiting map for login and public endpoints
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if an IP address has exceeded the request threshold.
 */
export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 10 * 60 * 1000 // 10 minutes
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 2000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfterSec: 0 };
}

function getSecretKey(): string {
  // Use dedicated admin secret or fallback to admin password, or safe default
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'frk-lighting-secure-session-key-2026-prod-jwt-secret'
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed session token valid for 7 days.
 */
export async function createSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const encodedPayload = base64UrlEncode(payloadBytes);

  const key = await getCryptoKey(getSecretKey());
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(encodedPayload)
  );
  const encodedSignature = base64UrlEncode(signatureBuffer);

  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies a signed session token. Returns the payload if valid and not expired, or null otherwise.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;
  if (!encodedPayload || !encodedSignature) return null;

  try {
    const encoder = new TextEncoder();
    const key = await getCryptoKey(getSecretKey());
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as Uint8Array<ArrayBuffer>,
      encoder.encode(encodedPayload)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const decoder = new TextDecoder();
    const payload: SessionPayload = JSON.parse(decoder.decode(payloadBytes));

    if (!payload || payload.role !== 'admin') return null;
    if (payload.exp < Date.now()) return null; // Expired

    return payload;
  } catch (err) {
    return null;
  }
}
