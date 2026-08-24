import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number;      // Max requests allowed per window
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((record, key) => {
      if (now > record.resetTime) {
        store.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  keyPrefix: string = "global"
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const record = store.get(key);

  if (!record || now > record.resetTime) {
    // New or expired window
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  if (record.count >= config.max) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return NextResponse.json(
      { error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(config.max),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(record.resetTime / 1000)),
        },
      }
    );
  }

  record.count += 1;
  store.set(key, record);
  return null;
}

// Pre-configured rate limiters per ANTIGRAVITY.md rules
export const authRateLimiter = (req: NextRequest) =>
  checkRateLimit(req, { windowMs: 15 * 60 * 1000, max: 5 }, "auth");

export const generalRateLimiter = (req: NextRequest) =>
  checkRateLimit(req, { windowMs: 60 * 1000, max: 60 }, "general");

export const aiRateLimiter = (req: NextRequest) =>
  checkRateLimit(req, { windowMs: 60 * 1000, max: 10 }, "ai");

export const fileUploadRateLimiter = (req: NextRequest) =>
  checkRateLimit(req, { windowMs: 60 * 1000, max: 5 }, "upload");
