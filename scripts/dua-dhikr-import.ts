/**
 * CLI wrapper for the Duʿa & Dhikr content-document import.
 *
 * Usage:
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json>                        # dry run (default, no writes)
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json> --dry-run              # explicit dry run
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json> --json                 # machine-readable dry-run report
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json> \
 *     --live --confirm-write --dataset <dataset-name>                        # writes to Sanity
 *
 * Live mode is deliberately friction-heavy — every one of these is
 * required together, or the script refuses to write anything:
 *   --live                 states writing intent
 *   --confirm-write        a second, explicit acknowledgement (catches a
 *                           stray "--live" typed by habit)
 *   --dataset <name>       must exactly match this environment's
 *                           configured NEXT_PUBLIC_SANITY_DATASET, so a
 *                           misconfigured environment can never silently
 *                           write to the wrong dataset
 *
 * Even in live mode: a batch containing any row with a blocking validation
 * error (including a fixture/placeholder marker) writes NOTHING by
 * default — see --allow-partial below and
 * src/lib/dua-dhikr/import/import-content-document.ts.
 *
 * The input file must be a JSON array matching
 * docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md. See
 * src/lib/dua-dhikr/import/import-content-document.ts for the underlying
 * logic and safety notes — every row is validated before anything is
 * written, and import only ever creates reviewStatus: "sourced" documents
 * with no board approvals, never a publicly eligible one.
 *
 * Run scripts/dua-dhikr-preflight.ts first — it performs the same
 * validation read-only, with a fuller report, and never requires any of
 * the live-mode flags above.
 */

import { readFileSync } from "node:fs";
import { runDuaDhikrImport, formatImportReport, type ImportRunReport } from "../src/lib/dua-dhikr/import/import-content-document";
import { projectId, dataset as configuredDataset } from "../src/sanity/lib/client";

async function main() {
  const filePath = process.argv.find((arg) => arg.endsWith(".json"));
  const isLive = process.argv.includes("--live");
  const hasConfirmWrite = process.argv.includes("--confirm-write");
  const allowPartial = process.argv.includes("--allow-partial");
  const wantsJson = process.argv.includes("--json");
  const datasetArgIndex = process.argv.indexOf("--dataset");
  const datasetArg = datasetArgIndex !== -1 ? process.argv[datasetArgIndex + 1] : undefined;

  if (!filePath) {
    console.error("Usage: npx tsx scripts/dua-dhikr-import.ts <path-to.json> [--live --confirm-write --dataset <name>] [--allow-partial] [--json]");
    process.exitCode = 1;
    return;
  }

  if (isLive) {
    // Every one of these must be satisfied before a single write is attempted.
    if (!hasConfirmWrite) {
      console.error("Refusing to run live: --live requires --confirm-write as a second, explicit acknowledgement.");
      process.exitCode = 1;
      return;
    }
    if (!datasetArg) {
      console.error("Refusing to run live: --live requires --dataset <name> naming the target dataset explicitly.");
      process.exitCode = 1;
      return;
    }
    if (datasetArg !== configuredDataset) {
      console.error(
        `Refusing to run live: --dataset "${datasetArg}" does not match this environment's configured dataset "${configuredDataset}" (NEXT_PUBLIC_SANITY_DATASET). This is the guard against writing to the wrong project/dataset — if "${configuredDataset}" is genuinely wrong, fix the environment, don't override this check.`,
      );
      process.exitCode = 1;
      return;
    }
    // Non-secret — project ID and dataset name are both NEXT_PUBLIC_-prefixed
    // and safe to print. The write token itself is never read or logged here.
    console.log(`Target Sanity project: ${projectId}  dataset: ${configuredDataset}`);
    console.log("Live mode confirmed — writes may occur.");
  }

  const raw = readFileSync(filePath, "utf8");
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) {
    console.error("Input file must contain a JSON array of rows — see docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md.");
    process.exitCode = 1;
    return;
  }

  const report: ImportRunReport = await runDuaDhikrImport({ rows, dryRun: !isLive, allowPartialBatch: allowPartial });
  console.log(wantsJson ? JSON.stringify(report, null, 2) : formatImportReport(report));

  if (report.invalid > 0) {
    console.log(`\n${report.invalid} row(s) were not written — fix the issues above and re-run.`);
  }
  if (!isLive) {
    console.log("\nThis was a dry run — no documents were written. Re-run with --live --confirm-write --dataset <name> to write to Sanity.");
  }
  if (report.abortedDueToPartialFailure || report.entries.some((e) => e.issues.length > 0 && e.outcome !== "written")) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Duʿa & Dhikr import failed:", error);
  process.exitCode = 1;
});
