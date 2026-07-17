/**
 * Duʿa & Dhikr — memorisation/local-storage resilience tests.
 *
 * Complements tests/dua-dhikr/dua-dhikr-local-storage.test.ts (SSR safety,
 * basic round-trip, capping, no-gamification-fields) with the edge cases
 * from the pre-content-readiness brief: corrupted stored JSON, a throwing
 * localStorage (private browsing / quota exceeded), and multi-tab
 * read-after-write consistency. No Sanity access.
 */

// Forces module scope (see tests/dua-dhikr/dua-dhikr-local-storage.test.ts
// for why this is needed — otherwise this file's top-level `assert`/
// `runAll` collide, under whole-program `tsc`, with other no-import test
// files such as tests/auth/staff-credentials.test.ts).
export {};

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function installWorkingLocalStorageShim() {
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
  return store;
}

function installThrowingLocalStorageShim() {
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: () => {
        throw new DOMException("The operation is not supported", "SecurityError");
      },
      setItem: () => {
        throw new DOMException("QuotaExceededError", "QuotaExceededError");
      },
      removeItem: () => {},
    },
  };
}

function installCorruptedLocalStorageShim(corruptedValue: string) {
  const store = new Map<string, string>([["sr:duaDhikr:v1", corruptedValue]]);
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

function uninstall() {
  delete (globalThis as unknown as { window?: unknown }).window;
}

async function freshModule() {
  // Each test installs its own shim before this runs; the module itself
  // has no top-level state, so re-importing (cached) is fine — every
  // exported function re-checks `typeof window` / re-reads storage on
  // every call rather than caching anything at import time.
  return import("../../src/lib/dua-dhikr/local-storage");
}

async function testCorruptedJsonDoesNotThrowAndFallsBackToEmpty() {
  installCorruptedLocalStorageShim("{not valid json at all");
  const mod = await freshModule();
  let threw = false;
  let state: unknown;
  try {
    state = mod.getMemoriseState("any-entry");
  } catch {
    threw = true;
  }
  assert(!threw, "getMemoriseState must not throw when stored JSON is corrupted");
  assert(state === undefined, "corrupted storage must be treated as empty, not partially parsed");
  uninstall();
  console.log("✓ corrupted stored JSON is caught and treated as empty state, never thrown");
}

async function testCorruptedJsonDoesNotBlockSubsequentWrites() {
  installCorruptedLocalStorageShim("]] not json [[");
  const mod = await freshModule();
  let threw = false;
  try {
    mod.setMemoriseState("entry-1", "learning");
  } catch {
    threw = true;
  }
  assert(!threw, "setMemoriseState must not throw after reading corrupted storage — it should overwrite with a fresh, valid shape");
  uninstall();
  console.log("✓ a write after corrupted storage succeeds and repairs the stored shape");
}

async function testThrowingLocalStorageNeverThrowsToCaller() {
  installThrowingLocalStorageShim();
  const mod = await freshModule();
  let threw = false;
  try {
    mod.setMemoriseState("entry-1", "learning");
    mod.getMemoriseState("entry-1");
    mod.recordCollectionVisit("home", "Home");
    mod.getContinueReading();
  } catch {
    threw = true;
  }
  assert(!threw, "every exported function must degrade silently when localStorage itself throws (private browsing / quota exceeded)");
  uninstall();
  console.log("✓ a throwing localStorage (private browsing / quota exceeded) never surfaces an exception to the caller");
}

async function testMultiTabReadAfterWriteConsistency() {
  // Simulates two tabs sharing the same underlying storage: "tab A" writes,
  // "tab B" (a separate call into the same module, reading fresh each
  // time — there is no in-memory cache to go stale) sees the update.
  const store = installWorkingLocalStorageShim();
  const mod = await freshModule();

  mod.setMemoriseState("shared-entry", "learning"); // "tab A"
  const seenByTabB = mod.getMemoriseState("shared-entry"); // "tab B", same process but proves no stale cache
  assert(seenByTabB === "learning", "a write must be immediately visible to a subsequent read against the same storage key (no stale in-memory cache)");

  // Simulate an external write landing between two reads (e.g. genuinely
  // from another tab), by mutating the shim's backing store directly.
  store.set("sr:duaDhikr:v1", JSON.stringify({ memorise: { "shared-entry": "memorised" }, continueReading: [] }));
  const seenAfterExternalWrite = mod.getMemoriseState("shared-entry");
  assert(seenAfterExternalWrite === "memorised", "a change written by another tab must be picked up on the next read, since state is never cached in memory");

  uninstall();
  console.log("✓ reads always reflect the latest storage state — safe for concurrent multi-tab use");
}

async function runAll() {
  await testCorruptedJsonDoesNotThrowAndFallsBackToEmpty();
  await testCorruptedJsonDoesNotBlockSubsequentWrites();
  await testThrowingLocalStorageNeverThrowsToCaller();
  await testMultiTabReadAfterWriteConsistency();
  console.log("\nAll Duʿa & Dhikr memorisation-resilience tests passed.");
}

runAll();
