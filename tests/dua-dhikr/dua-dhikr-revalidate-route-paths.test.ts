/**
 * Duʿa & Dhikr — revalidation route-pattern spy test.
 *
 * Runtime test (not a static string check): mocks "next/cache" before the
 * route module is loaded, calls the real exported POST handler for both
 * duaDhikrEntry and duaDhikrCollection, and asserts on the EXACT paths
 * revalidatePath was actually invoked with — so a route-pattern mistake
 * (e.g. missing the [locale] segment the physical file tree requires)
 * is caught by behaviour, not by re-reading the same source text.
 */

import Module from "node:module";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// --- install the next/cache mock BEFORE the route module is required ---
const revalidatePathCalls: { path: string; type?: string }[] = [];
const originalLoad = (Module as any)._load;
(Module as any)._load = function (request: string, ...rest: unknown[]) {
  if (request === "next/cache") {
    return {
      revalidatePath: (path: string, type?: string) => {
        revalidatePathCalls.push({ path, type });
      },
    };
  }
  if (request === "next/server") {
    return {
      NextRequest: class {},
      NextResponse: {
        json: (body: unknown, init?: { status?: number }) => ({ body, status: init?.status ?? 200 }),
      },
    };
  }
  return originalLoad.call(this, request, ...rest);
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { POST } = require("../../src/app/api/revalidate/route");
(Module as any)._load = originalLoad; // restore immediately after load

function fakeRequest(body: unknown, secretHeader?: string) {
  return {
    headers: { get: (name: string) => (name === "x-revalidation-secret" ? secretHeader : null) },
    json: async () => body,
  };
}

async function callAndCapture(_type: string, slug?: string) {
  revalidatePathCalls.length = 0;
  await POST(fakeRequest({ _type, _id: "test-id", slug }) as any);
  return revalidatePathCalls.map((c) => c.path);
}

async function testDuaDhikrEntryRevalidatesTheDynamicCollectionPattern() {
  const paths = await callAndCapture("duaDhikrEntry");
  assert(
    paths.includes("/[locale]/knowledge-library/dua-dhikr/[collectionSlug]"),
    `duaDhikrEntry must revalidate the [locale]-prefixed dynamic collection-page pattern (the physical route lives under src/app/[locale]/...), got: ${JSON.stringify(paths)}`,
  );
  assert(
    paths.includes("/[locale]/knowledge-library/dua-dhikr"),
    `duaDhikrEntry must revalidate the [locale]-prefixed landing page, got: ${JSON.stringify(paths)}`,
  );
  assert(!paths.includes("/knowledge-library/dua-dhikr"), "duaDhikrEntry must not revalidate the un-prefixed path — it does not match the real route and silently does nothing");
  assert(paths.includes("/sitemap.xml"), "duaDhikrEntry must revalidate the sitemap");
  console.log(`✓ duaDhikrEntry revalidates: ${JSON.stringify(paths)}`);
}

async function testDuaDhikrCollectionRevalidatesTheDynamicCollectionPattern() {
  const paths = await callAndCapture("duaDhikrCollection", "waking-up");
  assert(
    paths.includes("/[locale]/knowledge-library/dua-dhikr/[collectionSlug]"),
    `duaDhikrCollection must revalidate the [locale]-prefixed dynamic collection-page pattern, got: ${JSON.stringify(paths)}`,
  );
  assert(paths.includes("/[locale]/knowledge-library/dua-dhikr"), "duaDhikrCollection must revalidate the [locale]-prefixed landing page");
  assert(
    !paths.some((p) => p.includes("[locale]/knowledge-library/dua-dhikr/waking-up")),
    "duaDhikrCollection must not attempt a mixed literal+template path (concrete slug with an unresolved [locale] segment) — the dynamic pattern already covers every locale and slug",
  );
  console.log(`✓ duaDhikrCollection revalidates: ${JSON.stringify(paths)}`);
}

async function runAll() {
  await testDuaDhikrEntryRevalidatesTheDynamicCollectionPattern();
  await testDuaDhikrCollectionRevalidatesTheDynamicCollectionPattern();
  console.log("\nAll Duʿa & Dhikr revalidate-route-path tests passed.");
}

runAll();
