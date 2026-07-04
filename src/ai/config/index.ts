/**
 * AI Configuration — central registry for models, thresholds, and feature flags.
 *
 * All tunable parameters live here. Nothing is hard-coded in surfaces or
 * pipeline code. Change provider, model, or threshold in one place.
 */

export const AI_CONFIG = {
  generation: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514",
    maxTokens: 4096,
    temperature: 0.1,
    topP: 0.9,
  },

  embedding: {
    provider: "openai" as const,
    model: "text-embedding-3-small",
    dimension: 1536,
    batchSize: 100,
  },

  vector: {
    provider: "pinecone" as const,
    indexName: process.env.PINECONE_INDEX_NAME || "sunnah-remedies",
    namespace: {
      public: "public",
      restricted: "restricted",
      editorial: "editorial",
    },
    topK: 20,
    rerankedK: 8,
  },

  retrieval: {
    confidenceThresholds: {
      high: 0.75,
      medium: 0.55,
      low: 0,
    },
    maxParentContextTokens: 2000,
    hybridAlpha: 0.7, // weight for dense vs sparse (1 = pure dense)
  },

  chunking: {
    defaultMaxTokens: 512,
    defaultOverlap: 0.15,
    hadithSplitting: false as const, // never split a hadith
    quranSplitting: false as const, // never split an ayah
  },

  conversation: {
    maxHistoryTurns: 20,
    summariseAfterTurns: 10,
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  },

  rateLimit: {
    windowMs: 60_000,
    maxRequests: 30,
    maxRequestsAuth: 60,
  },

  cache: {
    semanticTtlMs: 3600_000, // 1 hour
    responseTtlMs: 1800_000, // 30 minutes
    embeddingTtlMs: 86400_000, // 24 hours
  },

  featureFlags: {
    knowledgeAssistant: true,
    productFinder: true,
    apothecary: true,
    consultationAssistant: true,
    courseAssistant: true,
    translation: true,
    personalisation: false, // staged rollout
    editorialAi: true,
  },

  performance: {
    firstTokenTargetMs: 1500,
    fullAnswerTargetMs: 5000,
    retrievalTargetMs: 400,
    targetCacheHitRate: 0.4,
  },
} as const;

export type AiProvider = typeof AI_CONFIG.generation.provider;
export type EmbeddingProvider = typeof AI_CONFIG.embedding.provider;
export type VectorProvider = typeof AI_CONFIG.vector.provider;
export type SurfaceId = keyof typeof AI_CONFIG.featureFlags;
