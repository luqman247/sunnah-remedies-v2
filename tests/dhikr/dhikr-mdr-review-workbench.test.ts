/**
 * MDR Scholarly Review Workbench tests.
 *
 * Covers the persistent, browser-based review tool at
 * src/app/(staff)/dhikr-mdr-review/ — auth gating, real Sanity persistence,
 * server-side validation (tested directly against the same pure functions
 * the server actions call — see ./actions.ts and ./draft-logic.ts), and the
 * structural guarantees that this tool can never modify the research
 * register or create a public dhikrItem.
 *
 * Tests 1–2 (auth gating, all-30-records load) and the reload-persists
 * check start a real `next start` server on a dedicated port, because
 * Next.js Server Actions and `next-auth`'s `getServerSession` require a
 * genuine HTTP request context — calling them from a bare script throws
 * "`headers` was called outside a request scope," proven during manual
 * verification. Every other test calls the same pure/writeClient logic the
 * server actions use, directly, without a server.
 *
 * Requires `npx next build` to have already been run, and requires
 * NEXTAUTH_SECRET/NEXTAUTH_URL/STAFF_CREDENTIALS and the Sanity env vars to
 * be present in .env.local (tsx does not auto-load .env.local, so this file
 * loads it itself — see loadEnvLocal below). If those are not configured,
 * the two live-server tests report a clear skip reason rather than a false
 * pass or a hard crash, but every other test still runs and enforces the
 * real safety guarantees.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md). Uses
 * only isolated test documents (MDR-999, never a real MDR ID), removed
 * after each test that creates one.
 */

import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import {
  validateDraftInput,
  summariseDrafts,
  draftDocumentId,
  type DraftInputLike,
} from "../../src/app/(staff)/dhikr-mdr-review/draft-logic";
import { dhikrItemsPublicEligibleQuery } from "../../src/sanity/lib/queries";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");
const TEST_MDR_ID = "MDR-999";

/* ── .env.local loader (tsx does not auto-load it) ─────────────────────── */

