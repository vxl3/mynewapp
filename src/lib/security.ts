import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Security primitives — password hashing (bcrypt), JWT access/refresh
 * token issuance and verification, and light input sanitization.
 */

export const BCRYPT_ROUNDS = 12;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/** Hash a plaintext password. */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

/** Constant-time compare of a plaintext password against a hash. */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

// ------------------------------------------------------------
// JWT — access + refresh tokens (REST API / future mobile apps)
// ------------------------------------------------------------

export interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: string[];
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: "refresh";
}

function secretOf(type: "access" | "refresh"): string {
  const value =
    type === "access" ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
  if (!value) throw new Error(`JWT_${type.toUpperCase()}_SECRET is not configured`);
  return value;
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, secretOf("access"), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, secretOf("refresh"), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? "30d") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, secretOf("access")) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, secretOf("refresh")) as RefreshTokenPayload;
}

// ------------------------------------------------------------
// Sanitization
// ------------------------------------------------------------

/** Strip control characters and normalize whitespace from user input. */
export function sanitizeText(input: string): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Escape HTML entities to neutralize stored-XSS vectors. */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return input.replace(/[&<>"']/g, (c) => map[c]);
}
