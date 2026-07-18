/**
 * Consent Banner — minimal CMP implementing Consent Mode v2.
 *
 * Granular categories: strictly-necessary (always on), analytics,
 * functional, marketing. No pre-ticked boxes; reject is as easy as accept.
 *
 * Copy is localised via next-intl. Consent storage (`sr_consent_v1`) is
 * language-agnostic — switching locale must not reset a prior choice.
 *
 * On small viewports the banner must not cover primary page actions:
 * body padding tracks the banner height so links remain reachable by scroll,
 * and mobile padding/copy stay compact so the first viewport stays usable.
 */

"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  grantAllConsent,
  denyAllConsent,
  updateConsent,
} from "./consent";
import { initClarity } from "./clarity";
import type { ConsentConfig } from "./types";
import "./consent-banner.css";

const CONSENT_STORAGE_KEY = "sr_consent_v1";

function subscribeConsentStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function readNeedsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === null;
  } catch {
    return true;
  }
}

export function ConsentBanner() {
  const t = useTranslations("consent");
  const needsConsent = useSyncExternalStore(
    subscribeConsentStorage,
    readNeedsConsent,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  const visible = needsConsent && !dismissed;
  const [showDetails, setShowDetails] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [preferences, setPreferences] = useState<ConsentConfig>({
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  const bannerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const manageButtonRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string>("");
  const titleId = useId();
  const prefsTitleId = useId();

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

  const closePreferences = useCallback(() => {
    setShowDetails(false);
    queueMicrotask(() => manageButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!showDetails) {
      if (previousOverflow.current !== "") {
        document.body.style.overflow = previousOverflow.current;
        previousOverflow.current = "";
      } else {
        document.body.style.removeProperty("overflow");
      }
      return;
    }

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = detailsRef.current;
    const focusable = panel?.querySelector<HTMLElement>(
      'input:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePreferences();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow.current || "";
      if (!previousOverflow.current) {
        document.body.style.removeProperty("overflow");
      }
    };
  }, [showDetails, closePreferences]);

  if (!visible) return null;

  const handleAcceptAll = () => {
    try {
      grantAllConsent();
      requestIdleCallbackSafe(() => initClarity());
      setStatusMessage(t("saved"));
      setDismissed(true);
    } catch {
      setStatusMessage(t("error"));
    }
  };

  const handleRejectAll = () => {
    try {
      denyAllConsent();
      setStatusMessage(t("saved"));
      setDismissed(true);
    } catch {
      setStatusMessage(t("error"));
    }
  };

  const handleSavePreferences = () => {
    try {
      updateConsent(preferences);
      if (preferences.analytics_storage === "granted") {
        requestIdleCallbackSafe(() => initClarity());
      }
      setStatusMessage(t("saved"));
      setDismissed(true);
    } catch {
      setStatusMessage(t("error"));
    }
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
      aria-modal={showDetails ? "true" : "false"}
      aria-labelledby={showDetails ? prefsTitleId : titleId}
      aria-label={showDetails ? t("ariaPreferences") : t("ariaBanner")}
      className={`consent-banner${showDetails ? " consent-banner--preferences-open" : ""}`}
    >
      <div className="consent-banner__inner">
        <h2 id={titleId} className="consent-banner__heading">
          {t("bannerHeading")}
        </h2>
        <p className="consent-banner__copy">
          {t("bannerBody")}{" "}
          <Link href="/charter" className="consent-banner__privacy">
            {t("privacyPolicy")}
          </Link>
        </p>

        {showDetails && (
          <div
            ref={detailsRef}
            className="consent-banner__details"
            role="region"
            aria-labelledby={prefsTitleId}
          >
            <div className="consent-banner__details-header">
              <h3 id={prefsTitleId} className="consent-banner__prefs-title">
                {t("preferencesTitle")}
              </h3>
              <button
                type="button"
                className="consent-banner__close"
                onClick={closePreferences}
                aria-label={t("ariaClose")}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <label className="consent-banner__option consent-banner__option--muted">
              <input type="checkbox" checked disabled aria-describedby={`${prefsTitleId}-necessary`} />
              <span>
                <span className="consent-banner__option-name">{t("strictlyNecessary")}</span>
                <span id={`${prefsTitleId}-necessary`} className="consent-banner__option-desc">
                  {t("strictlyNecessaryDesc")} — {t("alwaysActive")}
                </span>
              </span>
            </label>
            <label className="consent-banner__option">
              <input
                type="checkbox"
                checked={preferences.analytics_storage === "granted"}
                onChange={() => togglePreference("analytics_storage")}
                aria-describedby={`${prefsTitleId}-analytics`}
              />
              <span>
                <span className="consent-banner__option-name">{t("analytics")}</span>
                <span id={`${prefsTitleId}-analytics`} className="consent-banner__option-desc">
                  {t("analyticsDesc")}
                </span>
              </span>
            </label>
            <label className="consent-banner__option">
              <input
                type="checkbox"
                checked={preferences.ad_storage === "granted"}
                onChange={() => {
                  setPreferences((prev) => {
                    const next =
                      prev.ad_storage === "granted" ? "denied" : "granted";
                    return {
                      ...prev,
                      ad_storage: next,
                      ad_user_data: next,
                      ad_personalization: next,
                    };
                  });
                }}
                aria-describedby={`${prefsTitleId}-marketing`}
              />
              <span>
                <span className="consent-banner__option-name">{t("marketing")}</span>
                <span id={`${prefsTitleId}-marketing`} className="consent-banner__option-desc">
                  {t("marketingDesc")}
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="consent-banner__actions">
          <button
            type="button"
            onClick={handleRejectAll}
            className="consent-banner__btn consent-banner__btn--outline"
          >
            {t("reject")}
          </button>
          <button
            ref={manageButtonRef}
            type="button"
            onClick={() => setShowDetails((open) => !open)}
            className="consent-banner__btn consent-banner__btn--outline"
            aria-expanded={showDetails}
            aria-controls={showDetails ? prefsTitleId : undefined}
          >
            {showDetails ? t("hidePreferences") : t("managePreferences")}
          </button>
          {showDetails ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="consent-banner__btn consent-banner__btn--solid"
            >
              {t("savePreferences")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAcceptAll}
              className="consent-banner__btn consent-banner__btn--solid"
            >
              {t("accept")}
            </button>
          )}
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage}
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
