/**
 * CLI wrapper for the Duʿa & Dhikr content-document import.
 *
 * Usage:
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json>            # dry run (default, no writes)
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json> --dry-run   # explicit dry run
 *   npx tsx scripts/dua-dhikr-import.ts <path-to.json> --live      # writes to Sanity — requires
 *                                                                    SANITY_API_TOKEN with write access
 *
 * The input file must be a JSON array matching
 * docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md. See
 * src/lib/dua-dhikr/import/import-content-document.ts for the underlying
 * logic and safety notes — every row is validated before anything is
 * written, and import only ever creates reviewStatus: "sourced" documents
 * with no board approvals, never a publicly eligible one.
 */

import { readFileSync } from "node:fs";
import { runDuaDhikrImport, formatImportReport } from "../src/lib/dua-dhikr/import/import-content-document";

async function main() {
  const filePath = process.argv.find((arg) => arg.endsWith(".json"));
  const isLive = process.argv.includes("--live");

  if (!filePath) {
    console.error("Usage: npx tsx scripts/dua-dhikr-import.ts <path-to.json> [--live]");
    process.exitCode = 1;
    return;
  }

  const raw = readFileSync(filePath, "utf8");
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) {
    console.error("Input file must contain a JSON array of rows — see docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md.");
    process.exitCode = 1;
    return;
  }

  const report = await runDuaDhikrImport({ rows, dryRun: !isLive });
  console.log(formatImportReport(report));

  if (report.invalid > 0) {
    console.log(`\n${report.invalid} row(s) were not written — fix the issues above and re-run.`);
  }
  if (!isLive) {
    console.log("\nThis was a dry run — no documents were written. Re-run with --live to write to Sanity.");
  }
}

main().catch((error) => {
  console.error("Duʿa & Dhikr import failed:", error);
  process.exitCode = 1;
});