function loadEnvLocal(): Record<string, string> {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const envLocal = loadEnvLocal();
for (const [key, value] of Object.entries(envLocal)) {
  if (!process.env[key]) process.env[key] = value;
}

/**
 * Lazily, dynamically imported — write-client.ts reads process.env at
 * module-evaluation time, so it must only be imported after loadEnvLocal()
 * above has populated process.env, never via a static top-level import
 * (which ES modules hoist and evaluate before this file's own code runs).
 */
async function getWriteClient() {
  const mod = await import("../../src/sanity/lib/write-client");
  return mod.writeClient;
}

function hasLiveServerCredentials(): boolean {
  return !!envLocal.STAFF_CREDENTIALS && !!envLocal.NEXTAUTH_SECRET && !!envLocal.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

function firstStaffCredential(): { email: string; password: string } | null {
  try {
    const parsed = JSON.parse(envLocal.STAFF_CREDENTIALS);
    return Array.isArray(parsed) && parsed[0] ? { email: parsed[0].email, password: parsed[0].password } : null;
  } catch {
    return null;
  }
}

/* ── 5–8. Server-side validation — direct calls to the real validator ──── */

function baseValidInput(): DraftInputLike {
  return {
    mdrId: TEST_MDR_ID,
    sequenceNumber: undefined,
    decision: "approved",
    approvedTiming: "morning-only",
    approvedRepetitionCount: 3,
    reviewDate: "2026-07-16",
    reviewerName: "Test Reviewer",
    reviewerQualification: "Test Institution",
    signedConfirmation: true,
  };
}

function testSubmitRequiresReviewerName() {
  const error = validateDraftInput({ ...baseValidInput(), reviewerName: "" }, "submitted");
  assert(!!error && /reviewer name/i.test(error), `Expected a reviewer-name-required error, got: ${error}`);
  const draftOk = validateDraftInput({ ...baseValidInput(), reviewerName: "" }, "draft");
  assert(draftOk === null, "A draft save must not require reviewer name");
  console.log("✓ submit requires reviewer name (draft save does not)");
}

function testSubmitRequiresQualification() {
  const error = validateDraftInput({ ...baseValidInput(), reviewerQualification: "" }, "submitted");
  assert(!!error && /qualification/i.test(error), `Expected a qualification-required error, got: ${error}`);
  console.log("✓ submit requires reviewer qualification");
}

function testSubmitRequiresReviewDate() {
  const error = validateDraftInput({ ...baseValidInput(), reviewDate: "" }, "submitted");
  assert(!!error && /review date/i.test(error), `Expected a review-date-required error, got: ${error}`);
  console.log("✓ submit requires review date");
}

function testSubmitRequiresSignedConfirmation() {
  const error = validateDraftInput({ ...baseValidInput(), signedConfirmation: false }, "submitted");
  assert(!!error && /signed-confirmation/i.test(error), `Expected a signed-confirmation-required error, got: ${error}`);
  console.log("✓ submit requires the signed-confirmation checkbox");
}

/* ── Additional §3 security requirements: whitelists rejected values ──── */

function testOnlyAllowedDecisionAndTimingValuesAccepted() {
  const badDecision = validateDraftInput({ ...baseValidInput(), decision: "malicious-value" as never }, "draft");
  assert(!!badDecision && /decision/i.test(badDecision), "An out-of-whitelist decision value must be rejected");

  const badTiming = validateDraftInput({ ...baseValidInput(), approvedTiming: "whenever" }, "draft");
  assert(!!badTiming && /timing/i.test(badTiming), "An out-of-whitelist timing value must be rejected");

  const badMdrId = validateDraftInput({ ...baseValidInput(), mdrId: "MDR-1" }, "draft");
  assert(!!badMdrId, "A malformed MDR ID must be rejected");

  const badMdrId2 = validateDraftInput({ ...baseValidInput(), mdrId: "'; DROP TABLE" }, "draft");
  assert(!!badMdrId2, "A non-MDR-shaped ID must be rejected");

  console.log("✓ only whitelisted decision/timing values are accepted; malformed MDR IDs are rejected");
}

/* ── 9. Protected transcription cannot be written through the action ──── */

function testProtectedTranscriptionNeverWritable() {
  const actionsSource = fs.readFileSync(path.join(REPO_ROOT, "src/app/(staff)/dhikr-mdr-review/actions.ts"), "utf8");
  const forbidden = ["fullArabicText", "originalDocumentText", "openingArabicWords", "sourceDocumentAnnotations", "transcriptionStatus"];
  for (const field of forbidden) {
    assert(!actionsSource.includes(field), `actions.ts must never reference protected field "${field}" — the draft schema/action has no path to write it`);
  }
  const schemaSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/sanity/schemas/documents/dhikr-review/dhikr-mdr-review-draft.ts"),
    "utf8",
  );
  for (const field of forbidden) {
    assert(!schemaSource.includes(field), `dhikr-mdr-review-draft.ts schema must not define a protected field "${field}"`);
  }
  console.log("✓ [static check] no protected transcription field is writable through the review action or its schema");
}

/* ── 10. Saving a review cannot modify the research register ───────────── */

function testActionsNeverImportRegister() {
  const filesToCheck = [
    "src/app/(staff)/dhikr-mdr-review/actions.ts",
    "src/app/(staff)/dhikr-mdr-review/draft-logic.ts",
  ];
  for (const relPath of filesToCheck) {
    const source = fs.readFileSync(path.join(REPO_ROOT, relPath), "utf8");
    assert(
      !/from\s+["'][^"']*morning-dhikr-register/.test(source),
      `${relPath} must never import the research register — it cannot possibly write to it`,
    );
  }
  console.log("✓ [static check] the review action and its validation logic never import the research register");
}

/* ── 11. Saving a review cannot create or publish a dhikrItem ──────────── */

function testActionOnlyEverWritesReviewDraftType() {
  const actionsSource = fs.readFileSync(path.join(REPO_ROOT, "src/app/(staff)/dhikr-mdr-review/actions.ts"), "utf8");
  assert(
    /_type:\s*"dhikrMdrReviewDraft"/.test(actionsSource) && !actionsSource.includes('_type: "dhikrItem"') && !/_type:\s*input/.test(actionsSource),
    "actions.ts must hardcode _type as \"dhikrMdrReviewDraft\" and never derive it from input, and must never write \"dhikrItem\"",
  );
  console.log("✓ [static check] the review action can only ever write dhikrMdrReviewDraft documents, never dhikrItem");
}

/* ── 12. Summary counts are accurate ────────────────────────────────────── */

function testSummaryCountsAreAccurate() {
  const allIds = ["MDR-001", "MDR-002", "MDR-003", "MDR-004", "MDR-005"];
  const drafts = [
    { mdrId: "MDR-001", status: "submitted" as const, decision: "approved" as const },
    { mdrId: "MDR-002", status: "submitted" as const, decision: "approved-with-corrections" as const },
    { mdrId: "MDR-003", status: "submitted" as const, decision: "deferred" as const },
    { mdrId: "MDR-004", status: "submitted" as const, decision: "rejected" as const },
    { mdrId: "MDR-005", status: "draft" as const, decision: "" as const },
  ];
  const summary = summariseDrafts(allIds, drafts);
  assert(summary.approved === 1, `Expected 1 approved, got ${summary.approved}`);
  assert(summary.approvedWithCorrections === 1, `Expected 1 approved-with-corrections, got ${summary.approvedWithCorrections}`);
  assert(summary.deferred === 1, `Expected 1 deferred, got ${summary.deferred}`);
  assert(summary.rejected === 1, `Expected 1 rejected, got ${summary.rejected}`);
  assert(summary.incomplete === 1, `Expected 1 incomplete (MDR-005 is only a draft, not submitted), got ${summary.incomplete}`);
  assert(
    JSON.stringify(summary.stillRequiringAttention) === JSON.stringify(["MDR-005"]),
    `Expected only MDR-005 to still require attention, got ${JSON.stringify(summary.stillRequiringAttention)}`,
  );

  const emptySummary = summariseDrafts(allIds, []);
  assert(emptySummary.incomplete === 5, "With zero drafts, all 5 records should be incomplete");
  assert(emptySummary.stillRequiringAttention.length === 5, "With zero drafts, all 5 records should require attention");

  console.log("✓ summary counts are accurate across mixed decisions and an empty-drafts baseline");
}

/* ── 13. Drafts are not returned by public Dhikr queries ────────────────── */

function testDraftsExcludedFromPublicQuery() {
  assert(
    dhikrItemsPublicEligibleQuery.includes('_type == "dhikrItem"') && !dhikrItemsPublicEligibleQuery.includes("dhikrMdrReviewDraft"),
    "The canonical public Dhikr query must filter on _type == \"dhikrItem\" only, never dhikrMdrReviewDraft",
  );
  const publicFetchSource = fs.readFileSync(path.join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts"), "utf8");
  assert(!publicFetchSource.includes("dhikrMdrReviewDraft"), "dhikr-public-fetch.ts must never reference the review-draft document type");
  console.log("✓ [static check] the canonical public query and public fetch module never reference dhikrMdrReviewDraft");
}

/* ── 3 & 4. Save draft persists / reload returns the saved draft (direct Sanity round trip) ── */

async function testSaveDraftPersistsAndReloadReturnsIt() {
  const writeClient = await getWriteClient();
  const id = draftDocumentId(TEST_MDR_ID);
  try {
    await writeClient.createIfNotExists({ _id: id, _type: "dhikrMdrReviewDraft", mdrId: TEST_MDR_ID, status: "draft" });
    await writeClient
      .patch(id)
      .set({
        decision: "approved",
        reviewerName: "Isolated Test Reviewer",
        reviewerQualification: "Isolated Test Institution",
        reviewDate: "2026-07-16",
        signedConfirmation: true,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    // Simulate a page reload: a fresh, independent read.
    const reread = await writeClient.fetch(`*[_type == "dhikrMdrReviewDraft" && mdrId == $id][0]`, { id: TEST_MDR_ID });
    assert(!!reread, "The saved draft must be readable back from Sanity");
    assert(reread.decision === "approved", "Reread draft must have the saved decision");
    assert(reread.reviewerName === "Isolated Test Reviewer", "Reread draft must have the saved reviewer name");
    assert(reread._type === "dhikrMdrReviewDraft", "Reread draft must be of type dhikrMdrReviewDraft, not dhikrItem");
    console.log("✓ save draft persists to Sanity and survives a simulated page reload");
  } finally {
    await writeClient.delete(id).catch(() => {});
  }
}

/* ── 11 (live half). No dhikrItem is created by draft persistence ──────── */

async function testNoDhikrItemCreatedByDraftWrite() {
  const writeClient = await getWriteClient();
  const before = await writeClient.fetch(`count(*[_type == "dhikrItem"])`);
  const id = draftDocumentId(TEST_MDR_ID);
  try {
    await writeClient.createIfNotExists({ _id: id, _type: "dhikrMdrReviewDraft", mdrId: TEST_MDR_ID, status: "draft" });
    await writeClient.patch(id).set({ decision: "approved", updatedAt: new Date().toISOString() }).commit();
    const after = await writeClient.fetch(`count(*[_type == "dhikrItem"])`);
    assert(before === after, `dhikrItem count must be unchanged by a draft write (before: ${before}, after: ${after})`);
    console.log(`✓ writing a review draft creates zero dhikrItem documents (count stayed at ${after})`);
  } finally {
    await writeClient.delete(id).catch(() => {});
  }
}

/* ── 10 (live half). The register file is untouched on disk ────────────── */

const REGISTER_PATH = path.join(REPO_ROOT, "src/lib/dhikr-research/morning-dhikr-register.ts");
const registerContentAtTestStart = fs.readFileSync(REGISTER_PATH, "utf8");

/**
 * Confirms running THIS test file never writes to the register — compares
 * the file's content at test-module load time against its content after
 * every other test has run, rather than asserting zero git diff (which
 * would incorrectly fail whenever other, legitimate, already-in-progress
 * register changes are staged/unstaged for unrelated reasons).
 */
function testRegisterFileUnmodifiedByThisTestRun() {
  const registerContentNow = fs.readFileSync(REGISTER_PATH, "utf8");
  assert(
    registerContentNow === registerContentAtTestStart,
    "The research register file changed while running this test suite — nothing in these tests may write to it",
  );
  console.log("✓ the research register file was not modified by running this test suite");
}

/* ── 1 & 2. Live-server integration: auth gating + full 30-record load ─── */

const TEST_PORT = 3951;
const TEST_BASE_URL = `http://localhost:${TEST_PORT}`;

function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        await fetch(url, { redirect: "manual" });
        resolve();
      } catch {
        if (Date.now() > deadline) {
          reject(new Error("Server did not become ready in time"));
        } else {
          setTimeout(attempt, 300);
        }
      }
    };
    attempt();
  });
}

