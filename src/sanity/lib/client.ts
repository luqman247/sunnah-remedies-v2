import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Authenticated, explicit-`published`-perspective READ client. Used only
 * for server-side lookups that must never resolve a draft or version
 * document (e.g. resolving a duaDhikrCollection reference before writing a
 * duaDhikrEntry — see import-content-document.ts). Carries a token so it
 * can read even a private dataset, but every caller must use `.fetch()`
 * only — never `.create()/.patch()/.delete()` — writes still go through
 * write-client.ts.
 */
export const publishedReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Authenticated, explicit-`raw`-perspective READ client. Sees documents at
 * their literal physical `_id` — a `drafts.`-prefixed id is never
 * canonicalized here, unlike `previewClient` (perspective: "drafts"). Used
 * only for collision checks that must distinguish a physical draft from a
 * physical published/root document (e.g. entry-id collision detection
 * before writing a duaDhikrEntry — see import-content-document.ts). Every
 * caller must use `.fetch()` only — never `.create()/.patch()/.delete()`.
 */
export const rawReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "raw",
  token: process.env.SANITY_API_TOKEN,
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}
