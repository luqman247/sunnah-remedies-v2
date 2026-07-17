/**
 * Duʿa & Dhikr — local-only reading-progress tests.
 *
 * Runs under plain Node (via tsx), so `window`/`localStorage` do not exist
 * by default — this both proves the SSR-safe no-op path and, via a small
 * in-memory shim, proves the browser-side read/write behaviour.
 */

// Forces module scope (rather than a global script) so this file's
// `assert`/`runAll` do not collide, under whole-program `tsc --noEmit`,
// with same-named top-level functions in other no-import test files
// (e.g. tests/auth/staff-credentials.test.ts).
export {};

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function installLocalStorageShim() {
  const store = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  };
}

function uninstallLocalStorageShim() {
  delete (globalThis as unknown as { window?: unknown }).window;
}

async function testFunctionsAreNoOpsWithoutWindow() {
  uninstallLocalStorageShim();
  // Force a fresh module instance so it re-evaluates `typeof window` at call time, not import time.
  const mod = await import("../../src/lib/dua-dhikr/local-storage");
  assert(mod.getMemoriseState("any-id") === undefined, "getMemoriseState must return undefined when window is unavailable (SSR-safe)");
  mod.setMemoriseState("any-id", "learning"); // must not throw
  assert(mod.getContinueReading().length === 0, "getContinueReading must return an empty array when window is unavailable");
  mod.recordCollectionVisit("home", "Home"); // must not throw
  console.log("✓ local-storage functions are safe no-ops when window/localStorage is unavailable (SSR)");
}

async function testMemoriseStateRoundTrips() {
  installLocalStorageShim();
  const mod = await import("../../src/lib/dua-dhikr/local-storage");
  mod.setMemoriseState("entry-1", "learning");
  assert(mod.getMemoriseState("entry-1") === "learning", 'expected "learning" state to round-trip');
  mod.setMemoriseState("entry-1", "memorised");
  assert(mod.getMemoriseState("entry-1") === "memorised", 'expected state to update to "memorised"');
  mod.setMemoriseState("entry-1", undefined);
  assert(mod.getMemoriseState("entry-1") === undefined, "clearing state must remove it entirely");
  uninstallLocalStorageShim();
  console.log("✓ memorise/learning state round-trips through local storage and can be cleared");
}

async function testContinueReadingCapsAndOrdersByRecency() {
  installLocalStorageShim();
  const mod = await import("../../src/lib/dua-dhikr/local-storage");
  for (let i = 0; i < 10; i++) {
    mod.recordCollectionVisit(`collection-${i}`, `Collection ${i}`);
  }
  const list = mod.getContinueReading();
  assert(list.length === 8, `continue-reading list must cap at 8 entries, got ${list.length}`);
  assert(list[0].collectionSlug === "collection-9", "most recently visited collection must be first");
  mod.recordCollectionVisit("collection-3", "Collection 3");
  const listAfterRevisit = mod.getContinueReading();
  assert(listAfterRevisit[0].collectionSlug === "collection-3", "revisiting a collection must move it to the front, not duplicate it");
  assert(listAfterRevisit.length === 8, "revisiting an existing entry must not grow the list beyond the cap");
  uninstallLocalStorageShim();
  console.log("✓ continue-reading list caps at 8 entries and moves revisited collections to the front without duplicating");
}

async function testNoGamificationFieldsInStoredShape() {
  installLocalStorageShim();
  const mod = await import("../../src/lib/dua-dhikr/local-storage");
  mod.setMemoriseState("entry-1", "learning");
  const raw = (globalThis as unknown as { window: { localStorage: { getItem(key: string): string | null } } }).window.localStorage.getItem(
    "sr:duaDhikr:v1",
  );
  assert(!!raw, "the storage key must have been written");
  const forbidden = ["streak", "score", "points", "badge", "level"];
  for (const term of forbidden) {
    assert(!raw!.toLowerCase().includes(term), `stored shape must not contain gamification field "${term}"`);
  }
  uninstallLocalStorageShim();
  console.log("✓ the stored local-storage shape contains no streak/score/points/badge/level fields");
}

async function runAll() {
  await testFunctionsAreNoOpsWithoutWindow();
  await testMemoriseStateRoundTrips();
  await testContinueReadingCapsAndOrdersByRecency();
  await testNoGamificationFieldsInStoredShape();
  console.log("\nAll Duʿa & Dhikr local-storage tests passed.");
}

runAll();
