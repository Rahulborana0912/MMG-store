/**
 * MMG PRODUCTION RATE LIMITING ENGINE
 * 
 * Architecture:
 * 1. Single-Process / VPS / Container: Fast in-memory token bucket.
 * 2. Serverless / Multi-Instance (Vercel/AWS Lambda): Distributed rate limiting
 *    via Upstash Redis REST API when UPSTASH_REDIS_REST_URL is configured.
 * 
 * Note: Free-tier quotas on third-party services are subject to provider limits
 * and pricing changes.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryTracker = new Map<string, RateLimitRecord>();

/**
 * Checks rate limits for sensitive public routes (login, enquiries, requirements)
 * 
 * @param key Identifier (e.g. `ip:endpoint`)
 * @param maxRequests Maximum allowed requests in window (default 20)
 * @param windowMs Window size in milliseconds (default 60000ms = 1 min)
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = memoryTracker.get(key);

  if (!record || now > record.resetAt) {
    memoryTracker.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: maxRequests - record.count };
}

/**
 * Distributed rate limiter for serverless deployments (async)
 */
export async function checkDistributedRateLimit(
  key: string,
  maxRequests: number = 20,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Fallback to in-memory if Redis credentials are not configured
  if (!redisUrl || !redisToken) {
    return checkRateLimit(key, maxRequests, windowSeconds * 1000);
  }

  try {
    const res = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', `ratelimit:${key}`],
        ['EXPIRE', `ratelimit:${key}`, windowSeconds],
      ]),
    });

    if (!res.ok) {
      return checkRateLimit(key, maxRequests, windowSeconds * 1000);
    }

    const data = await res.json();
    const count = data[0]?.result || 1;

    if (count > maxRequests) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: Math.max(0, maxRequests - count) };
  } catch {
    // Graceful fallback to memory on network blip
    return checkRateLimit(key, maxRequests, windowSeconds * 1000);
  }
}
