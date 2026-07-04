/**
 * AI Translation Endpoint.
 *
 * Governed translation preserving medical terminology,
 * Islamic terminology, and Arabic quotations.
 */

import { NextRequest, NextResponse } from "next/server";
import { translate, translateBatch } from "@/ai/surfaces/translation";
import { checkRateLimit } from "@/ai/gateway/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit(`translate-${clientIp}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { content, sourceLanguage, targetLanguage, batch, contentType, preserveLinks, preserveMetadata } = body as {
      content?: string;
      sourceLanguage: string;
      targetLanguage: string;
      batch?: { content: string; sourceLanguage: string; targetLanguage: string }[];
      contentType?: string;
      preserveLinks?: boolean;
      preserveMetadata?: boolean;
    };

    if (batch && Array.isArray(batch)) {
      const results = await translateBatch(
        batch.map((item) => ({
          content: item.content,
          sourceLanguage: item.sourceLanguage,
          targetLanguage: item.targetLanguage,
          contentType: (contentType as "general") || "general",
          preserveLinks,
          preserveMetadata,
        }))
      );
      return NextResponse.json({ success: true, results });
    }

    if (!content || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "content, sourceLanguage, and targetLanguage are required" },
        { status: 400 }
      );
    }

    const result = await translate({
      content,
      sourceLanguage,
      targetLanguage,
      contentType: (contentType as "general") || "general",
      preserveLinks,
      preserveMetadata,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Translation Error]", error);
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
