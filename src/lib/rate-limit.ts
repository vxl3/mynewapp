/**
 * In-memory sliding-window rate limiter.
 *
 * Used by middleware for auth-endpoint protection. For multi-instance
 * deployments this can be swapped for a centralized store (Redis) behind
 * the same interface without touching call sites.
 */

interface WindowEntry {
  timestamps: number[];
}

const buckets = new Map<string, WindowEntry>();

/** Prune stale timestamps and enforce the limit. Returns whether allowed. */
export function slidingWindowRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = buckets.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    buckets.set(key, entry);
    return { success: false, retryAfterMs: Math.max(0, windowMs - (now - oldest)) };
  }

  entry.timestamps.push(now);
  buckets.set(key, entry);

  // Opportunistic cleanup to bound memory usage.
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      v.timestamps = v.timestamps.filter((t) => now - t < windowMs);
      if (v.timestamps.length === 0) buckets.delete(k);
    }
  }

  return { success: true, retryAfterMs: 0 };
}
