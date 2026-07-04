/**
 * Analytics Provider — client component that bootstraps all analytics.
 *
 * Sequence:
 *   1. Set consent defaults (denied for all)
 *   2. Restore any previously granted consent
 *   3. Initialize GTM (consent-gated by the container)
 *   4. Conditionally load Clarity (if analytics consent granted)
 *   5. Track page views on route changes
 *
 * This component is invisible — no DOM output, no layout impact.
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { setDefaultConsent, restoreConsent, hasConsent } from "./consent";
import { initGTM, pushToDataLayer, setContentGroup } from "./gtm";
import { initClarity, setClarityTag } from "./clarity";

export function AnalyticsProvider(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setDefaultConsent();
    restoreConsent();
    initGTM();

    if (hasConsent("analytics_storage")) {
      requestIdleCallbackSafe(() => initClarity());
    }
  }, []);

  useEffect(() => {
    const pillar = extractPillar(pathname);
    const contentType = extractContentType(pathname);
    if (pillar) setContentGroup(pillar, contentType);

    pushToDataLayer({
      event: "page_view",
      page_path: pathname,
      page_search: searchParams.toString(),
      pillar,
      content_type: contentType,
    });

    setClarityTag("pillar", pillar);
    setClarityTag("content_type", contentType);
  }, [pathname, searchParams]);

  return null;
}

function extractPillar(pathname: string): string {
  if (pathname.includes("/the-apothecary")) return "apothecary";
  if (pathname.includes("/the-academy")) return "academy";
  if (pathname.includes("/sacred-journeys")) return "journeys";
  if (pathname.includes("/knowledge-library") || pathname.includes("/knowledge")) return "knowledge";
  if (pathname.includes("/consultations")) return "clinical";
  if (pathname.includes("/research") || pathname.includes("/institute")) return "institute";
  return "institute";
}

function extractContentType(pathname: string): string {
  if (pathname.includes("/knowledge-library/")) return "article";
  if (pathname.includes("/the-apothecary/") && !pathname.endsWith("/the-apothecary")) return "product";
  if (pathname.includes("/the-academy/") && !pathname.endsWith("/the-academy")) return "course";
  if (pathname.includes("/knowledge/")) return "entity";
  if (pathname.includes("/consultations")) return "consultation";
  if (pathname.includes("/sacred-journeys/")) return "journey";
  return "page";
}

function requestIdleCallbackSafe(fn: () => void): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(fn);
  } else {
    setTimeout(fn, 200);
  }
}
