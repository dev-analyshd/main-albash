/**
 * Helper functions to apply rate limiting and security to API endpoints
 */
import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiter,
  getClientIp,
  rateLimitPresets,
  type rateLimitPresets as RateLimitPresetsType,
} from "@/lib/middleware/rate-limit";
import {
  applyCorsHeaders,
  applySecurityHeaders,
  validateRequestHeaders,
} from "@/lib/middleware/security";

/**
 * Wrap an API handler with rate limiting and security checks
 */
export async function withRateLimitAndSecurity(
  handler: (req: NextRequest) => Promise<Response>,
  options?: {
    preset?: keyof typeof rateLimitPresets;
    customLimit?: number;
    customWindow?: number;
    requireAuth?: boolean;
    expectedContentType?: string;
  }
) {
  return async (request: NextRequest) => {
    try {
      // Get rate limit config
      const preset = rateLimitPresets[options?.preset || "api"];
      const limit = options?.customLimit || preset.limit;
      const windowMs = options?.customWindow || preset.windowMs;

      // Get client identifier
      const clientIp = getClientIp(request);

      // Check rate limit
      const rateLimitResult = rateLimiter.check(clientIp, limit, windowMs);

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          {
            error: "Rate limit exceeded",
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          },
          { status: 429 }
        );

        response.headers.set("Retry-After", String(rateLimitResult.resetTime));
        response.headers.set(
          "X-RateLimit-Limit",
          String(limit)
        );
        response.headers.set("X-RateLimit-Remaining", "0");

        return applyCorsHeaders(request, response);
      }

      // Validate headers
      const validation = validateRequestHeaders(
        request,
        options?.expectedContentType
      );
      if (!validation.valid) {
        const response = NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
        return applyCorsHeaders(request, response);
      }

      // Call the actual handler
      let response = await handler(request);

      // Ensure it's a NextResponse
      if (!(response instanceof NextResponse)) {
        response = NextResponse.json(response);
      }

      // Add rate limit headers
      response.headers.set("X-RateLimit-Limit", String(limit));
      response.headers.set(
        "X-RateLimit-Remaining",
        String(rateLimitResult.remaining)
      );
      response.headers.set(
        "X-RateLimit-Reset",
        String(rateLimitResult.resetTime)
      );

      // Apply security headers
      response = applySecurityHeaders(response);

      // Apply CORS headers
      response = applyCorsHeaders(request, response);

      return response;
    } catch (error) {
      console.error("API handler error:", error);
      const response = NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );

      applySecurityHeaders(response);
      return applyCorsHeaders(request, response);
    }
  };
}

/**
 * Simple middleware to check CORS and reject if not allowed
 */
export function checkCorsOrigin(request: NextRequest): NextResponse | null {
  // Only check for non-GET requests
  if (request.method === "GET" || request.method === "HEAD") {
    return null; // OK, continue
  }

  const origin = request.headers.get("origin");
  const { isOriginAllowed } = require("@/lib/middleware/security");

  if (!origin || !isOriginAllowed(origin)) {
    return NextResponse.json(
      { error: "CORS policy violation" },
      { status: 403 }
    );
  }

  return null; // OK, continue
}

/**
 * Handle OPTIONS (CORS preflight) requests
 */
export function handleCorsPreFlight(request: NextRequest): NextResponse | null {
  if (request.method !== "OPTIONS") {
    return null; // Not a preflight request
  }

  const response = new NextResponse(null, { status: 204 });
  return applyCorsHeaders(request, response);
}
