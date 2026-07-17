/**
 * Duʿa & Dhikr — account-free, local-storage-only reading progress.
 *
 * Following the same rationale as docs/dhikr/16-privacy-and-local-storage-
 * policy.md and docs/dhikr/08-memorisation-system.md (written for Morning/
 * Evening Dhikr but never implemented there — see docs/dua-dhikr/README.md):
 * no account, no server round-trip, no analytics event tied to an
 * individual's recitation. Everything here is a plain per-entry state on
 * the visitor's own device, degrading silently to a no-op when
 * localStorage is unavailable (private browsing, SSR, disabled storage).
 *
 * This is deliberately NOT a streak/points/gamification system — see
 * docs/dua-dhikr/README.md, "Memorisation mode is a reading aid, not a
 * gamified app": no counters that reward speed, no leaderboard, no badge.
 */

const STORAGE_KEY = "sr:duaDhikr:v1";

export type MemoriseState = "learning" | "memorised";

interface StoredShape {
  /** entryId -> memorise state */
  memorise: Record<string, MemoriseState>;
  /** Most recent collection slugs visited, most recent last, capped at 8. */
  continueReading: { collectionSlug: string; titleEn: string; visitedAt: string }[];
}

function readStore(): StoredShape {
  const empty: StoredShape = { memorise: {}, continueReading: [] };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<StoredShape>;
    return {
      memorise: parsed.memorise ?? {},
      continueReading: parsed.continueReading ?? [],
    };
  } catch {
    return empty;
  }
}

function writeStore(store: StoredShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage unavailable (private browsing, quota, disabled) — fail silently.
  }
}

export function getMemoriseState(entryId: string): MemoriseState | undefined {
  return readStore().memorise[entryId];
}

export function setMemoriseState(entryId: string, state: MemoriseState | undefined): void {
  const store = readStore();
  if (state === undefined) {
    delete store.memorise[entryId];
  } else {
    store.memorise[entryId] = state;
  }
  writeStore(store);
}

const MAX_CONTINUE_READING = 8;

export function recordCollectionVisit(collectionSlug: string, titleEn: string): void {
  const store = readStore();
  const withoutCurrent = store.continueReading.filter((entry) => entry.collectionSlug !== collectionSlug);
  const updated = [...withoutCurrent, { collectionSlug, titleEn, visitedAt: new Date().toISOString() }].slice(
    -MAX_CONTINUE_READING,
  );
  writeStore({ ...store, continueReading: updated });
}

export function getContinueReading(): StoredShape["continueReading"] {
  return [...readStore().continueReading].reverse();
}
