/**
 * AI Product Finder & Apothecary Surface (§7.2 / Milestones 5 & 8).
 *
 * Natural language product discovery. Never diagnoses, never prescribes.
 * Commercial suggestions are subordinate to the Integrity Ledger.
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

export interface ProductFinderOptions {
  query: string;
  language?: string;
  accessLevel?: AccessLevel;
  sessionId?: string;
}

export interface ProductFinderResult {
  success: boolean;
  response?: StructuredResponse;
  fallback?: FallbackResponse;
  escalation?: { type: string; message: string; action: string };
  cached: boolean;
}

export async function queryProductFinder(
  options: ProductFinderOptions
): Promise<ProductFinderResult> {
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

  const parsedQuery = parseQuery(sanitisedQuery, {
    language,
    accessLevel: options.accessLevel,
    sourceCategories: ["INSTITUTIONAL", "RESEARCH", "SUNNAH", "TRADITION"],
  });

  const retrievalResult = await hybridSearch(parsedQuery);
  const reranked = rerank(sanitisedQuery, retrievalResult.chunks, retrievalResult.scores);
  const confidence = assessConfidence(sanitisedQuery, reranked.chunks, reranked.scores);

  if (!confidence.shouldAnswer) {
    return {
      success: false,
      fallback: generateFallback(sanitisedQuery, reranked.chunks),
      cached: false,
    };
  }

  const context = assembleContext(reranked.chunks, AI_CONFIG.retrieval.maxParentContextTokens);
  const disclaimers = selectDisclaimers(sanitisedQuery, language);

  const response = await generateGroundedResponse({
    systemPrompt: assembleSystemPrompt("product_finder"),
    query: sanitisedQuery,
    context,
    surface: "product_finder",
    language,
    disclaimers,
  });

  return {
    success: true,
    response: runOutputGuardrails(response, sanitisedQuery, language),
    cached: false,
  };
}
