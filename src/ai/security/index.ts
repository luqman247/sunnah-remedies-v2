/**
 * AI Security Module (§11).
 *
 * Authentication, authorization, audit logging, and
 * prompt injection defence for the AI layer.
 */

import type { AccessLevel } from "../evidence-engine/types";

/* ── Auth Verification ───────────────────────────────────────────── */

export interface AiAuthContext {
  userId?: string;
  accessLevel: AccessLevel;
  roles: string[];
  sessionId?: string;
  ip: string;
}

export function resolveAuthContext(headers: Headers): AiAuthContext {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // In production, verify JWT/session token here
  const authToken = headers.get("authorization")?.replace("Bearer ", "");

  if (!authToken) {
    return { accessLevel: "public", roles: ["public"], ip };
  }

  // Placeholder for full auth verification
  return {
    userId: authToken,
    accessLevel: "registered",
    roles: ["registered"],
    sessionId: headers.get("x-session-id") || undefined,
    ip,
  };
}

/* ── Access Control ──────────────────────────────────────────────── */

const ACCESS_HIERARCHY: Record<AccessLevel, number> = {
  public: 0,
  registered: 1,
  student: 2,
  practitioner: 3,
  editor: 4,
  clinician: 5,
  admin: 6,
};

export function hasAccess(
  userLevel: AccessLevel,
  requiredLevel: AccessLevel
): boolean {
  return ACCESS_HIERARCHY[userLevel] >= ACCESS_HIERARCHY[requiredLevel];
}

/* ── Audit Logging ───────────────────────────────────────────────── */

export interface AuditEntry {
  timestamp: number;
  action: string;
  userId?: string;
  ip: string;
  surface: string;
  query?: string;
  result: "success" | "denied" | "error" | "escalation";
  metadata?: Record<string, unknown>;
}

const auditLog: AuditEntry[] = [];

export function logAudit(entry: Omit<AuditEntry, "timestamp">): void {
  const fullEntry: AuditEntry = { ...entry, timestamp: Date.now() };
  auditLog.push(fullEntry);

  // In production, send to a durable, tamper-evident log store
  if (entry.result === "denied" || entry.result === "escalation") {
    console.warn("[AI Audit]", JSON.stringify(fullEntry));
  }
}

export function getAuditLog(limit: number = 100): AuditEntry[] {
  return auditLog.slice(-limit);
}

/* ── Prompt Injection Defence (§11.1) ────────────────────────────── */

export function sanitiseForContext(text: string): string {
  // Treat all retrieved content and user input as DATA, not instructions
  // Remove any instruction-like patterns from content before it enters context
  let result = text;
  result = result.replace(/\[INST\][^]*?\[\/INST\]/g, "");
  result = result.replace(/<\|.*?\|>/g, "");
  result = result.replace(/\{\{.*?\}\}/g, "");
  result = result.replace(/system\s*:\s*/gi, "content: ");
  return result;
}

/* ── Secret Validation ───────────────────────────────────────────── */

export function validateRequiredSecrets(): {
  valid: boolean;
  missing: string[];
} {
  const required = [
    "ANTHROPIC_API_KEY",
    "OPENAI_API_KEY",
    "PINECONE_API_KEY",
    "PINECONE_INDEX_NAME",
    "AI_ADMIN_TOKEN",
  ];

  const missing = required.filter((key) => !process.env[key]);
  return { valid: missing.length === 0, missing };
}
