/**
 * "Scholar Review" portal — staging dataset guard tests.
 *
 * Pure checks against src/lib/scholar-review/staging-guard.ts — no live
 * Sanity access. Manipulates process.env directly since this module reads
 * it fresh on every call rather than caching at import time.
 */

export {}; // force module scope so top-level declarations don't collide with other global-script test files

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function withEnv(value: string | undefined, fn: () => Promise<void> | void) {
  const original = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (value === undefined) delete process.env.NEXT_PUBLIC_SANITY_DATASET;
  else process.env.NEXT_PUBLIC_SANITY_DATASET = value;
  try {
    await fn();
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SANITY_DATASET;
    else process.env.NEXT_PUBLIC_SANITY_DATASET = original;
  }
}

async function testStagingResolvesAsStaging() {
  const { isStagingDataset, resolveScholarReviewDataset } = await import("../../src/lib/scholar-review/staging-guard");
  await withEnv("staging", () => {
    assert(resolveScholarReviewDataset() === "staging", "should resolve to staging");
    assert(isStagingDataset(), "isStagingDataset() should be true when env is staging");
  });
  console.log("✓ resolves and recognises the staging dataset");
}

async function testProductionIsRefused() {
  const { isStagingDataset, assertStagingDataset, NotStagingDatasetError } = await import("../../src/lib/scholar-review/staging-guard");
  await withEnv("production", () => {
    assert(!isStagingDataset(), "isStagingDataset() must be false for production");
    let threw = false;
    try {
      assertStagingDataset();
    } catch (error) {
      threw = error instanceof NotStagingDatasetError;
    }
    assert(threw, "assertStagingDataset() must throw NotStagingDatasetError against production");
  });
  console.log("✓ production dataset is hard-refused");
}

async function testUnsetEnvDefaultsToProductionAndIsRefused() {
  const { resolveScholarReviewDataset, assertStagingDataset } = await import("../../src/lib/scholar-review/staging-guard");
  await withEnv(undefined, () => {
    assert(resolveScholarReviewDataset() === "production", "unset env must default to production, never staging");
    let threw = false;
    try {
      assertStagingDataset();
    } catch {
      threw = true;
    }
    assert(threw, "an unset dataset env var must still be refused, not silently allowed");
  });
  console.log("✓ unset dataset env var defaults to production and is refused (fail closed)");
}

async function testArbitraryOtherDatasetIsRefused() {
  const { assertStagingDataset } = await import("../../src/lib/scholar-review/staging-guard");
  await withEnv("some-other-dataset", () => {
    let threw = false;
    try {
      assertStagingDataset();
    } catch {
      threw = true;
    }
    assert(threw, "only the literal string \"staging\" may pass — no other dataset name is accepted");
  });
  console.log("✓ any dataset name other than the literal \"staging\" is refused");
}

async function runAll() {
  await testStagingResolvesAsStaging();
  await testProductionIsRefused();
  await testUnsetEnvDefaultsToProductionAndIsRefused();
  await testArbitraryOtherDatasetIsRefused();
  console.log("\nAll scholar-review staging-guard tests passed.");
}

runAll();
