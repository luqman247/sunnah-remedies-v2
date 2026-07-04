/**
 * Consent Management — Consent Mode v2 integration.
 *
 * Default = denied for all storage categories (institutional posture).
 * Consent is only granted on explicit CMP grant. Advanced Consent Mode
 * enables GA4 behavioural modelling for denied users.
 *
 * This module wires the CMP to Google Consent Mode v2 and gates
 * all analytics script loading behind consent state.
 */

"use client";

import type { ConsentConfig, ConsentState } from "./types";

const CONSENT_STORAGE_KEY = "sr_consent_v1";
const CONSENT_VERSION = 1;

interface StoredConsent {
  version: number;
  timestamp: number;
  config: ConsentConfig;
}

const DEFAULT_CONSENT: ConsentConfig = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Set default consent state — called before any analytics loads.
 * Pushes Consent Mode v2 defaults to the dataLayer.
 */
export function setDefaultConsent(): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_default",
    consent: {
      ...DEFAULT_CONSENT,
      wait_for_update: 500,
    },
  });

  pushConsentCommand("default", DEFAULT_CONSENT);
}

/**
 * Update consent state after user interaction with CMP.
 */
export function updateConsent(config: Partial<ConsentConfig>): void {
  const merged: ConsentConfig = { ...DEFAULT_CONSENT, ...config };

  pushConsentCommand("update", merged);

  const stored: StoredConsent = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    config: merged,
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable — consent still applied in-memory via dataLayer
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    ...merged,
  });
}

/**
 * Restore previously stored consent state on page load.
 * Returns the restored config, or null if no valid consent exists.
 */
export function restoreConsent(): ConsentConfig | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const stored: StoredConsent = JSON.parse(raw);
    if (stored.version !== CONSENT_VERSION) return null;

    pushConsentCommand("update", stored.config);
    return stored.config;
  } catch {
    return null;
  }
}

/**
 * Check if a specific consent category is granted.
 */
export function hasConsent(category: keyof ConsentConfig): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;

    const stored: StoredConsent = JSON.parse(raw);
    return stored.config[category] === "granted";
  } catch {
    return false;
  }
}

/**
 * Get the current consent state.
 */
export function getConsentState(): ConsentConfig {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;

    const stored: StoredConsent = JSON.parse(raw);
    return stored.config;
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Grant all analytics consent categories.
 */
export function grantAllConsent(): void {
  updateConsent({
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Deny all consent (revert to default).
 */
export function denyAllConsent(): void {
  updateConsent(DEFAULT_CONSENT);
}

/* ── Internal ──────────────────────────────────────────────────── */

function pushConsentCommand(
  command: "default" | "update",
  config: ConsentConfig
): void {
  if (typeof window === "undefined") return;

  const gtag = getGtag();
  gtag("consent", command, {
    analytics_storage: config.analytics_storage,
    ad_storage: config.ad_storage,
    ad_user_data: config.ad_user_data,
    ad_personalization: config.ad_personalization,
  });
}

function getGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(Object.fromEntries(args.map((a, i) => [String(i), a])));
  }
  return gtag;
}

/* ── Global type augmentation ──────────────────────────────────── */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
