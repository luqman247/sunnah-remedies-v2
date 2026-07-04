/**
 * Vector Indexing — Pinecone Integration (§5.1).
 *
 * Manages upsert, delete, and full re-index operations.
 * Every vector carries embeddingModel + dimension for safe migration.
 * Incremental upsert on publish; delete-by-sanityDocId on unpublish.
 */

import { Pinecone } from "@pinecone-database/pinecone";
import { AI_CONFIG } from "../../config";
import { getEmbeddingProvider } from "../embedding/pipeline";
import type { DocumentChunk, ProvenanceEnvelope } from "../../evidence-engine/types";

/* ── Pinecone Client ─────────────────────────────────────────────── */

let pineconeClient: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) throw new Error("PINECONE_API_KEY is required");
    pineconeClient = new Pinecone({ apiKey });
  }
  return pineconeClient;
}

function getIndex() {
  return getPinecone().index(AI_CONFIG.vector.indexName);
}

/* ── Metadata Serialisation ──────────────────────────────────────── */

interface VectorMetadata {
  chunkId: string;
  content: string;
  parentContent?: string;
  sourceCategory: string;
  authenticityGrade?: string;
  epistemicAxis: string;
  citationType: string;
  citationJson: string;
  language: string;
  contentType: string;
  accessLevel: string;
  sanityDocId: string;
  sanityRev: string;
  editorialApproved: boolean;
  embeddingModel: string;
  embeddingDimension: number;
  headingPath?: string;
  lastVerifiedAt: string;
}

function envelopeToMetadata(
  chunk: DocumentChunk
): VectorMetadata {
  const env = chunk.envelope;
  return {
    chunkId: env.chunkId,
    content: chunk.content.slice(0, 10000),
    parentContent: chunk.parentContent?.slice(0, 5000),
    sourceCategory: env.sourceCategory,
    authenticityGrade: env.authenticityGrade,
    epistemicAxis: env.epistemicAxis.join(","),
    citationType: env.citation.type,
    citationJson: JSON.stringify(env.citation),
    language: env.language,
    contentType: env.contentType,
    accessLevel: env.accessLevel,
    sanityDocId: env.sanityDocId,
    sanityRev: env.sanityRev,
    editorialApproved: env.editorialApproved,
    embeddingModel: AI_CONFIG.embedding.model,
    embeddingDimension: AI_CONFIG.embedding.dimension,
    headingPath: chunk.headingPath?.join(" > "),
    lastVerifiedAt: env.lastVerifiedAt,
  };
}

export function metadataToEnvelope(
  metadata: VectorMetadata
): ProvenanceEnvelope {
  return {
    chunkId: metadata.chunkId,
    sourceCategory: metadata.sourceCategory as ProvenanceEnvelope["sourceCategory"],
    authenticityGrade: metadata.authenticityGrade as ProvenanceEnvelope["authenticityGrade"],
    epistemicAxis: metadata.epistemicAxis.split(",") as ProvenanceEnvelope["epistemicAxis"],
    citation: JSON.parse(metadata.citationJson),
    language: metadata.language,
    contentType: metadata.contentType,
    accessLevel: metadata.accessLevel as ProvenanceEnvelope["accessLevel"],
    sanityDocId: metadata.sanityDocId,
    sanityRev: metadata.sanityRev,
    editorialApproved: metadata.editorialApproved,
    supersedes: null,
    lastVerifiedAt: metadata.lastVerifiedAt,
  };
}

/* ── Upsert ──────────────────────────────────────────────────────── */

export async function upsertChunks(
  chunks: DocumentChunk[],
  namespace: string = AI_CONFIG.vector.namespace.public
): Promise<{ upserted: number; errors: string[] }> {
  if (chunks.length === 0) return { upserted: 0, errors: [] };

  const embedder = getEmbeddingProvider();
  const errors: string[] = [];
  const index = getIndex();
  const ns = index.namespace(namespace);

  const batchSize = 50;
  let upserted = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    try {
      const embeddings = await embedder.embedBatch(
        batch.map((c) => c.content)
      );

      const vectors = batch.map((chunk, idx) => ({
        id: chunk.id,
        values: embeddings[idx].embedding,
        metadata: envelopeToMetadata(chunk) as unknown as Record<string, string | number | boolean | string[]>,
      }));

      await ns.upsert(vectors as unknown as Parameters<typeof ns.upsert>[0]);
      upserted += vectors.length;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Batch ${i}: ${msg}`);
    }
  }

  return { upserted, errors };
}

/* ── Delete by Sanity Document ID ────────────────────────────────── */

export async function deleteByDocId(
  sanityDocId: string,
  namespace: string = AI_CONFIG.vector.namespace.public
): Promise<void> {
  const index = getIndex();
  const ns = index.namespace(namespace);

  // Query for all vectors with this sanityDocId
  const embedder = getEmbeddingProvider();
  const dummyEmbedding = await embedder.embed("delete query");

  const results = await ns.query({
    vector: dummyEmbedding.embedding,
    topK: 100,
    filter: { sanityDocId: { $eq: sanityDocId } },
    includeMetadata: false,
  });

  if (results.matches?.length) {
    const ids = results.matches.map((m) => m.id);
    await ns.deleteMany(ids);
  }
}

/* ── Full Re-index ───────────────────────────────────────────────── */

export async function fullReindex(
  chunks: DocumentChunk[],
  namespace: string = AI_CONFIG.vector.namespace.public
): Promise<{ upserted: number; errors: string[] }> {
  const index = getIndex();
  const ns = index.namespace(namespace);

  // Delete all existing vectors in namespace
  try {
    await ns.deleteAll();
  } catch {
    // Namespace may not exist yet
  }

  return upsertChunks(chunks, namespace);
}

/* ── Query Vectors ───────────────────────────────────────────────── */

export interface VectorQueryOptions {
  embedding: number[];
  topK?: number;
  namespace?: string;
  filter?: Record<string, unknown>;
  includeMetadata?: boolean;
}

export interface VectorMatch {
  id: string;
  score: number;
  metadata?: VectorMetadata;
  content?: string;
  parentContent?: string;
}

export async function queryVectors(
  options: VectorQueryOptions
): Promise<VectorMatch[]> {
  const index = getIndex();
  const ns = index.namespace(
    options.namespace ?? AI_CONFIG.vector.namespace.public
  );

  const results = await ns.query({
    vector: options.embedding,
    topK: options.topK ?? AI_CONFIG.vector.topK,
    filter: options.filter,
    includeMetadata: options.includeMetadata ?? true,
  });

  return (results.matches || []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata as unknown as VectorMetadata | undefined,
    content: (match.metadata as Record<string, unknown>)?.content as string | undefined,
    parentContent: (match.metadata as Record<string, unknown>)?.parentContent as string | undefined,
  }));
}
