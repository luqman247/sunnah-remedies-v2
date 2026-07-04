/**
 * AI Knowledge Assistant Surface (§7.1 / Milestone 4).
 *
 * Full public corpus. Handles questions about Prophetic Medicine,
 * Islamic health traditions, ingredients, conditions, and scholarship.
 */

import { runInputGuardrails } from "../../guardrails/input";
import { runOutputGuardrails, selectDisclaimers } from "../../guardrails/output";
import { parseQuery, hybridSearch } from "../../retrieval/hybrid";
import { rerank } from "../../retrieval/rerank";
import { assessConfidence, generateFallback } from "../../retrieval/confidence";
import { assembleContext } from "../../evidence-engine";
import { generateGroundedResponse } from "../../generation";
import { assembleSystemPrompt } from "../../prompts";
import { AI_CONFIG } from "../../config";
import type { StructuredResponse, AccessLevel } from "../../evidence-engine/types";
import type { FallbackResponse } from "../../retrieval/confidence";

export interface KnowledgeQueryOptions {
  query: string;
  language?: string;
  accessLevel?: AccessLevel;
  sessionId?: string;
  conversationHistory?: string;
}

export interface KnowledgeQueryResult {
  success: boolean;
  response?: StructuredResponse;
  fallback?: FallbackResponse;
  escalation?: {
    type: string;
    message: string;
    action: string;
  };
  cached: boolean;
}

export async function queryKnowledgeAssistant(
  options: KnowledgeQueryOptions
): Promise<KnowledgeQueryResult> {
  // 1. Input guardrails
  const inputCheck = runInputGuardrails(options.query);

  if (!inputCheck.safe && inputCheck.escalation) {
    return {
      success: false,
      escalation: inputCheck.escalation,
      cached: false,
    };
  }

  const sanitisedQuery = inputCheck.sanitisedQuery || options.query;
  const language = options.language || inputCheck.detectedLanguage;

  // 2. Parse query and build filters
  const parsedQuery = parseQuery(sanitisedQuery, {
    language,
    accessLevel: options.accessLevel,
  });

  // 3. Hybrid retrieval
  const retrievalResult = await hybridSearch(parsedQuery);

  // 4. Re-rank
  const reranked = rerank(
    sanitisedQuery,
    retrievalResult.chunks,
    retrievalResult.scores
  );

  // 5. Confidence assessment
  const confidence = assessConfidence(
    sanitisedQuery,
    reranked.chunks,
    reranked.scores
  );

  // 6. Confidence gate
  if (!confidence.shouldAnswer) {
    const fallback = generateFallback(sanitisedQuery, reranked.chunks);
    return {
      success: false,
      fallback,
      cached: false,
    };
  }

  // 7. Assemble context with Evidence Engine
  const context = assembleContext(
    reranked.chunks,
    AI_CONFIG.retrieval.maxParentContextTokens
  );

  // 8. Select disclaimers
  const disclaimers = selectDisclaimers(sanitisedQuery, language);

  // 9. Generate grounded response
  const systemPrompt = assembleSystemPrompt("knowledge");
  const response = await generateGroundedResponse({
    systemPrompt,
    query: sanitisedQuery,
    context,
    surface: "knowledge",
    language,
    disclaimers,
  });

  // 10. Output guardrails
  const guarded = runOutputGuardrails(response, sanitisedQuery, language);

  return {
    success: true,
    response: guarded,
    cached: false,
  };
}
