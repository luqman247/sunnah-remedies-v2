/**
 * "Scholar Review" portal — the ONLY Sanity client this portal may use.
 *
 * Every exported function here calls assertStagingDataset() before doing
 * anything — see staging-guard.ts. Carries SANITY_API_TOKEN (server-only by
 * convention — no NEXT_PUBLIC_ prefix, never bundled to the browser by
 * Next.js). Never import this module from a "use client" file.
 */

import { createClient, type SanityClient } from "next-sanity";
import { assertStagingDataset, resolveScholarReviewDataset } from "./staging-guard";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

let cachedClient: SanityClient | null = null;

function getClient(): SanityClient {
  assertStagingDataset();
  if (!projectId || !token) {
    throw new Error("Scholar-review portal is missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
  }
  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset: resolveScholarReviewDataset(),
      apiVersion: "2024-01-01",
      token,
      useCdn: false,
      perspective: "published",
    });
  }
  return cachedClient;
}

export async function stagingFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  assertStagingDataset();
  return getClient().fetch<T>(query, params);
}

export async function stagingCreateOrReplace<T extends { _id: string; _type: string }>(doc: T): Promise<T> {
  assertStagingDataset();
  const result = await getClient().createOrReplace(doc);
  return result as unknown as T;
}

export async function stagingPatch(id: string, set: Record<string, unknown>): Promise<void> {
  assertStagingDataset();
  await getClient().patch(id).set(set).commit();
}

export async function stagingCreate<T extends { _type: string }>(doc: T): Promise<{ _id: string }> {
  assertStagingDataset();
  const result = await getClient().create(doc);
  return result;
}
