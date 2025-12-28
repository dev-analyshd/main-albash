/**
 * Rate Limiting Middleware for Next.js
 * Provides IP-based and User-ID based rate limiting
 * Uses in-memory store (suitable for single-server deployments)
 * For distributed systems, upgrade to Redis backend
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   * @param key Unique identifier (IP, user ID, etc.)
   * @param limit Max requests allowed in window
   * @param windowMs Time window in milliseconds
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(
    key: string,
    limit: number = 100,
    windowMs: number = 60 * 1000 // 1 minute default
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    // Key doesn't exist or window expired
    if (!entry || now >= entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
      };
    }

    // Key exists and within window
    if (entry.count < limit) {
      entry.count++;
      return {
        allowed: true,
        remaining: limit - entry.count,
        resetTime: entry.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get current count for a key
   */
  getCount(key: string): number {
    const entry = this.store.get(key);
    if (!entry || Date.now() >= entry.resetTime) {
      return 0;
    }
    return entry.count;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (now >= entry.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.store.delete(key);
    });

    if (keysToDelete.length > 0) {
      console.debug(`Rate limiter: cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Destroy the limiter and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Rate limit preset configurations
 */
export const rateLimitPresets = {
  // Public endpoints (loose limits)
  public: {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Authenticated user endpoints (moderate limits)
  authenticated: {
    limit: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Login/signup (strict limits)
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Payment endpoints (strict limits)
  payment: {
    limit: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  // Search endpoints (moderate limits)
  search: {
    limit: 50,
    windowMs: 60 * 1000, // 1 minute
  },
  // API endpoints (moderate limits)
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  },
};
