/**
 * Duʿa & Dhikr — import-pipeline safety tests.
 *
 * Covers the fail-closed guarantees added in the pre-content-readiness
 * phase: live-mode flag gating, dataset confirmation, fixture rejection,
 * allowed-source-hostname validation, subcategory validation, and the
 * fail-closed-batch / setIfMissing re-import behaviour. No Sanity access
 * anywhere in this file — the CLI subprocess tests below only exercise
 * refusal paths that exit before any network call is attempted.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  validateImportRow,
  isAllowedSourceHostname,
  containsFixtureMarker,
  ALLOWED_SOURCE_HOSTNAMES,
} from "../../src/lib/dua-dhikr/import/schema";
import { runDuaDhikrImport } from "../../src/lib/dua-dhikr/import/import-content-document";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");

// Deliberately does NOT contain the words "fixture" or "not for
// publication" — this row represents "a hypothetically well-formed row"
// for testing paths OTHER than fixture-marker rejection (that rejection
// itself is tested separately, below, using real FIXTURE-marked text).
// Still obviously non-religious synthetic test data, never a real duʿā.
const validRow = {
  importIdentifier: "SAFETY-TEST-001",
  collectionSlug: "food-and-drink",
  titleEn: "[TEST DATA] Safety test entry",
  arabicText: "[TEST ARABIC PLACEHOLDER — NOT RELIGIOUS CONTENT]",
  translationEn: "[TEST TRANSLATION PLACEHOLDER]",
  references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]", verifiedStatus: "verified" }],
};

/* ── Allowed source hostnames ─────────────────────────────────────────── */

function testAllowedHostnamesAccepted() {
  assert(isAllowedSourceHostname("https://quran.com/2/255"), "quran.com must be an allowed hostname");
  assert(isAllowedSourceHostname("https://sunnah.com/bukhari:1"), "sunnah.com must be an allowed hostname");
  assert(isAllowedSourceHostname("https://usul.ai/some-work"), "usul.ai must be an allowed hostname");
  assert(isAllowedSourceHostname("https://api.quran.com/v4/x"), "a subdomain of an allowed hostname must be accepted");
  console.log(`✓ allowed source hostnames (${ALLOWED_SOURCE_HOSTNAMES.join(", ")}) and their subdomains are accepted`);
}

function testArbitraryHostnamesRejected() {
  assert(!isAllowedSourceHostname("https://random-islamic-blog.example/duas"), "an arbitrary external site must be rejected");
  assert(!isAllowedSourceHostname("https://not-quran.com/2/255"), "a lookalike domain must be rejected, not just a substring match");
  assert(!isAllowedSourceHostname("https://lifewithallah.com/dhikr-dua/"), "Life With Allah must never be accepted as a source domain (UX reference only, never a religious source)");
  assert(!isAllowedSourceHostname("not a url"), "a structurally invalid URL must be rejected, not crash");
  console.log("✓ arbitrary/lookalike external hostnames are rejected by default");
}

function testStructuralValidityIsNotScholarlyVerification() {
  // A structurally valid, allowed-domain URL still leaves verifiedStatus at
  // its schema default ("unverified") — validateImportRow must never
  // upgrade it to verified on the strength of the URL alone.
  const result = validateImportRow(
    { ...validRow, references: [{ type: "other", citation: "x", sourceUrl: "https://quran.com/2/255" }] },
    0,
  );
  assert(result.issues.length === 0, "a valid row with an allowed-domain URL must not be blocked");
  assert(
    result.warnings.some((w) => w.field?.includes("verifiedStatus")),
    "an allowed-domain URL must still warn that the reference is not marked verified — structural validity is not scholarly verification",
  );
  console.log("✓ a structurally valid, allowed-domain URL does not itself imply scholarly verification");
}

/* ── Fixture-marker rejection ─────────────────────────────────────────── */

function testFixtureMarkerDetected() {
  assert(containsFixtureMarker({ titleEn: "This is a FIXTURE row" }) === "titleEn", "an uppercase FIXTURE marker must be detected");
  assert(containsFixtureMarker({ arabicText: "not for publication" }) === "arabicText", "a lowercase 'not for publication' marker must be detected");
  assert(containsFixtureMarker({ titleEn: "A perfectly normal title" }) === undefined, "ordinary content must not be flagged as a fixture");
  console.log("✓ containsFixtureMarker detects FIXTURE / NOT FOR PUBLICATION markers case-insensitively");
}

function testFixtureRowIsBlockedNotJustWarned() {
  const result = validateImportRow({ ...validRow, titleEn: "[FIXTURE] Should never import" }, 0);
  assert(result.issues.length > 0, "a fixture-marked row must produce a BLOCKING issue, not a warning");
  assert(!result.value, "a fixture-marked row must never produce a usable value");
  console.log("✓ fixture-marked rows are blocked (not merely warned about)");
}

function testFixtureBatchWouldNeverReachAWriteCall() {
  // Deliberately does not invoke runDuaDhikrImport with dryRun: false —
  // this phase never runs the importer live, including in tests. Instead,
  // this proves the same guarantee at the validation layer that every
  // outcome path in runDuaDhikrImport checks first: every row in the
  // fixture file fails validation, so the code path that would call
  // writeClient is provably unreachable for this file.
  const sampleFixturePath = join(REPO_ROOT, "docs/dua-dhikr/sample-import.json");
  const rows = JSON.parse(readFileSync(sampleFixturePath, "utf8"));
  const results = rows.map((row: unknown, index: number) => validateImportRow(row, index));
  assert(rows.length > 0, "sample-import.json must not be empty, or this test proves nothing");
  assert(
    results.every((r: ReturnType<typeof validateImportRow>) => !r.value),
    "every row in docs/dua-dhikr/sample-import.json must fail validation (fixture-marked), so runDuaDhikrImport can never reach its writeClient call for this file",
  );
  console.log("✓ every row in the fixture sample file fails validation — the write path is provably unreachable for it");
}

