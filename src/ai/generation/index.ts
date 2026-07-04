/**
 * Grounded Generation — Response-Schema Enforcement (§6.2).
 *
 * Generates structured responses from retrieved + classified context.
 * Enforces the claim/citation contract (§3.6). Prose shown to users
 * is rendered from validated structure — never streamed raw.
 */

import { getGenerationProvider } from "./provider";
import type { GenerationResponse } from "./provider";
import {
  validateClaims,
  checkCategoryConsistency,
  getConfidenceBand,
} from "../evidence-engine";
import type { AssembledContext } from "../evidence-engine";
import type {
  StructuredResponse,
  Claim,
  ProvenanceEnvelope,
  RelatedContent,
} from "../evidence-engine/types";
import { AI_CONFIG } from "../config";

/* ── Response Generation ─────────────────────────────────────────── */

export interface GenerateOptions {
  systemPrompt: string;
  query: string;
  context: AssembledContext;
  surface: string;
  language: string;
  disclaimers?: string[];
}

export async function generateGroundedResponse(
  options: GenerateOptions
): Promise<StructuredResponse> {
  const startTime = Date.now();
  const provider = getGenerationProvider();
  const retrievedChunkIds = new Set(
    options.context.chunks.map((c) => c.id)
  );
  const chunkEnvelopes = new Map<string, ProvenanceEnvelope>(
    options.context.chunks.map((c) => [c.id, c.envelope])
  );

  const userMessage = buildUserMessage(options);

  const response = await provider.generate({
    systemPrompt: options.systemPrompt,
    userMessage,
    responseFormat: "json",
  });

  const parsed = parseStructuredResponse(response, options);

  // Citation validation (§5.7 step 4)
  const validation = validateClaims(parsed.claims, retrievedChunkIds);

  if (!validation.valid && validation.validClaims.length > 0) {
    parsed.claims = validation.validClaims;
    for (const err of validation.errors) {
      console.warn("[Evidence Engine] " + err);
    }
  }

  // If all claims were dropped, attempt one regeneration
  if (validation.validClaims.length === 0 && parsed.claims.length > 0) {
    console.warn("[Evidence Engine] All claims dropped. Regenerating...");
    const retry = await provider.generate({
      systemPrompt: options.systemPrompt,
      userMessage:
        userMessage +
        "\n\nIMPORTANT: Your previous response contained citations that did not match the provided context. " +
        "You MUST ONLY cite chunk IDs that appear in the context above. " +
        "If you cannot make any grounded claims, return an empty claims array.",
      responseFormat: "json",
    });
    const retryParsed = parseStructuredResponse(retry, options);
    const retryValidation = validateClaims(
      retryParsed.claims,
      retrievedChunkIds
    );
    parsed.claims = retryValidation.validClaims;
  }

  // Category consistency check
  parsed.claims = parsed.claims.filter((claim) =>
    checkCategoryConsistency(claim, chunkEnvelopes)
  );

  // Compute confidence band from average claim confidence
  const avgConfidence =
    parsed.claims.length > 0
      ? parsed.claims.reduce((sum, c) => sum + c.confidence, 0) /
        parsed.claims.length
      : 0;

  const processingTimeMs = Date.now() - startTime;

  return {
    ...parsed,
    disclaimers: options.disclaimers ?? parsed.disclaimers,
    metadata: {
      surface: options.surface,
      language: options.language,
      confidenceBand: getConfidenceBand(avgConfidence, {
        high: AI_CONFIG.retrieval.confidenceThresholds.high,
        medium: AI_CONFIG.retrieval.confidenceThresholds.medium,
      }),
      retrievedChunkIds: Array.from(retrievedChunkIds),
      processingTimeMs,
      cached: false,
    },
  };
}

/* ── Message Construction ────────────────────────────────────────── */

function buildUserMessage(options: GenerateOptions): string {
  return `QUERY: ${options.query}

RETRIEVED INSTITUTIONAL CONTEXT:
${options.context.contextText}

AVAILABLE CHUNK IDS: ${options.context.chunks.map((c) => c.id).join(", ")}

Respond with a valid JSON object following the structured response schema. 
Every claim MUST reference one or more chunk IDs from the AVAILABLE CHUNK IDS list.
Do NOT cite any chunk ID that is not in the list above.
Do NOT make any claim that is not supported by the retrieved context.
If the context does not contain sufficient information, say so honestly.`;
}

/* ── Response Parsing ────────────────────────────────────────────── */

function parseStructuredResponse(
  response: GenerationResponse,
  options: GenerateOptions
): StructuredResponse {
  try {
    let content = response.content.trim();
    // Strip markdown code fences if present
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || "",
      claims: (parsed.claims || []).map(
        (c: Record<string, unknown>) =>
          ({
            text: c.text || "",
            sourceCategory: c.sourceCategory || "INSTITUTIONAL",
            citations: Array.isArray(c.citations) ? c.citations : [],
            confidence: typeof c.confidence === "number" ? c.confidence : 0.5,
          }) as Claim
      ),
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      disclaimers: Array.isArray(parsed.disclaimers) ? parsed.disclaimers : [],
      escalation: parsed.escalation || undefined,
      related: normaliseRelated(parsed.related),
      metadata: {
        surface: options.surface,
        language: options.language,
        confidenceBand: "medium",
        retrievedChunkIds: [],
        processingTimeMs: 0,
        cached: false,
      },
    };
  } catch {
    // If JSON parsing fails, construct a minimal fallback
    return {
      summary: response.content.slice(0, 500),
      claims: [],
      warnings: [],
      disclaimers: [],
      related: { articles: [], courses: [], products: [], consultations: [] },
      metadata: {
        surface: options.surface,
        language: options.language,
        confidenceBand: "low",
        retrievedChunkIds: [],
        processingTimeMs: 0,
        cached: false,
      },
    };
  }
}

function normaliseRelated(
  raw: Partial<RelatedContent> | undefined
): RelatedContent {
  return {
    articles: Array.isArray(raw?.articles) ? raw.articles : [],
    courses: Array.isArray(raw?.courses) ? raw.courses : [],
    products: Array.isArray(raw?.products) ? raw.products : [],
    consultations: Array.isArray(raw?.consultations) ? raw.consultations : [],
  };
}
