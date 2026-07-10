/**
 * POST /api/apothecary/generate-content
 *
 * Authenticated Studio/admin endpoint for AI product drafts.
 * Never publishes — returns draft payload for the editor to review.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/ai/gateway/rate-limit";
import {
  generateProductContent,
  type ProductContentAction,
  type ProductContentInput,
} from "@/lib/apothecary/ai-content";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACTIONS = new Set<ProductContentAction>([
  "generate_description",
  "make_shorter",
  "make_detailed",
  "make_clinical",
  "make_editorial",
  "translate_da",
  "improve_seo",
  "generate_faqs",
  "generate_alt_text",
]);

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const expected =
    process.env.AI_ADMIN_TOKEN || process.env.SANITY_STUDIO_AI_ADMIN_TOKEN;
  if (!expected) return false;
  return authHeader === `Bearer ${expected}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit(`apothecary-ai-${clientIp}`, true);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI provider unavailable" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ProductContentInput;
    if (!body?.name || !body?.action || !ACTIONS.has(body.action)) {
      return NextResponse.json(
        { error: "name and a valid action are required" },
        { status: 400 },
      );
    }

    const draft = await generateProductContent(body);
    return NextResponse.json({
      draft,
      notice: "AI generated — review required. Not published.",
    });
  } catch (error) {
    console.error("[apothecary/generate-content]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
