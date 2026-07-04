/**
 * Google Tag Manager bootstrap — consent-gated.
 *
 * GTM loads only after consent defaults are set. The container manages
 * GA4, Clarity, and any future tags. No hard-coded gtag calls — GTM
 * is the single collection point.
 *
 * Why GTM over hard-coded gtag: lets non-engineers manage tags without
 * redeploys and centralises consent enforcement.
 */

"use client";

let gtmLoaded = false;

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/**
 * Initialize GTM — called after consent defaults are set.
 * Injects the GTM script asynchronously, post-hydration.
 */
export function initGTM(): void {
  if (gtmLoaded || !GTM_ID || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);

  gtmLoaded = true;
}

/**
 * Push an event to the GTM dataLayer.
 */
export function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/**
 * Push an event with ecommerce data, clearing previous ecommerce object.
 */
export function pushEcommerceEvent(
  eventName: string,
  ecommerce: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: eventName,
    ecommerce,
  });
}

/**
 * Set user properties in the dataLayer.
 */
export function setUserProperties(properties: Record<string, string>): void {
  pushToDataLayer({
    event: "user_properties_set",
    user_properties: properties,
  });
}

/**
 * Set content group for the current page.
 */
export function setContentGroup(
  pillar: string,
  contentType: string,
  topicCluster?: string
): void {
  pushToDataLayer({
    content_group: pillar,
    content_type: contentType,
    ...(topicCluster && { topic_cluster: topicCluster }),
  });
}

/**
 * GTM noscript fallback iframe — rendered in the body.
 */
export function getGTMNoscript(): string {
  if (!GTM_ID) return "";
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}
