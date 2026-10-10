import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export const GOOGLE_SESSION_COOKIE = "aurum_google_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
};

export type SessionClaims = {
  sub: string;
  email: string;
  loginMethod: "google";
  sid: string;
};

function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
}

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "";
}

let oauthClient: OAuth2Client | null = null;
function client(): OAuth2Client {
  if (!oauthClient) oauthClient = new OAuth2Client();
  return oauthClient;
}

/**
 * Verify a Google ID token (credential from GIS button) server-side.
 * Checks signature, audience == OUR client ID, issuer, expiry.
 * Never trust client-supplied email — everything comes from this payload.
 */
export async function verifyGoogleIdToken(
  credential: string
): Promise<GoogleProfile> {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured.");
  const ticket = await client().verifyIdToken({
    idToken: credential,
    audience: clientId,
  });
  const p = ticket.getPayload();
  if (!p || !p.sub || !p.email) throw new Error("Invalid Google credential.");
  const issOk = p.iss === "accounts.google.com" || p.iss === "https://accounts.google.com";
  if (!issOk) throw new Error("Invalid credential issuer.");
  if (p.aud !== clientId) throw new Error("Credential audience mismatch.");
  if (p.email_verified === false) throw new Error("Google email is not verified.");
  return {
    sub: p.sub,
    email: p.email,
    emailVerified: true,
    name: (p.name as string) ?? null,
    picture: (p.picture as string) ?? null,
  };
}

/** Sign a short-lived session JWT (HS256). Secret never leaves the server. */
export function signSession(claims: SessionClaims): string {
  const secret = getSessionSecret();
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short (min 32 chars).");
  }
  return jwt.sign(claims, secret, {
    algorithm: "HS256",
    issuer: "aurum-wallet",
    audience: "google-login",
    expiresIn: SESSION_MAX_AGE,
    jwtid: claims.sid,
  });
}

export function verifySession(token: string): SessionClaims {
  const secret = getSessionSecret();
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  const decoded = jwt.verify(token, secret, {
    algorithms: ["HS256"],
    issuer: "aurum-wallet",
    audience: "google-login",
  }) as jwt.JwtPayload & Partial<SessionClaims>;
  if (!decoded.sub || typeof decoded.sub !== "string") {
    throw new Error("Invalid session.");
  }
  return {
    sub: decoded.sub,
    email: typeof decoded.email === "string" ? decoded.email : "",
    loginMethod: "google",
    sid: typeof decoded.jti === "string" ? decoded.jti : "",
  };
}

export function buildSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${GOOGLE_SESSION_COOKIE}=${token}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${GOOGLE_SESSION_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function readSessionCookie(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === GOOGLE_SESSION_COOKIE) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}
