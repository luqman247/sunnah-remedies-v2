/**
 * AI Gateway — Main Query Endpoint.
 *
 * Routes queries to the appropriate AI surface based on the
 * `surface` parameter. Handles auth, rate limiting, streaming,
 * logging, and error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/ai/gateway/rate-limit";
import { logEvent } from "@/ai/analytics";
import { AI_CONFIG } from "@/ai/config";
import type { SurfaceId } from "@/ai/config";
import { queryKnowledgeAssistant } from "@/ai/surfaces/knowledge";
import { queryProductFinder } from "@/ai/surfaces/product-finder";
import { queryConsultationAssistant } from "@/ai/surfaces/consultation";
import { queryCourseAssistant } from "@/ai/surfaces/course";
import {
  addTurn,
  getConversationContext,
  summariseIfNeeded,
} from "@/ai/conversation";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      query,
      surface = "knowledge",
      language = "en",
      sessionId,
      courseId,
      lectureId,
      mode,
      intake,
      currentStep,
      accessLevel = "public",
    } = body as {
      query: string;
      surface: SurfaceId | string;
      language?: string;
      sessionId?: string;
      courseId?: string;
      lectureId?: string;
      mode?: string;
      intake?: Record<string, unknown>;
      currentStep?: number;
      accessLevel?: string;
    };

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    if (query.length > 2000) {
      return NextResponse.json(
        { error: "Query too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rateLimitKey = sessionId || clientIp;
    const rateCheck = checkRateLimit(rateLimitKey, !!sessionId);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // Check feature flag
    if (
      surface in AI_CONFIG.featureFlags &&
      !AI_CONFIG.featureFlags[surface as SurfaceId]
    ) {
      return NextResponse.json(
        { error: "This AI surface is not currently available" },
        { status: 503 }
      );
    }

    // Log query event
    logEvent({
      type: "query",
      surface,
      language,
      sessionId,
      data: { query, surface, language },
    });

    // Add user turn to conversation
    if (sessionId) {
      addTurn(sessionId, { role: "user", content: query, surface });
    }

    // Route to appropriate surface
    let result: unknown;

    switch (surface) {
      case "knowledge":
        result = await queryKnowledgeAssistant({
          query,
          language,
          accessLevel: accessLevel as "public",
          sessionId,
        });
        break;

      case "product_finder":
      case "apothecary":
      case "productFinder":
        result = await queryProductFinder({
          query,
          language,
          accessLevel: accessLevel as "public",
          sessionId,
        });
        break;

      case "consultation":
      case "consultationAssistant":
        result = await queryConsultationAssistant({
          query,
          intake: (intake as Record<string, string[]>) || {},
          currentStep: currentStep ?? 1,
          language,
          accessLevel: accessLevel as "public",
        });
        break;

      case "course":
      case "courseAssistant":
        if (!courseId) {
          return NextResponse.json(
            { error: "courseId is required for course surface" },
            { status: 400 }
          );
        }
        result = await queryCourseAssistant({
          query,
          courseId,
          lectureId,
          mode: (mode as "explain") || "explain",
          language,
          sessionId,
        });
        break;

      default:
        result = await queryKnowledgeAssistant({
          query,
          language,
          accessLevel: accessLevel as "public",
          sessionId,
        });
    }

    const latencyMs = Date.now() - startTime;

    // Add assistant turn to conversation
    const typedResult = result as {
      success: boolean;
      response?: { summary: string; claims: unknown[] };
      escalation?: unknown;
      fallback?: unknown;
    };

    if (sessionId && typedResult.response) {
      addTurn(sessionId, {
        role: "assistant",
        content: typedResult.response.summary,
        surface,
      });
      await summariseIfNeeded(sessionId);
    }

    // Log response
    logEvent({
      type: typedResult.success ? "response" : "fallback",
      surface,
      language,
      sessionId,
      data: {
        latencyMs,
        success: typedResult.success,
        claimCount: typedResult.response?.claims?.length ?? 0,
        hasEscalation: !!typedResult.escalation,
        hasFallback: !!typedResult.fallback,
      },
    });

    return NextResponse.json(result, {
      headers: {
        "X-AI-Latency": String(latencyMs),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const message =
      error instanceof Error ? error.message : "Internal server error";

    logEvent({
      type: "error",
      surface: "unknown",
      language: "en",
      data: { error: message, latencyMs },
    });

    console.error("[AI Gateway Error]", error);

    return NextResponse.json(
      {
        error: "An error occurred processing your request",
        success: false,
      },
      { status: 500 }
    );
  }
}
