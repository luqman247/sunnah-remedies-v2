/**
 * Consent Banner — minimal CMP implementing Consent Mode v2.
 *
 * Granular categories: strictly-necessary (always on), analytics,
 * functional, marketing. No pre-ticked boxes; reject is as easy as accept.
 *
 * On small viewports the banner must not cover primary page actions:
 * body padding tracks the banner height so links remain reachable by scroll,
 * and mobile padding/copy stay compact so the first viewport stays usable.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  grantAllConsent,
  denyAllConsent,
  updateConsent,
} from "./consent";
import { initClarity } from "./clarity";
import type { ConsentConfig } from "./types";
import "./consent-banner.css";

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
  const bannerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!visible) {
      document.body.style.removeProperty("padding-bottom");
      return;
    }

    const el = bannerRef.current;
    if (!el) return;

    const syncPadding = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    };

    syncPadding();
    const observer = new ResizeObserver(syncPadding);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.body.style.removeProperty("padding-bottom");
    };
  }, [visible, showDetails]);

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
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="consent-banner"
    >
      <div className="consent-banner__inner">
        <p className="consent-banner__copy">
          This institution uses cookies to measure how our knowledge, education,
          and services are used — so we can improve them. We never track personal
          health or student information through analytics. You may accept, reject,
          or customise your preferences
        </p>

        {showDetails && (
          <div className="consent-banner__details">
            <label className="consent-banner__option consent-banner__option--muted">
              <input type="checkbox" checked disabled />
              Strictly necessary (always active)
            </label>
            <label className="consent-banner__option">
              <input
                type="checkbox"
                checked={preferences.analytics_storage === "granted"}
                onChange={() => togglePreference("analytics_storage")}
              />
              Analytics — understand how content and services are used
            </label>
            <label className="consent-banner__option">
              <input
                type="checkbox"
                checked={preferences.ad_storage === "granted"}
                onChange={() => togglePreference("ad_storage")}
              />
              Marketing — measure the effectiveness of outreach
            </label>
          </div>
        )}

        <div className="consent-banner__actions">
          <button type="button" onClick={handleRejectAll} className="consent-banner__btn consent-banner__btn--outline">
            Reject all
          </button>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="consent-banner__btn consent-banner__btn--outline"
          >
            {showDetails ? "Hide preferences" : "Customise"}
          </button>
          {showDetails ? (
            <button type="button" onClick={handleSavePreferences} className="consent-banner__btn consent-banner__btn--solid">
              Save preferences
            </button>
          ) : (
            <button type="button" onClick={handleAcceptAll} className="consent-banner__btn consent-banner__btn--solid">
              Accept analytics
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function requestIdleCallbackSafe(fn: () => void): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(fn);
  } else {
    setTimeout(fn, 200);
  }
}
