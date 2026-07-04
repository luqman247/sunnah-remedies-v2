/**
 * AI Session Management Endpoint.
 *
 * Supports GDPR data subject rights: access, erasure.
 * Session data inspection and deletion.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  deleteSession,
  deleteUserSessions,
  cleanupExpiredSessions,
} from "@/ai/conversation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Session not found or expired" },
      { status: 404 }
    );
  }

  // Return inspectable session data (GDPR: right of access)
  return NextResponse.json({
    id: session.id,
    surface: session.surface,
    language: session.language,
    turnCount: session.turns.length,
    createdAt: new Date(session.createdAt).toISOString(),
    lastActivity: new Date(session.lastActivityAt).toISOString(),
    turns: session.turns.map((t) => ({
      role: t.role,
      content: t.content,
      timestamp: new Date(t.timestamp).toISOString(),
    })),
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId");

  // GDPR: right to erasure
  if (userId) {
    const count = deleteUserSessions(userId);
    return NextResponse.json({
      success: true,
      deleted: count,
      message: `Deleted ${count} sessions for user`,
    });
  }

  if (sessionId) {
    const deleted = deleteSession(sessionId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? "Session deleted" : "Session not found",
    });
  }

  // Cleanup expired sessions
  const cleaned = cleanupExpiredSessions();
  return NextResponse.json({
    success: true,
    cleaned,
    message: `Cleaned ${cleaned} expired sessions`,
  });
}
