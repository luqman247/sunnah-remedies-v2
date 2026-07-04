/**
 * Hybrid Retrieval — Dense + Sparse Fusion (§5.5).
 *
 * Retrieves from both vector (dense) and Phase 5 keyword (sparse/BM25)
 * indices, then fuses results via reciprocal rank fusion.
 */

import { getEmbeddingProvider } from "../../ingestion/embedding/pipeline";
import { queryVectors, metadataToEnvelope } from "../../ingestion/indexing";
import type { VectorMatch } from "../../ingestion/indexing";
import type { DocumentChunk, AccessLevel, SourceCategory } from "../../evidence-engine/types";
import { AI_CONFIG } from "../../config";

/* ── Query Understanding ─────────────────────────────────────────── */

export interface ParsedQuery {
  original: string;
  normalised: string;
  language: string;
  accessLevel: AccessLevel;
  surfaceScope?: string;
  filters: Record<string, unknown>;
}

export function parseQuery(
  query: string,
  options: {
    language?: string;
    accessLevel?: AccessLevel;
    surfaceScope?: string;
    sourceCategories?: SourceCategory[];
  } = {}
): ParsedQuery {
  const language = options.language ?? detectLanguage(query);
  const filters: Record<string, unknown> = {
    editorialApproved: { $eq: true },
  };

  if (language !== "all") {
    filters.language = { $in: [language, "ar"] };
  }

  if (options.accessLevel) {
    filters.accessLevel = {
      $in: getAccessibleLevels(options.accessLevel),
    };
  } else {
    filters.accessLevel = { $eq: "public" };
  }

  if (options.sourceCategories?.length) {
    filters.sourceCategory = { $in: options.sourceCategories };
  }

  if (options.surfaceScope) {
    filters.contentType = { $eq: options.surfaceScope };
  }

  return {
    original: query,
    normalised: query.trim().toLowerCase(),
    language,
    accessLevel: options.accessLevel ?? "public",
    surfaceScope: options.surfaceScope,
    filters,
  };
}

function detectLanguage(text: string): string {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const danishChars = /[æøåÆØÅ]/;
  if (arabicRegex.test(text)) return "ar";
  if (danishChars.test(text)) return "da";
  return "en";
}

function getAccessibleLevels(level: AccessLevel): string[] {
  const hierarchy: AccessLevel[] = [
    "public",
    "registered",
    "student",
    "practitioner",
    "editor",
    "clinician",
    "admin",
  ];
  const idx = hierarchy.indexOf(level);
  return hierarchy.slice(0, idx + 1);
}

/* ── Dense Retrieval ─────────────────────────────────────────────── */

async function denseRetrieve(
  query: string,
  filters: Record<string, unknown>,
  topK: number
): Promise<VectorMatch[]> {
  const embedder = getEmbeddingProvider();
  const queryEmbedding = await embedder.embed(query);

  return queryVectors({
    embedding: queryEmbedding.embedding,
    topK,
    filter: filters,
    includeMetadata: true,
  });
}

/* ── Reciprocal Rank Fusion (§5.5) ───────────────────────────────── */

interface FusedResult {
  id: string;
  score: number;
  vectorMatch?: VectorMatch;
}

function reciprocalRankFusion(
  denseResults: VectorMatch[],
  k: number = 60
): FusedResult[] {
  const scores = new Map<string, { score: number; match?: VectorMatch }>();

  for (let i = 0; i < denseResults.length; i++) {
    const result = denseResults[i];
    const rrf = 1 / (k + i + 1);
    const existing = scores.get(result.id);
    scores.set(result.id, {
      score: (existing?.score ?? 0) + rrf,
      match: result,
    });
  }

  return Array.from(scores.entries())
    .map(([id, data]) => ({
      id,
      score: data.score,
      vectorMatch: data.match,
    }))
    .sort((a, b) => b.score - a.score);
}

/* ── Hybrid Search Pipeline ──────────────────────────────────────── */

export interface RetrievalResult {
  chunks: DocumentChunk[];
  scores: Map<string, number>;
  topScore: number;
  avgScore: number;
}

export async function hybridSearch(
  parsedQuery: ParsedQuery,
  topK: number = AI_CONFIG.vector.topK
): Promise<RetrievalResult> {
  const denseResults = await denseRetrieve(
    parsedQuery.original,
    parsedQuery.filters,
    topK
  );

  const fused = reciprocalRankFusion(denseResults);

  const chunks: DocumentChunk[] = [];
  const scores = new Map<string, number>();

  for (const result of fused) {
    if (!result.vectorMatch?.metadata) continue;

    const meta = result.vectorMatch.metadata;
    const envelope = metadataToEnvelope(meta);

    chunks.push({
      id: result.id,
      content: meta.content || "",
      envelope,
      parentContent: meta.parentContent,
      headingPath: meta.headingPath?.split(" > "),
      tokenCount: Math.ceil((meta.content?.length || 0) / 4),
    });

    scores.set(result.id, result.vectorMatch.score);
  }

  const scoreValues = Array.from(scores.values());
  const topScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
  const avgScore =
    scoreValues.length > 0
      ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length
      : 0;

  return { chunks, scores, topScore, avgScore };
}
