/**
 * Conversation Architecture (§8).
 *
 * Session-scoped history with rolling summarisation.
 * Short-term memory by default; longer-term memory is
 * explicit, consented, and inspectable/erasable.
 */

import { AI_CONFIG } from "../config";
import { getGenerationProvider } from "../generation/provider";

/* ── Types ───────────────────────────────────────────────────────── */

export interface ConversationTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  surface: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationSession {
  id: string;
  surface: string;
  accessLevel: string;
  language: string;
  turns: ConversationTurn[];
  summary?: string;
  createdAt: number;
  lastActivityAt: number;
  userId?: string;
}

/* ── In-Memory Session Store ─────────────────────────────────────── */

const sessions = new Map<string, ConversationSession>();

export function createSession(
  sessionId: string,
  surface: string,
  accessLevel: string,
  language: string,
  userId?: string
): ConversationSession {
  const session: ConversationSession = {
    id: sessionId,
    surface,
    accessLevel,
    language,
    turns: [],
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    userId,
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): ConversationSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  // Check timeout
  const elapsed = Date.now() - session.lastActivityAt;
  if (elapsed > AI_CONFIG.conversation.sessionTimeoutMs) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function addTurn(
  sessionId: string,
  turn: Omit<ConversationTurn, "id" | "timestamp">
): ConversationTurn {
  let session = sessions.get(sessionId);
  if (!session) {
    session = createSession(sessionId, turn.surface, "public", "en");
  }

  const fullTurn: ConversationTurn = {
    ...turn,
    id: `turn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  session.turns.push(fullTurn);
  session.lastActivityAt = Date.now();

  return fullTurn;
}

/* ── History Formatting ──────────────────────────────────────────── */

export function getConversationContext(
  sessionId: string
): string {
  const session = sessions.get(sessionId);
  if (!session) return "";

  const maxTurns = AI_CONFIG.conversation.maxHistoryTurns;
  const recentTurns = session.turns.slice(-maxTurns);

  if (session.summary && session.turns.length > maxTurns) {
    return `Previous conversation summary: ${session.summary}\n\nRecent conversation:\n${formatTurns(recentTurns)}`;
  }

  return formatTurns(recentTurns);
}

function formatTurns(turns: ConversationTurn[]): string {
  return turns
    .map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.content}`)
    .join("\n\n");
}

/* ── Rolling Summarisation ───────────────────────────────────────── */

export async function summariseIfNeeded(sessionId: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) return;

  const threshold = AI_CONFIG.conversation.summariseAfterTurns;
  if (session.turns.length <= threshold) return;

  const provider = getGenerationProvider();
  const turnsToSummarise = session.turns.slice(0, -threshold);

  const response = await provider.generate({
    systemPrompt:
      "You are a conversation summariser. Produce a concise summary of the conversation so far, " +
      "preserving key topics discussed, questions asked, answers given, and any ongoing context.",
    userMessage: `Summarise this conversation:\n\n${formatTurns(turnsToSummarise)}`,
    maxTokens: 500,
  });

  session.summary = response.content;
  session.turns = session.turns.slice(-threshold);
}

/* ── Session Cleanup ─────────────────────────────────────────────── */

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function deleteUserSessions(userId: string): number {
  let count = 0;
  for (const [id, session] of sessions) {
    if (session.userId === userId) {
      sessions.delete(id);
      count++;
    }
  }
  return count;
}

export function cleanupExpiredSessions(): number {
  const now = Date.now();
  const timeout = AI_CONFIG.conversation.sessionTimeoutMs;
  let count = 0;

  for (const [id, session] of sessions) {
    if (now - session.lastActivityAt > timeout) {
      sessions.delete(id);
      count++;
    }
  }

  return count;
}
