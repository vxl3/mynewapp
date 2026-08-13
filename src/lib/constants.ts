/**
 * Shared runtime constants (pure values, no imports).
 * Safe to import from Edge middleware bundles — unlike lib/security, which
 * pulls in Node-only modules (bcryptjs, jsonwebtoken).
 */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const BCRYPT_ROUNDS = 12;
