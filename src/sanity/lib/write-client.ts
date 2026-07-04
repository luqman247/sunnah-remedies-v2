import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./client";

/**
 * Write-capable Sanity client for server actions.
 *
 * Used exclusively by server-side operations (forms, mutations).
 * Requires SANITY_API_TOKEN with write permissions in environment.
 *
 * Architectural decision: this is a separate export from the read client
 * to make the capability boundary explicit. Read operations use the CDN-backed
 * client; write operations use this token-authenticated client.
 *
 * @see Phase 4, Chapter 11.7 — Action-boundary rule
 */

const token = process.env.SANITY_API_TOKEN;
if (!token && process.env.NODE_ENV === "production") {
  throw new Error(
    "SANITY_API_TOKEN is required in production. Operational forms cannot write without it."
  );
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
