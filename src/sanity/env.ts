/**
 * Canonical Sanity project configuration.
 *
 * Single source of truth for project ID and dataset used by:
 * - sanity.config.ts (Studio)
 * - sanity.cli.ts (CLI)
 * - src/sanity/lib/client.ts (Next.js data layer)
 *
 * The project ID is a public identifier (safe for NEXT_PUBLIC_*).
 * Never place API tokens in this module or in NEXT_PUBLIC_* / SANITY_STUDIO_* vars.
 */

const PLACEHOLDER_PROJECT_IDS = new Set([
  "",
  "your-project-id",
  "your_project_id",
  "project-id",
]);

/** Existing Sunnah Remedies Sanity project — do not replace with a new project. */
export const CANONICAL_SANITY_PROJECT_ID = "u106t68x";

/** Canonical dataset for this repository. */
export const CANONICAL_SANITY_DATASET = "production";

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function assertValidProjectId(projectId: string): string {
  if (PLACEHOLDER_PROJECT_IDS.has(projectId) || projectId.includes("your-project")) {
    throw new Error(
      [
        "Invalid Sanity project ID.",
        `Resolved "${projectId}", which is a placeholder.`,
        `Set NEXT_PUBLIC_SANITY_PROJECT_ID=${CANONICAL_SANITY_PROJECT_ID}`,
        "(Sunnah Remedies) in .env.local / Vercel, or rely on the canonical default.",
      ].join(" "),
    );
  }
  return projectId;
}

function assertValidDataset(dataset: string): string {
  if (!dataset.trim()) {
    throw new Error(
      `Invalid Sanity dataset: empty. Set NEXT_PUBLIC_SANITY_DATASET=${CANONICAL_SANITY_DATASET}.`,
    );
  }
  return dataset.trim();
}

/**
 * Resolve project ID: valid env override, else canonical Sunnah Remedies project.
 * Never falls back to "your-project-id".
 */
export function getSanityProjectId(): string {
  const fromEnv = firstNonEmpty(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    process.env.SANITY_STUDIO_PROJECT_ID,
  );
  return assertValidProjectId(fromEnv ?? CANONICAL_SANITY_PROJECT_ID);
}

/**
 * Resolve dataset: valid env override, else canonical "production".
 */
export function getSanityDataset(): string {
  const fromEnv = firstNonEmpty(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    process.env.SANITY_STUDIO_DATASET,
  );
  return assertValidDataset(fromEnv ?? CANONICAL_SANITY_DATASET);
}
