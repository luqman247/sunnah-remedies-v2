/**
 * CLI wrapper for the approved-only Dhikr import.
 *
 * Usage:
 *   npx tsx scripts/dhikr-import-approved.ts            # dry run (default, no writes)
 *   npx tsx scripts/dhikr-import-approved.ts --dry-run   # explicit dry run
 *   npx tsx scripts/dhikr-import-approved.ts --live      # writes to Sanity — requires
 *                                                          SANITY_API_TOKEN with write access
 *
 * See src/lib/dhikr-research/import/import-approved-records.ts for the
 * underlying logic and full safety notes. No record is ever imported unless
 * computeImportGate says canImport === true, which itself requires
 * importStatus === "import-ready" — a value nothing in this codebase sets
 * automatically.
 */

import { runApprovedDhikrImport, formatAuditReport } from "../src/lib/dhikr-research/import/import-approved-records";

async function main() {
  const isLive = process.argv.includes("--live");
  const report = await runApprovedDhikrImport({ dryRun: !isLive });
  console.log(formatAuditReport(report));
  if (isLive && (report.imported > 0 || report.updated > 0)) {
    console.log("\nLive import complete. Imported records remain reviewStatus: \"sourced\" in Sanity — they are NOT publicly eligible until a human separately adds the Danish translation and advances reviewStatus through Sanity Studio.");
  }
}

main().catch((error) => {
  console.error("Dhikr import failed:", error);
  process.exitCode = 1;
});
