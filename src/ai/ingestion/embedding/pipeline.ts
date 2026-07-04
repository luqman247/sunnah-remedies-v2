/**
 * Embedding Pipeline — Provider-Abstracted (§5.2).
 *
 * Multilingual embeddings (English, Arabic, Danish at launch).
 * Stores embeddingModel + dimension on every vector for safe migration.
 */

import OpenAI from "openai";
import { AI_CONFIG } from "../../config";

/* ── Abstract Interface ──────────────────────────────────────────── */

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimension: number;
  tokenCount: number;
}

export interface EmbeddingProvider {
  embed(text: string): Promise<EmbeddingResult>;
  embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
}

/* ── OpenAI Implementation ───────────────────────────────────────── */

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for embeddings");
  return new OpenAI({ apiKey });
}

export const openaiEmbeddingProvider: EmbeddingProvider = {
  async embed(text: string): Promise<EmbeddingResult> {
    const results = await this.embedBatch([text]);
    return results[0];
  },

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const client = getOpenAIClient();
    const model = AI_CONFIG.embedding.model;
    const dimension = AI_CONFIG.embedding.dimension;

    const results: EmbeddingResult[] = [];
    const batchSize = AI_CONFIG.embedding.batchSize;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await client.embeddings.create({
        model,
        input: batch,
        dimensions: dimension,
      });

      for (const item of response.data) {
        results.push({
          embedding: item.embedding,
          model,
          dimension,
          tokenCount: response.usage?.total_tokens
            ? Math.ceil(response.usage.total_tokens / batch.length)
            : 0,
        });
      }
    }

    return results;
  },
};

/* ── Provider Registry ───────────────────────────────────────────── */

const embeddingProviders: Record<string, EmbeddingProvider> = {
  openai: openaiEmbeddingProvider,
};

export function getEmbeddingProvider(
  name?: string
): EmbeddingProvider {
  const key = name ?? AI_CONFIG.embedding.provider;
  const provider = embeddingProviders[key];
  if (!provider) throw new Error(`Unknown embedding provider: ${key}`);
  return provider;
}
