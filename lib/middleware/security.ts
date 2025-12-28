/**
 * CORS and Security Headers Middleware for Next.js
 */
import { NextRequest, NextResponse } from "next/server";

/**
 * Allowed origins for CORS
 * Add your frontend domains here
 */
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "https://albash.com",
      "https://www.albash.com",
    ];

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  // Allow exact matches
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // Allow localhost in development
  if (process.env.NODE_ENV === "development" && origin.includes("localhost")) {
    return true;
  }

  return false;
}

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const origin = request.headers.get("origin");

  if (isOriginAllowed(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
  }

  return response;
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (formerly Feature-Policy)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy (basic)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Allow Next.js & inline scripts
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  response.headers.set("Content-Security-Policy", csp.join("; "));

  return response;
}

/**
 * Validate request headers and content type
 */
export function validateRequestHeaders(
  request: NextRequest,
  expectedContentType?: string
): { valid: boolean; error?: string } {
  const contentType = request.headers.get("content-type");

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (expectedContentType && !contentType?.includes(expectedContentType)) {
      return {
        valid: false,
        error: `Expected Content-Type: ${expectedContentType}`,
      };
    }
  }

  // Check for suspicious headers
  const userAgent = request.headers.get("user-agent") || "";
  if (userAgent.length > 500) {
    return {
      valid: false,
      error: "Invalid User-Agent header",
    };
  }

  return { valid: true };
}

/**
 * Check for basic SQL injection patterns in query strings
 * Note: This is a basic check - use parameterized queries instead
 */
export function hasSqlInjectionPatterns(value: string): boolean {
  const patterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(-{2}|\/\*|\*\/|xp_|sp_)/,
    /(;|\||&&)/,
  ];

  return patterns.some((pattern) => pattern.test(value));
}

/**
 * Sanitize query parameters
 */
export function sanitizeQueryParams(
  params: Record<string, any>
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      // Trim whitespace
      let clean = value.trim();

      // Limit length
      if (clean.length > 1000) {
        clean = clean.substring(0, 1000);
      }

      sanitized[key] = clean;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) =>
        typeof v === "string" ? v.trim().substring(0, 1000) : v
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
