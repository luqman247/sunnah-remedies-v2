/**
 * Consent Banner — minimal CMP implementing Consent Mode v2.
 *
 * Granular categories: strictly-necessary (always on), analytics,
 * functional, marketing. No pre-ticked boxes; reject is as easy as accept.
 *
 * Styled with existing design tokens for consistency. Invisible until
 * the user has not yet made a consent choice.
 */

"use client";

import { useState, useEffect } from "react";
import {
  getConsentState,
  grantAllConsent,
  denyAllConsent,
  updateConsent,
} from "./consent";
import { initClarity } from "./clarity";
import type { ConsentConfig } from "./types";

const CONSENT_STORAGE_KEY = "sr_consent_v1";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentConfig>({
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    grantAllConsent();
    requestIdleCallbackSafe(() => initClarity());
    setVisible(false);
  };

  const handleRejectAll = () => {
    denyAllConsent();
    setVisible(false);
  };

  const handleSavePreferences = () => {
    updateConsent(preferences);
    if (preferences.analytics_storage === "granted") {
      requestIdleCallbackSafe(() => initClarity());
    }
    setVisible(false);
  };

  const togglePreference = (key: keyof ConsentConfig) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: prev[key] === "granted" ? "denied" : "granted",
    }));
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "1.5rem",
        backgroundColor: "var(--color-surface, #1a1a2e)",
        color: "var(--color-text, #F6F3EE)",
        borderTop: "1px solid var(--color-border, #C7A25A)",
        fontFamily: "var(--font-body, serif)",
        fontSize: "0.875rem",
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p style={{ marginBottom: "1rem" }}>
          This institution uses cookies to measure how our knowledge, education,
          and services are used — so we can improve them. We never track personal
          health or student information through analytics. You may accept, reject,
          or customise your preferences
        </p>

        {showDetails && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", opacity: 0.6 }}>
              <input type="checkbox" checked disabled style={{ marginRight: "0.5rem" }} />
              Strictly necessary (always active)
            </label>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                checked={preferences.analytics_storage === "granted"}
                onChange={() => togglePreference("analytics_storage")}
                style={{ marginRight: "0.5rem" }}
              />
              Analytics — understand how content and services are used
            </label>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                checked={preferences.ad_storage === "granted"}
                onChange={() => togglePreference("ad_storage")}
                style={{ marginRight: "0.5rem" }}
              />
              Marketing — measure the effectiveness of outreach
            </label>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={handleRejectAll} style={buttonStyle("outline")}>
            Reject all
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={buttonStyle("outline")}
          >
            {showDetails ? "Hide preferences" : "Customise"}
          </button>
          {showDetails ? (
            <button onClick={handleSavePreferences} style={buttonStyle("solid")}>
              Save preferences
            </button>
          ) : (
            <button onClick={handleAcceptAll} style={buttonStyle("solid")}>
              Accept analytics
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function buttonStyle(
  variant: "solid" | "outline"
): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "0.5rem 1.25rem",
    fontSize: "0.8125rem",
    fontFamily: "var(--font-utility, monospace)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    border: "1px solid var(--color-border, #C7A25A)",
    transition: "background-color 0.15s, color 0.15s",
  };

  if (variant === "solid") {
    return {
      ...base,
      backgroundColor: "var(--color-border, #C7A25A)",
      color: "var(--color-surface, #1a1a2e)",
    };
  }

  return {
    ...base,
    backgroundColor: "transparent",
    color: "var(--color-text, #F6F3EE)",
  };
}

function requestIdleCallbackSafe(fn: () => void): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(fn);
  } else {
    setTimeout(fn, 200);
  }
}
