import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";

import type { AppConfig } from "./config.js";

const cookieName = "family_registry_session";
const sessionMaxAgeSeconds = 60 * 60 * 12;
const loginWindowMs = 15 * 60 * 1000;
const maxFailedLogins = 8;

type LoginAttempt = {
  count: number;
  resetAt: number;
};

export type AuthController = {
  requireAuth: (request: Request, response: Response, next: NextFunction) => void;
  required: boolean;
  router: Router;
};

const attempts = new Map<string, LoginAttempt>();

export function createAuthController(config: AppConfig): AuthController {
  const router = Router();
  const required = Boolean(config.APP_ADMIN_PASSWORD);

  router.get("/status", (request, response) => {
    response.json({
      authenticated: !required || isAuthenticated(request, config),
      authRequired: required
    });
  });

  router.post("/login", (request, response) => {
    if (!required) {
      response.json({ authenticated: true, authRequired: false });
      return;
    }

    const key = request.ip || "unknown";
    const attempt = attempts.get(key);

    if (attempt && attempt.count >= maxFailedLogins && attempt.resetAt > Date.now()) {
      response.status(429).json({
        error: {
          code: "too_many_login_attempts",
          message: "Too many login attempts. Try again later."
        }
      });
      return;
    }

    const password = typeof request.body?.password === "string" ? request.body.password : "";

    if (!constantTimeEqual(password, config.APP_ADMIN_PASSWORD ?? "", config.SESSION_SECRET ?? "")) {
      recordFailedAttempt(key);
      response.status(401).json({
        error: {
          code: "invalid_login",
          message: "Password is incorrect."
        }
      });
      return;
    }

    attempts.delete(key);
    response.setHeader("Set-Cookie", buildSessionCookie(config));
    response.json({ authenticated: true, authRequired: true });
  });

  router.post("/logout", (_request, response) => {
    response.setHeader("Set-Cookie", clearSessionCookie(config));
    response.json({ authenticated: false, authRequired: required });
  });

  function requireAuth(request: Request, response: Response, next: NextFunction) {
    if (!required || isAuthenticated(request, config)) {
      next();
      return;
    }

    response.status(401).json({
      error: {
        code: "authentication_required",
        message: "Login is required to access family registry data."
      }
    });
  }

  return {
    requireAuth,
    required,
    router
  };
}

function buildSessionCookie(config: AppConfig): string {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const value = `v1.${expiresAt}.${sign(String(expiresAt), config.SESSION_SECRET ?? "")}`;
  const parts = [
    `${cookieName}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${sessionMaxAgeSeconds}`
  ];

  if (config.APP_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function clearSessionCookie(config: AppConfig): string {
  const parts = [
    `${cookieName}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0"
  ];

  if (config.APP_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function constantTimeEqual(left: string, right: string, secret: string): boolean {
  const leftDigest = createHmac("sha256", secret).update(left).digest();
  const rightDigest = createHmac("sha256", secret).update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function isAuthenticated(request: Request, config: AppConfig): boolean {
  const cookie = parseCookieHeader(request.headers.cookie ?? "").get(cookieName);

  if (!cookie) {
    return false;
  }

  const [version, expiresAtRaw, signature] = cookie.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (version !== "v1" || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  return constantTimeEqual(signature ?? "", sign(String(expiresAt), config.SESSION_SECRET ?? ""), config.SESSION_SECRET ?? "");
}

function parseCookieHeader(header: string): Map<string, string> {
  const result = new Map<string, string>();

  for (const part of header.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");

    if (!name || valueParts.length === 0) {
      continue;
    }

    try {
      result.set(name, decodeURIComponent(valueParts.join("=")));
    } catch {
      continue;
    }
  }

  return result;
}

function recordFailedAttempt(key: string): void {
  const current = attempts.get(key);

  if (!current || current.resetAt <= Date.now()) {
    attempts.set(key, {
      count: 1,
      resetAt: Date.now() + loginWindowMs
    });
    return;
  }

  attempts.set(key, {
    count: current.count + 1,
    resetAt: current.resetAt
  });
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}
