/**
 * Staff Credentials Tests — unit-level, no live server or network I/O.
 *
 * Tests the actual STAFF_CREDENTIALS parsing and authorize() matching logic
 * exported from src/lib/auth/config.ts, using synthetic (fake) credentials
 * set only in this process's environment — nothing is written to any file,
 * nothing here is a real password.
 *
 * These are unit tests of the credential-matching logic in isolation. They
 * do NOT prove the HTTP-level middleware/session flow works end-to-end —
 * that was verified separately via live curl/browser requests against a
 * running server (see docs/dhikr/21-decision-log.md for the recorded
 * evidence). Do not treat this file as proof that runtime auth works.
 */

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const FAKE_CREDENTIALS = JSON.stringify([
  { email: "fake.staff@example.invalid", password: "fake-test-password-only", name: "Fake Staff", role: "systems" },
]);

async function withStaffCredentialsEnv<T>(value: string | undefined, fn: () => Promise<T>): Promise<T> {
  const previous = process.env.STAFF_CREDENTIALS;
  if (value === undefined) delete process.env.STAFF_CREDENTIALS;
  else process.env.STAFF_CREDENTIALS = value;
  try {
    // Re-import fresh each time isn't possible without a module cache reset;
    // config.ts reads process.env.STAFF_CREDENTIALS at call time (inside the
    // function body, not at module load), so a plain re-import is fine here.
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.STAFF_CREDENTIALS;
    else process.env.STAFF_CREDENTIALS = previous;
  }
}

async function testMissingEnvVarReturnsEmptyArray() {
  const { getStaffCredentials } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(undefined, async () => {
    const result = getStaffCredentials();
    assert(Array.isArray(result) && result.length === 0, "Missing STAFF_CREDENTIALS must return an empty array, not throw");
  });
  console.log("✓ missing STAFF_CREDENTIALS returns an empty array (fails closed — no staff can match)");
}

async function testMalformedJsonReturnsEmptyArray() {
  const { getStaffCredentials } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv("{not valid json", async () => {
    const result = getStaffCredentials();
    assert(Array.isArray(result) && result.length === 0, "Malformed STAFF_CREDENTIALS JSON must return an empty array, not throw");
  });
  console.log("✓ malformed STAFF_CREDENTIALS JSON returns an empty array rather than crashing or matching anything");
}

async function testValidJsonParsesCorrectly() {
  const { getStaffCredentials } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(FAKE_CREDENTIALS, async () => {
    const result = getStaffCredentials();
    assert(result.length === 1, "Valid STAFF_CREDENTIALS JSON must parse to the expected number of entries");
    assert(result[0].email === "fake.staff@example.invalid", "Parsed entry must retain its email field");
    assert(result[0].role === "systems", "Parsed entry must retain its role field");
  });
  console.log("✓ valid STAFF_CREDENTIALS JSON parses into the expected shape");
}

async function testAuthorizeRejectsWrongPassword() {
  const { authOptions } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(FAKE_CREDENTIALS, async () => {
    const provider = authOptions.providers[0] as unknown as { options: { authorize: (c: unknown) => Promise<unknown> } };
    const result = await provider.options.authorize({
      email: "fake.staff@example.invalid",
      password: "wrong-password",
    });
    assert(result === null, "authorize() must return null for a wrong password, not throw or partially match");
  });
  console.log("✓ authorize() rejects a correct email with an incorrect password");
}

async function testAuthorizeRejectsUnknownEmail() {
  const { authOptions } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(FAKE_CREDENTIALS, async () => {
    const provider = authOptions.providers[0] as unknown as { options: { authorize: (c: unknown) => Promise<unknown> } };
    const result = await provider.options.authorize({
      email: "nobody@example.invalid",
      password: "fake-test-password-only",
    });
    assert(result === null, "authorize() must return null for an email not present in STAFF_CREDENTIALS");
  });
  console.log("✓ authorize() rejects an email that does not exist in STAFF_CREDENTIALS");
}

async function testAuthorizeAcceptsCorrectCredentialsCaseInsensitiveEmail() {
  const { authOptions } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(FAKE_CREDENTIALS, async () => {
    const provider = authOptions.providers[0] as unknown as { options: { authorize: (c: unknown) => Promise<{ email: string; role: string } | null> } };
    const result = await provider.options.authorize({
      email: "FAKE.STAFF@EXAMPLE.INVALID",
      password: "fake-test-password-only",
    });
    assert(result !== null, "authorize() must accept a correct email/password pair");
    assert(result!.email === "fake.staff@example.invalid", "authorize() must match email case-insensitively, per the existing .toLowerCase() comparison");
    assert(result!.role === "systems", "authorize() must return the matched staff member's role");
  });
  console.log("✓ authorize() accepts correct credentials, matching email case-insensitively, and returns the role");
}

async function testAuthorizeRejectsMissingFields() {
  const { authOptions } = await import("../../src/lib/auth/config");
  await withStaffCredentialsEnv(FAKE_CREDENTIALS, async () => {
    const provider = authOptions.providers[0] as unknown as { options: { authorize: (c: unknown) => Promise<unknown> } };
    const noEmail = await provider.options.authorize({ password: "fake-test-password-only" });
    const noPassword = await provider.options.authorize({ email: "fake.staff@example.invalid" });
    const empty = await provider.options.authorize(undefined);
    assert(noEmail === null, "authorize() must reject a request with no email");
    assert(noPassword === null, "authorize() must reject a request with no password");
    assert(empty === null, "authorize() must reject entirely absent credentials without throwing");
  });
  console.log("✓ authorize() rejects requests missing email and/or password, without throwing");
}

async function runAll() {
  await testMissingEnvVarReturnsEmptyArray();
  await testMalformedJsonReturnsEmptyArray();
  await testValidJsonParsesCorrectly();
  await testAuthorizeRejectsWrongPassword();
  await testAuthorizeRejectsUnknownEmail();
  await testAuthorizeAcceptsCorrectCredentialsCaseInsensitiveEmail();
  await testAuthorizeRejectsMissingFields();
  console.log("\nAll staff-credentials unit tests passed.");
}

runAll();
