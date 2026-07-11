/**
 * Wizard draft recovery — local browser cache between steps / refresh.
 * Canonical data remains in Sanity; this only recovers in-progress UI state.
 */

import type {
  AcceptedContent,
  WizardDetails,
  WizardMediaImage,
  WizardPricing,
  WizardVideo,
} from "./types";

const STORAGE_KEY = "sr-seller-centre-wizard-v1";

export interface WizardPersistedState {
  publishedId: string | null;
  step: number;
  details: WizardDetails;
  slugTouched: boolean;
  images: WizardMediaImage[];
  videos: WizardVideo[];
  content: AcceptedContent;
  pricing: WizardPricing;
  variantNote: string;
  savedAt: string;
}

export function loadWizardPersistence(): WizardPersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardPersistedState;
  } catch {
    return null;
  }
}

export function saveWizardPersistence(state: Omit<WizardPersistedState, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: WizardPersistedState = {
      ...state,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode — ignore
  }
}

export function clearWizardPersistence(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
