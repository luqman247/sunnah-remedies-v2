/**
 * "Scholar Review" portal — application-level access control.
 *
 * Two cookies, both HTTP-only, both scoped to /scholar-review only:
 *   - sr_access:  set once SCHOLAR_REVIEW_ACCESS_CODE has been entered
 *                 correctly. HMAC-signed (keyed on the access code itself)
 *                 so a visitor cannot fabricate it without knowing the
 *                 code.
 *   - sr_session: set once reviewer identity has been captured, carrying
 *                 the scholarlyReviewSession document _id (an unguessable
 *                 random UUID — see review-records.ts's createReviewSession).
 *
 * SCHOLAR_REVIEW_ACCESS_CODE has no NEXT_PUBLIC_ prefix — Next.js never
 * bundles it into client JavaScript. It is read here, server-side, only.
 *
 * Attempt limiting: a signed, cookie-based counter (see checkAttemptLimit /
 * recordFailedAttempt). This is a conservative, self-contained safeguard —
 * it raises the bar against casual guessing without adding new
 * infrastructure (e.g. Upstash Redis) whose env vars aren't confirmed
 * configured for this project. It is not a substitute for a strong access
 * code, and a visitor who clears cookies resets their own counter — this
 * limitation is deliberate and documented, not hidden.
 */

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ACCESS_COOKIE_NAME = "sr_access";
const SESSION_COOKIE_NAME = "sr_session";
const ATTEMPTS_COOKIE_NAME = "sr_attempts";
const COOKIE_PATH = "/scholar-review";

const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getAccessCode(): string | undefined {
  const code = process.env.SCHOLAR_REVIEW_ACCESS_CODE;
  return code && code.length > 0 ? code : undefined;
}

export function isAccessCodeConfigured(): boolean {
  return !!getAccessCode();
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAccessCodeInput(input: string): boolean {
  const code = getAccessCode();
  if (!code) return false;
  return safeEqual(input.trim(), code);
}

export async function grantAccess(): Promise<void> {
  const code = getAccessCode();
  if (!code) throw new Error("SCHOLAR_REVIEW_ACCESS_CODE is not configured.");
  const value = "granted";
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, `${value}.${sign(value, code)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 60 * 60 * 24 * 14,
  });
  cookieStore.delete(ATTEMPTS_COOKIE_NAME);
}

export async function hasAccess(): Promise<boolean> {
  const code = getAccessCode();
  if (!code) return false;
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  if (!raw) return false;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return false;
  const value = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (value !== "granted") return false;
  const expected = sign(value, code);
  return safeEqual(sig, expected);
}

export async function revokeAccess(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 60 * 60 * 24 * 60,
  });
}

export async function getSessionIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  // Defensive: only ever trust a value shaped like our own generated ids.
  if (value && /^scholarlyReviewSession-[a-f0-9-]{36}$/.test(value)) return value;
  return undefined;
}

interface AttemptState {
  count: number;
  windowStart: number;
}

function parseAttempts(raw: string | undefined, key: string): AttemptState {
  if (!raw) return { count: 0, windowStart: Date.now() };
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return { count: 0, windowStart: Date.now() };
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!safeEqual(sig, sign(payload, key))) return { count: 0, windowStart: Date.now() };
  const [countStr, windowStr] = payload.split(":");
  const count = Number.parseInt(countStr, 10);
  const windowStart = Number.parseInt(windowStr, 10);
  if (!Number.isFinite(count) || !Number.isFinite(windowStart)) return { count: 0, windowStart: Date.now() };
  return { count, windowStart };
}

export async function checkAttemptLimit(): Promise<{ allowed: boolean; remaining: number }> {
  const code = getAccessCode();
  if (!code) return { allowed: false, remaining: 0 };
  const cookieStore = await cookies();
  const state = parseAttempts(cookieStore.get(ATTEMPTS_COOKIE_NAME)?.value, code);
  const withinWindow = Date.now() - state.windowStart < ATTEMPT_WINDOW_MS;
  if (!withinWindow) return { allowed: true, remaining: MAX_ATTEMPTS };
  return { allowed: state.count < MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - state.count) };
}

export async function recordFailedAttempt(): Promise<void> {
  const code = getAccessCode();
  if (!code) return;
  const cookieStore = await cookies();
  const existing = parseAttempts(cookieStore.get(ATTEMPTS_COOKIE_NAME)?.value, code);
  const withinWindow = Date.now() - existing.windowStart < ATTEMPT_WINDOW_MS;
  const next: AttemptState = withinWindow
    ? { count: existing.count + 1, windowStart: existing.windowStart }
    : { count: 1, windowStart: Date.now() };
  const payload = `${next.count}:${next.windowStart}`;
  cookieStore.set(ATTEMPTS_COOKIE_NAME, `${payload}.${sign(payload, code)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 60 * 60,
  });
}
