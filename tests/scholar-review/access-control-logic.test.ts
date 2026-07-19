/**
 * "Scholar Review" portal — access-code verification tests.
 *
 * Only the request-context-free parts of src/lib/scholar-review/access-control.ts
 * are exercised here (verifyAccessCodeInput, isAccessCodeConfigured) — the
 * cookie-reading functions require Next's next/headers request scope and
 * are covered by manual/browser verification instead, matching this
 * codebase's existing convention of not faking a request context in these
 * plain-script tests (see tests/feeling/*.test.ts).
 */

export {}; // force module scope so top-level declarations don't collide with other global-script test files

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function withAccessCode(value: string | undefined, fn: () => Promise<void> | void) {
  const original = process.env.SCHOLAR_REVIEW_ACCESS_CODE;
  if (value === undefined) delete process.env.SCHOLAR_REVIEW_ACCESS_CODE;
  else process.env.SCHOLAR_REVIEW_ACCESS_CODE = value;
  try {
    await fn();
  } finally {
    if (original === undefined) delete process.env.SCHOLAR_REVIEW_ACCESS_CODE;
    else process.env.SCHOLAR_REVIEW_ACCESS_CODE = original;
  }
}

async function testConfiguredDetection() {
  const { isAccessCodeConfigured } = await import("../../src/lib/scholar-review/access-control");
  await withAccessCode(undefined, () => assert(!isAccessCodeConfigured(), "must report unconfigured when env var is unset"));
  await withAccessCode("", () => assert(!isAccessCodeConfigured(), "an empty string must not count as configured"));
  await withAccessCode("correct-horse-battery-staple", () => assert(isAccessCodeConfigured(), "a non-empty code must count as configured"));
  console.log("✓ isAccessCodeConfigured() correctly detects unset/empty/set access codes");
}

async function testCorrectCodeIsAccepted() {
  const { verifyAccessCodeInput } = await import("../../src/lib/scholar-review/access-control");
  await withAccessCode("correct-horse-battery-staple", () => {
    assert(verifyAccessCodeInput("correct-horse-battery-staple"), "the exact configured code must be accepted");
  });
  console.log("✓ the correct access code is accepted");
}

async function testWrongCodeIsRejected() {
  const { verifyAccessCodeInput } = await import("../../src/lib/scholar-review/access-control");
  await withAccessCode("correct-horse-battery-staple", () => {
    assert(!verifyAccessCodeInput("wrong-guess"), "an incorrect code must be rejected");
    assert(!verifyAccessCodeInput(""), "an empty guess must be rejected");
    assert(!verifyAccessCodeInput("correct-horse-battery-staplE"), "a case-different guess must be rejected (case-sensitive)");
  });
  console.log("✓ incorrect, empty, and case-mismatched codes are all rejected");
}

async function testWhitespaceIsTrimmedFromInputOnly() {
  const { verifyAccessCodeInput } = await import("../../src/lib/scholar-review/access-control");
  await withAccessCode("my-code", () => {
    assert(verifyAccessCodeInput("  my-code  "), "surrounding whitespace on the user's typed input should be trimmed");
    assert(!verifyAccessCodeInput("my code"), "internal whitespace must not be treated as equivalent");
  });
  console.log("✓ verifyAccessCodeInput trims only surrounding whitespace on the submitted input");
}

async function testNoConfiguredCodeMeansEverythingIsRejected() {
  const { verifyAccessCodeInput } = await import("../../src/lib/scholar-review/access-control");
  await withAccessCode(undefined, () => {
    assert(!verifyAccessCodeInput("anything"), "with no configured access code, every attempt must fail closed");
    assert(!verifyAccessCodeInput(""), "including an empty attempt");
  });
  console.log("✓ with no access code configured, every attempt is rejected (fail closed)");
}

function testSessionCookieFormatRegex() {
  // Mirrors the exact pattern used inline in getSessionIdFromCookie() —
  // kept here as an explicit, independently-readable regression guard.
  const pattern = /^scholarlyReviewSession-[a-f0-9-]{36}$/;
  const validId = `scholarlyReviewSession-${"a".repeat(8)}-${"b".repeat(4)}-${"c".repeat(4)}-${"d".repeat(4)}-${"e".repeat(12)}`;
  assert(pattern.test(validId), "a well-formed session id must match the trusted-cookie pattern");
  assert(!pattern.test("scholarlyReviewSession-<script>alert(1)</script>"), "an injected value must not match");
  assert(!pattern.test("someOtherDocumentType-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"), "a different document type prefix must not match");
  assert(!pattern.test(""), "an empty cookie value must not match");
  console.log("✓ the session-cookie trust pattern accepts only well-formed scholarlyReviewSession ids");
}

async function runAll() {
  await testConfiguredDetection();
  await testCorrectCodeIsAccepted();
  await testWrongCodeIsRejected();
  await testWhitespaceIsTrimmedFromInputOnly();
  await testNoConfiguredCodeMeansEverythingIsRejected();
  testSessionCookieFormatRegex();
  console.log("\nAll scholar-review access-control-logic tests passed.");
}

runAll();