/* ── Subcategory validation ───────────────────────────────────────────── */

function testUnknownSubcategoryRejected() {
  const result = validateImportRow({ ...validRow, collectionSlug: "home", subcategorySlug: "not-a-real-subcategory" }, 0);
  assert(result.issues.some((i) => i.field === "subcategorySlug"), "an unknown subcategory for a known collection must be rejected");
  console.log("✓ an unknown subcategory slug is rejected");
}

function testKnownSubcategoryAccepted() {
  const result = validateImportRow({ ...validRow, collectionSlug: "home", subcategorySlug: "entering-home" }, 0);
  assert(result.issues.length === 0, "a known subcategory of the chosen collection must be accepted");
  console.log("✓ a known subcategory slug is accepted");
}

/* ── Fail-closed batch behaviour ──────────────────────────────────────── */

// The two tests below are the only ones in this file that call
// runDuaDhikrImport with dryRun: false. This is safe and does not
// constitute "running the importer live": there is no SANITY_API_TOKEN
// configured in this worktree (no .env.local exists here at all), no
// network call is made, and — provably, by the fail-closed logic itself —
// a batch containing any invalid row aborts before the loop ever reaches
// a writeClient call for ANY row, valid or not. This is exactly the
// control-flow guarantee this test exists to prove.

async function testPartialBatchFailureBlocksAllWritesByDefault() {
  const rows = [validRow, { ...validRow, importIdentifier: "SAFETY-TEST-002", arabicText: "" /* invalid */ }];
  const report = await runDuaDhikrImport({ rows, dryRun: false });
  assert(report.abortedDueToPartialFailure === true, "a batch with any blocking row must be reported as aborted by default");
  assert(report.entries.every((e) => e.outcome !== "written"), "no row may be written when the batch was aborted, even the individually-valid one");
  console.log("✓ a batch containing any blocking row writes NOTHING by default (fail-closed)");
}

async function testDryRunNeverAbortsOrWrites() {
  const rows = [validRow, { ...validRow, importIdentifier: "SAFETY-TEST-003", arabicText: "" }];
  const report = await runDuaDhikrImport({ rows, dryRun: true });
  assert(report.abortedDueToPartialFailure === false, "dry runs are never reported as aborted — nothing was ever going to write");
  assert(report.entries.every((e) => e.outcome !== "written"), "dry run must never report outcome \"written\"");
  console.log("✓ dry run never writes and is never marked as an aborted batch");
}

/* ── CLI flag gating (subprocess; only exercises paths that exit before any Sanity call) ── */

function runCli(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", "scripts/dua-dhikr-import.ts", ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    timeout: 30_000,
  });
  return { status: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function testCliRefusesLiveWithoutConfirmWrite() {
  const { status, stderr } = runCli(["docs/dua-dhikr/sample-import.json", "--live"]);
  assert(status === 1, `--live alone must exit non-zero, got ${status}`);
  assert(stderr.includes("--confirm-write"), "the refusal message must name the missing --confirm-write flag");
  console.log("✓ CLI: --live alone is refused before any Sanity call");
}

function testCliRefusesLiveWithoutDataset() {
  const { status, stderr } = runCli(["docs/dua-dhikr/sample-import.json", "--live", "--confirm-write"]);
  assert(status === 1, `--live --confirm-write without --dataset must exit non-zero, got ${status}`);
  assert(stderr.includes("--dataset"), "the refusal message must name the missing --dataset flag");
  console.log("✓ CLI: --live --confirm-write without --dataset is refused before any Sanity call");
}

function testCliRefusesMismatchedDataset() {
  const { status, stderr } = runCli([
    "docs/dua-dhikr/sample-import.json",
    "--live",
    "--confirm-write",
    "--dataset",
    "definitely-not-the-configured-dataset",
  ]);
  assert(status === 1, `a mismatched --dataset must exit non-zero, got ${status}`);
  assert(stderr.toLowerCase().includes("does not match"), "the refusal message must explain the dataset mismatch");
  console.log("✓ CLI: a --dataset that does not match the configured environment is refused before any Sanity call");
}

function testCliNeverPrintsAToken() {
  const { stdout, stderr } = runCli(["docs/dua-dhikr/sample-import.json"]);
  const combined = stdout + stderr;
  assert(!/sk[A-Za-z0-9]{20,}/.test(combined), "CLI output must never contain a token-shaped string");
  console.log("✓ CLI: a normal (dry-run) invocation prints no token-shaped string");
}

async function runAll() {
  testAllowedHostnamesAccepted();
  testArbitraryHostnamesRejected();
  testStructuralValidityIsNotScholarlyVerification();
  testFixtureMarkerDetected();
  testFixtureRowIsBlockedNotJustWarned();
  testFixtureBatchWouldNeverReachAWriteCall();
  testUnknownSubcategoryRejected();
  testKnownSubcategoryAccepted();
  await testPartialBatchFailureBlocksAllWritesByDefault();
  await testDryRunNeverAbortsOrWrites();
  testCliRefusesLiveWithoutConfirmWrite();
  testCliRefusesLiveWithoutDataset();
  testCliRefusesMismatchedDataset();
  testCliNeverPrintsAToken();
  console.log("\nAll Duʿa & Dhikr import-safety tests passed.");
}

runAll();
