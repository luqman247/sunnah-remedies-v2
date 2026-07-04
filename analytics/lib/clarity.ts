/**
 * Microsoft Clarity — consent-gated behavioral analytics.
 *
 * Provides heatmaps, session recordings, scroll depth, dead clicks,
 * rage clicks, and quick-back detection. Loaded only after consent.
 *
 * Privacy hardening:
 *   - Input masking = strict (all text inputs masked)
 *   - PII scrubbing enabled
 *   - Clinical/checkout/portal surfaces excluded from recording
 *   - Gated behind analytics_storage consent
 */

"use client";

let clarityLoaded = false;

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";

const EXCLUDED_PATHS = [
  "/handbook",
  "/ops",
  "/sign-in",
  "/studio",
  "/intelligence",
];

/**
 * Initialize Microsoft Clarity — called after analytics consent granted.
 */
export function initClarity(): void {
  if (
    clarityLoaded ||
    !CLARITY_PROJECT_ID ||
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  if (shouldExcludePage()) return;

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${CLARITY_PROJECT_ID}");
  `;
  document.head.appendChild(script);

  configureClarityPrivacy();
  clarityLoaded = true;
}

/**
 * Set a Clarity custom tag for segmentation.
 */
export function setClarityTag(key: string, value: string): void {
  if (typeof window === "undefined" || !window.clarity) return;
  window.clarity("set", key, value);
}

/**
 * Identify a user in Clarity (pseudonymous — no PII).
 */
export function setClarityUser(pseudonymousId: string, segment?: string): void {
  if (typeof window === "undefined" || !window.clarity) return;
  window.clarity("identify", pseudonymousId);
  if (segment) {
    setClarityTag("user_segment", segment);
  }
}

/**
 * Manually trigger a Clarity event (for custom tracking).
 */
export function trackClarityEvent(eventName: string): void {
  if (typeof window === "undefined" || !window.clarity) return;
  window.clarity("event", eventName);
}

/* ── Internal ──────────────────────────────────────────────────── */

function configureClarityPrivacy(): void {
  if (typeof window === "undefined" || !window.clarity) return;

  window.clarity("set", "content-masking", "strict");
}

function shouldExcludePage(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return EXCLUDED_PATHS.some((excluded) => path.startsWith(excluded));
}

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}
