/**
 * Read-only content preflight for the Duʿa & Dhikr content document.
 *
 * Never imports a Sanity client, never requires SANITY_API_TOKEN, never
 * writes anything — safe to run against the real content document as many
 * times as needed while it's being prepared.
 *
 * Usage:
 *   npx tsx scripts/dua-dhikr-preflight.ts <path-to.json>          # text report
 *   npx tsx scripts/dua-dhikr-preflight.ts <path-to.json> --json   # machine-readable report
 */

import { readFileSync } from "node:fs";
import { runPreflight, formatPreflightReportText, formatPreflightReportJson } from "../src/lib/dua-dhikr/import/preflight";

function main() {
  const filePath = process.argv.find((arg) => arg.endsWith(".json"));
  const wantsJson = process.argv.includes("--json");

  if (!filePath) {
    console.error("Usage: npx tsx scripts/dua-dhikr-preflight.ts <path-to.json> [--json]");
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

  const report = runPreflight(rows);
  console.log(wantsJson ? formatPreflightReportJson(report) : formatPreflightReportText(report));

  if (report.summary.blockedEntries > 0) {
    process.exitCode = 1;
  }
}

main();
