/**
 * POST /api/apothecary/generate-content
 *
 * Authenticated Studio endpoint for AI product drafts.
 * Authorises via the caller's Sanity Studio user token (validated server-side).
 * Provider keys stay server-only. Never publishes.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/ai/gateway/rate-limit";
import { authorizeSanityStudioEditor } from "@/lib/apothecary/studio-auth";
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

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeSanityStudioEditor(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const rateCheck = checkRateLimit(`apothecary-ai-${auth.userId}`, true);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI provider unavailable" },
        { status: 503 },
      );
    }

    let body: ProductContentInput;
    try {
      body = (await request.json()) as ProductContentInput;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

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
    console.error("[apothecary/generate-content] generation failed");
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
