/**
 * AI Editorial Endpoint — For Sanity Studio Plugin (§7.7 / Milestone 11).
 *
 * Provides editorial AI tools: summary generation, link suggestions,
 * FAQ generation, SEO descriptions, claim flagging, duplicate detection.
 */

import { NextRequest, NextResponse } from "next/server";
import { getGenerationProvider } from "@/ai/generation/provider";
import { assembleSystemPrompt } from "@/ai/prompts";
import { parseQuery, hybridSearch } from "@/ai/retrieval/hybrid";
import { checkRateLimit } from "@/ai/gateway/rate-limit";
import { authorizeSanityStudioEditor } from "@/lib/apothecary/studio-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

type EditorialAction =
  | "generate_summary"
  | "suggest_links"
  | "generate_faqs"
  | "seo_description"
  | "og_description"
  | "suggest_citations"
  | "flag_unsupported_claims"
  | "detect_duplicates"
  | "readability_review";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeSanityStudioEditor(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const rateCheck = checkRateLimit(`editorial-${auth.userId}`, true);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const { action, content, title, docType, language = "en" } = body as {
      action: EditorialAction;
      content: string;
      title?: string;
      docType?: string;
      language?: string;
    };

    if (!action || !content) {
      return NextResponse.json(
        { error: "action and content are required" },
        { status: 400 }
      );
    }

    const provider = getGenerationProvider();
    const systemPrompt = assembleSystemPrompt("editorial");

    let userMessage: string;
    let responseFormat: "json" | "text" = "json";

    switch (action) {
      case "generate_summary":
        userMessage = `Generate a concise institutional summary (2-3 sentences) for the following content.
Title: ${title || "Untitled"}
Content: ${content.slice(0, 4000)}

Return JSON: {"summary": "..."}`;
        break;

      case "suggest_links":
        userMessage = `Suggest internal links for the following content. Only suggest links to existing institutional content.
Content: ${content.slice(0, 4000)}

Return JSON: {"links": [{"text": "anchor text", "suggestedTarget": "/path/to/page", "reason": "..."}]}`;
        break;

      case "generate_faqs":
        userMessage = `Generate 3-5 frequently asked questions based on this content. Each answer should be sourced from the content.
Title: ${title || ""}
Content: ${content.slice(0, 4000)}

Return JSON: {"faqs": [{"question": "...", "answer": "..."}]}`;
        break;

      case "seo_description":
        userMessage = `Write an SEO meta description (120-155 characters) for this content. Be factual and institutional.
Title: ${title || ""}
Content: ${content.slice(0, 2000)}

Return JSON: {"description": "...", "characters": 0}`;
        break;

      case "og_description":
        userMessage = `Write an OpenGraph description (80-120 characters) for social sharing. Institutional voice.
Title: ${title || ""}
Content: ${content.slice(0, 2000)}

Return JSON: {"description": "...", "characters": 0}`;
        break;

      case "suggest_citations":
        userMessage = `Identify claims in this content that should have citations. Suggest what type of citation is needed.
Content: ${content.slice(0, 4000)}

Return JSON: {"suggestions": [{"claim": "...", "citationType": "hadith|quran|research|scholarly", "reason": "..."}]}`;
        break;

      case "flag_unsupported_claims": {
        // Run claims against the corpus using retrieval
        const parsedQuery = parseQuery(content.slice(0, 500), {
          language,
          accessLevel: "editor",
        });
        const searchResults = await hybridSearch(parsedQuery);
        const retrievedContent = searchResults.chunks
          .map((c) => c.content)
          .join("\n");

        userMessage = `Review this content for unsupported claims. Compare each substantive claim against the institutional corpus provided.

CONTENT TO REVIEW:
${content.slice(0, 3000)}

INSTITUTIONAL CORPUS (retrieved):
${retrievedContent.slice(0, 3000)}

Flag any claim that:
1. Has no supporting source in the corpus
2. Makes health claims without evidence
3. Attributes statements without citations

Return JSON: {"flags": [{"claim": "...", "status": "unsupported|partially_supported|supported", "reason": "...", "suggestedAction": "..."}]}`;
        break;
      }

      case "detect_duplicates": {
        const parsedQuery = parseQuery(
          (title || "") + " " + content.slice(0, 200),
          { language, accessLevel: "editor" }
        );
        const searchResults = await hybridSearch(parsedQuery);
        const similarContent = searchResults.chunks.slice(0, 5);

        userMessage = `Check if this content duplicates or significantly overlaps with existing institutional content.

NEW CONTENT:
Title: ${title || ""}
${content.slice(0, 2000)}

SIMILAR EXISTING CONTENT:
${similarContent.map((c) => `[${c.envelope.sanityDocId}] ${c.content.slice(0, 500)}`).join("\n\n")}

Return JSON: {"duplicates": [{"existingDocId": "...", "overlapPercentage": 0, "recommendation": "merge|differentiate|keep"}], "isLikelyDuplicate": false}`;
        break;
      }

      case "readability_review":
        userMessage = `Review this content for readability. Consider:
- Clarity and conciseness
- Appropriate complexity for the audience
- Logical flow
- Passive voice usage
- Sentence length variety

Content: ${content.slice(0, 4000)}

Return JSON: {"score": 0-100, "grade": "excellent|good|fair|needs_work", "issues": [{"type": "...", "description": "...", "suggestion": "..."}]}`;
        break;

      default:
        return NextResponse.json(
          { error: `Unknown editorial action: ${action}` },
          { status: 400 }
        );
    }

    const response = await provider.generate({
      systemPrompt,
      userMessage,
      responseFormat,
    });

    try {
      let responseContent = response.content.trim();
      if (responseContent.startsWith("```")) {
        responseContent = responseContent
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }
      const parsed = JSON.parse(responseContent);
      return NextResponse.json({ success: true, action, ...parsed });
    } catch {
      return NextResponse.json({
        success: true,
        action,
        raw: response.content,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Editorial Error]", error);
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