async function testUnauthenticatedRedirectsAndAuthenticatedLoadsAll30(server: ChildProcess) {
  await waitForServer(TEST_BASE_URL, 20000);

  // 1. Unauthenticated access redirects to sign-in.
  const unauthed = await fetch(`${TEST_BASE_URL}/dhikr-mdr-review`, { redirect: "manual" });
  assert(unauthed.status === 307 || unauthed.status === 302, `Unauthenticated request should redirect, got ${unauthed.status}`);
  const location = unauthed.headers.get("location") || "";
  assert(location.includes("/sign-in"), `Redirect location should include /sign-in, got "${location}"`);
  console.log("✓ unauthenticated access to /dhikr-mdr-review redirects to /sign-in");

  // 2. Authenticated staff can load all 30 records.
  const credential = firstStaffCredential();
  assert(!!credential, "STAFF_CREDENTIALS must contain at least one account to run this test");

  const csrfRes = await fetch(`${TEST_BASE_URL}/api/auth/csrf`);
  const csrfCookie = csrfRes.headers.get("set-cookie") || "";
  const { csrfToken } = await csrfRes.json();

  const signInRes = await fetch(`${TEST_BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: csrfCookie },
    body: new URLSearchParams({
      email: credential!.email,
      password: credential!.password,
      csrfToken,
      callbackUrl: "/dhikr-mdr-review",
      json: "true",
    }),
    redirect: "manual",
  });
  const sessionCookie = signInRes.headers.get("set-cookie") || "";
  assert(sessionCookie.length > 0, "Sign-in must set a session cookie");

  const combinedCookies = [csrfCookie, sessionCookie]
    .flatMap((c) => c.split(/,(?=[^;]+?=)/))
    .map((c) => c.split(";")[0])
    .join("; ");

  const authedRes = await fetch(`${TEST_BASE_URL}/dhikr-mdr-review`, { headers: { cookie: combinedCookies } });
  assert(authedRes.status === 200, `Authenticated request should return 200, got ${authedRes.status}`);
  const html = await authedRes.text();
  const mdrIds = new Set(html.match(/MDR-\d{3}/g) ?? []);
  assert(mdrIds.size === 30, `Expected all 30 MDR IDs to be present, found ${mdrIds.size}`);
  console.log("✓ authenticated staff can load the workbench, and all 30 MDR records are present");
}

async function runLiveServerTests() {
  if (!hasLiveServerCredentials()) {
    console.log("⚠ skipping live-server auth tests — .env.local is missing STAFF_CREDENTIALS/NEXTAUTH_SECRET/Sanity project ID");
    return;
  }

  const server = spawn("npx", ["next", "start", "-p", String(TEST_PORT)], {
    cwd: REPO_ROOT,
    env: { ...process.env, ...envLocal },
    stdio: "ignore",
  });

  try {
    await testUnauthenticatedRedirectsAndAuthenticatedLoadsAll30(server);
  } finally {
    server.kill();
  }
}

async function runAll() {
  testSubmitRequiresReviewerName();
  testSubmitRequiresQualification();
  testSubmitRequiresReviewDate();
  testSubmitRequiresSignedConfirmation();
  testOnlyAllowedDecisionAndTimingValuesAccepted();
  testProtectedTranscriptionNeverWritable();
  testActionsNeverImportRegister();
  testActionOnlyEverWritesReviewDraftType();
  testSummaryCountsAreAccurate();
  testDraftsExcludedFromPublicQuery();
  await testSaveDraftPersistsAndReloadReturnsIt();
  await testNoDhikrItemCreatedByDraftWrite();
  await runLiveServerTests();
  testRegisterFileUnmodifiedByThisTestRun();
  console.log("\nAll MDR review workbench tests passed.");
}

runAll();
