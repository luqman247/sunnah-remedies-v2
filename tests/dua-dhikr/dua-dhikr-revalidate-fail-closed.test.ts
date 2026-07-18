/**
 * Revalidation endpoint — fail-closed security regression test.
 *
 * Runs in its own process (a fresh module cache) with
 * REVALIDATION_SECRET deliberately left unset, matching the real
 * production defect this guards against: the endpoint must reject EVERY
 * request when the secret isn't configured, never silently accept them.
 * A prior version of this endpoint only checked the header when the
 * secret env var was truthy, so an unconfigured secret let any request
 * through unauthenticated.
 */

import Module from "node:module";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

delete process.env.REVALIDATION_SECRET;

const revalidatePathCalls: string[] = [];
const originalLoad = (Module as any)._load;
(Module as any)._load = function (request: string, ...rest: unknown[]) {
  if (request === "next/cache") {
    return { revalidatePath: (path: string) => revalidatePathCalls.push(path) };
  }
  if (request === "next/server") {
    return {
      NextRequest: class {},
      NextResponse: { json: (body: unknown, init?: { status?: number }) => ({ body, status: init?.status ?? 200 }) },
    };
  }
  return originalLoad.call(this, request, ...rest);
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { POST } = require("../../src/app/api/revalidate/route");
(Module as any)._load = originalLoad;

function fakeRequest(body: unknown, secretHeader?: string) {
  return {
    headers: { get: (name: string) => (name === "x-revalidation-secret" ? secretHeader : null) },
    json: async () => body,
  };
}

async function testUnsetSecretRejectsEveryRequest() {
  assert(process.env.REVALIDATION_SECRET === undefined, "test setup error: REVALIDATION_SECRET must be unset for this test");

  const withNoHeader = await POST(fakeRequest({ _type: "duaDhikrEntry" }, undefined) as any);
  assert(withNoHeader.status === 401, `with no header and no configured secret, expected 401, got ${withNoHeader.status}`);

  const withEmptyHeader = await POST(fakeRequest({ _type: "duaDhikrEntry" }, "") as any);
  assert(withEmptyHeader.status === 401, `with an empty header and no configured secret, expected 401, got ${withEmptyHeader.status}`);

  const withArbitraryHeader = await POST(fakeRequest({ _type: "duaDhikrEntry" }, "anything-at-all") as any);
  assert(withArbitraryHeader.status === 401, `with an arbitrary header and no configured secret, expected 401, got ${withArbitraryHeader.status}`);

  assert(revalidatePathCalls.length === 0, `revalidatePath must never be called when REVALIDATION_SECRET is unset — this would mean an unauthenticated request achieved a real effect. Calls: ${JSON.stringify(revalidatePathCalls)}`);

  console.log("✓ with REVALIDATION_SECRET unset, every request (no header / empty header / arbitrary header) is rejected with 401 and revalidatePath is never called");
}

async function runAll() {
  await testUnsetSecretRejectsEveryRequest();
  console.log("\nRevalidation fail-closed security test passed.");
}

runAll();
