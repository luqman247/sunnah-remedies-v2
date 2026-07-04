/**
 * Client-side event emitters — typed, consent-aware, batched.
 *
 * Every client event flows through this module. Events are pushed
 * to the GTM dataLayer and are only processed if the appropriate
 * consent category is granted (enforced by GTM triggers).
 *
 * Scroll and video progress events are debounced to limit beacons.
 */

"use client";

import { pushToDataLayer, pushEcommerceEvent, setContentGroup } from "./gtm";
import { hasConsent } from "./consent";
import type {
  AnalyticsEventName,
  EditorialEventParams,
  SearchEventParams,
  KnowledgeEventParams,
  CommerceEventParams,
  CourseEventParams,
  ClinicalEventParams,
  JourneyEventParams,
  AIEventParams,
  SystemEventParams,
  EcommerceItem,
  Pillar,
  ContentType,
} from "./types";

/* ── Core emit ─────────────────────────────────────────────────── */

function toRecord(obj: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

function emit(
  eventName: AnalyticsEventName,
  params: Record<string, unknown> = {},
  requireConsent: "analytics" | "functional" = "analytics"
): void {
  if (typeof window === "undefined") return;

  if (requireConsent === "analytics" && !hasConsent("analytics_storage")) {
    return;
  }

  pushToDataLayer({ event: eventName, ...params });
}

/* ── Editorial Events ──────────────────────────────────────────── */

export function trackArticleView(params: EditorialEventParams): void {
  setContentGroup("knowledge", "article");
  emit("article_view", toRecord(params));
}

export function trackArticleRead(
  milestone: 25 | 50 | 75 | 100,
  params: Pick<EditorialEventParams, "article_id" | "reading_seconds">
): void {
  emit(`article_read_${milestone}` as AnalyticsEventName, {
    ...params,
    scroll_pct: milestone,
  });
}

export function trackArticleComplete(
  params: Pick<EditorialEventParams, "article_id" | "reading_seconds">
): void {
  emit("article_complete", toRecord(params));
}

export function trackCitationClick(
  params: Pick<EditorialEventParams, "article_id" | "citation_id" | "citation_type">
): void {
  emit("citation_click", toRecord(params));
}

export function trackReferenceClick(
  params: Pick<EditorialEventParams, "article_id" | "reference_id">
): void {
  emit("reference_click", toRecord(params));
}

export function trackInternalLinkClick(
  params: Pick<EditorialEventParams, "source_page" | "destination_page" | "link_text">
): void {
  emit("internal_link_click", toRecord(params));
}

export function trackTopicView(
  params: Pick<KnowledgeEventParams, "topic_id" | "topic_name">
): void {
  setContentGroup("knowledge", "topic");
  emit("topic_view", toRecord(params));
}

/* ── Search Events ─────────────────────────────────────────────── */

export function trackSearch(params: SearchEventParams): void {
  emit("search", toRecord(params));
}

export function trackSearchRefine(params: SearchEventParams): void {
  emit("search_refine", toRecord(params));
}

export function trackSearchZeroResult(searchTerm: string): void {
  emit("search_zero_result", { search_term: searchTerm });
}

/* ── Knowledge Events ──────────────────────────────────────────── */

export function trackEntityView(params: KnowledgeEventParams): void {
  setContentGroup("knowledge", "entity");
  emit("entity_view", toRecord(params));
}

export function trackGraphTraverse(params: KnowledgeEventParams): void {
  emit("graph_traverse", toRecord(params));
}

export function trackFaqExpand(params: KnowledgeEventParams): void {
  emit("faq_expand", toRecord(params));
}

/* ── Commerce Events (Enhanced Ecommerce) ──────────────────────── */

export function trackViewItem(
  items: EcommerceItem[],
  currency: string,
  value: number
): void {
  setContentGroup("apothecary", "product");
  pushEcommerceEvent("view_item", { items, currency, value });
}

export function trackViewItemList(
  items: EcommerceItem[],
  listName: string,
  listId?: string
): void {
  setContentGroup("apothecary", "collection");
  pushEcommerceEvent("view_item_list", {
    items,
    item_list_name: listName,
    ...(listId && { item_list_id: listId }),
  });
}

export function trackSelectItem(items: EcommerceItem[], listName: string): void {
  pushEcommerceEvent("select_item", { items, item_list_name: listName });
}

export function trackGalleryInteract(
  itemId: string,
  interactionType: string,
  imageIndex: number
): void {
  emit("gallery_interact", {
    item_id: itemId,
    interaction_type: interactionType,
    image_index: imageIndex,
  });
}

export function trackAddToCart(
  items: EcommerceItem[],
  currency: string,
  value: number
): void {
  pushEcommerceEvent("add_to_cart", { items, currency, value });
}

export function trackRemoveFromCart(
  items: EcommerceItem[],
  currency: string,
  value: number
): void {
  pushEcommerceEvent("remove_from_cart", { items, currency, value });
}

export function trackBeginCheckout(
  items: EcommerceItem[],
  currency: string,
  value: number,
  coupon?: string
): void {
  pushEcommerceEvent("begin_checkout", {
    items,
    currency,
    value,
    ...(coupon && { coupon }),
  });
}

export function trackAddShippingInfo(
  items: EcommerceItem[],
  currency: string,
  value: number,
  shippingTier: string
): void {
  pushEcommerceEvent("add_shipping_info", {
    items,
    currency,
    value,
    shipping_tier: shippingTier,
  });
}

export function trackAddPaymentInfo(
  items: EcommerceItem[],
  currency: string,
  value: number,
  paymentType: string
): void {
  pushEcommerceEvent("add_payment_info", {
    items,
    currency,
    value,
    payment_type: paymentType,
  });
}

export function trackPurchaseClient(params: CommerceEventParams): void {
  pushEcommerceEvent("purchase", toRecord(params));
}

/* ── Course Events ─────────────────────────────────────────────── */

export function trackCourseView(params: CourseEventParams): void {
  setContentGroup("academy", "course");
  emit("course_view", toRecord(params));
}

export function trackCurriculumView(params: CourseEventParams): void {
  emit("curriculum_view", toRecord(params));
}

export function trackCourseApplicationStart(params: CourseEventParams): void {
  emit("course_application_start", toRecord(params));
}

export function trackVideoProgress(params: CourseEventParams): void {
  emit("video_progress", toRecord(params));
}

export function trackRevisionOpen(params: CourseEventParams): void {
  emit("revision_open", toRecord(params));
}

/* ── Clinical Events ───────────────────────────────────────────── */

export function trackConsultationView(params: ClinicalEventParams): void {
  setContentGroup("clinical", "consultation");
  emit("consultation_view", toRecord(params));
}

export function trackBookingStart(params: ClinicalEventParams): void {
  emit("booking_start", toRecord(params));
}

export function trackIntakeStart(params: ClinicalEventParams): void {
  emit("intake_start", toRecord(params));
}

/* ── Journey Events ────────────────────────────────────────────── */

export function trackJourneyView(params: JourneyEventParams): void {
  setContentGroup("journeys", "journey");
  emit("journey_view", toRecord(params));
}

export function trackProgrammeView(params: JourneyEventParams): void {
  emit("programme_view", toRecord(params));
}

export function trackJourneyBookingStart(params: JourneyEventParams): void {
  emit("journey_booking_start", toRecord(params));
}

export function trackPreparationOpen(params: JourneyEventParams): void {
  emit("preparation_open", toRecord(params));
}

/* ── AI Events (client-side) ───────────────────────────────────── */

export function trackAiFeedback(params: AIEventParams): void {
  emit("ai_feedback", toRecord(params));
}

export function trackTranslationUsed(from: string, to: string): void {
  emit("translation_used", { from_language: from, to_language: to });
}

/* ── System Events ─────────────────────────────────────────────── */

export function trackNewsletterSignup(sourcePage: string): void {
  emit("newsletter_signup", { source_page: sourcePage });
}

export function trackErrorBoundary(
  errorType: string,
  errorPage: string,
  errorComponent: string
): void {
  emit("error_boundary", {
    error_type: errorType,
    error_page: errorPage,
    error_component: errorComponent,
  }, "functional");
}

/* ── Scroll & Reading Tracker (debounced) ──────────────────────── */

const scrollMilestones = new Set<number>();
let readingStartTime = 0;

export function initScrollTracker(articleId: string): void {
  scrollMilestones.clear();
  readingStartTime = Date.now();

  const observer = new IntersectionObserver(
    () => {
      const scrollPct = getScrollPercentage();
      const readingSeconds = Math.floor((Date.now() - readingStartTime) / 1000);

      for (const milestone of [25, 50, 75, 100] as const) {
        if (scrollPct >= milestone && !scrollMilestones.has(milestone)) {
          scrollMilestones.add(milestone);
          trackArticleRead(milestone, { article_id: articleId, reading_seconds: readingSeconds });

          if (milestone === 100 && readingSeconds > 30) {
            trackArticleComplete({ article_id: articleId, reading_seconds: readingSeconds });
          }
        }
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
  );

  const sentinel = document.querySelector("[data-analytics-article-end]");
  if (sentinel) observer.observe(sentinel);

  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrollPct = getScrollPercentage();
      const readingSeconds = Math.floor((Date.now() - readingStartTime) / 1000);

      for (const milestone of [25, 50, 75, 100] as const) {
        if (scrollPct >= milestone && !scrollMilestones.has(milestone)) {
          scrollMilestones.add(milestone);
          trackArticleRead(milestone, { article_id: articleId, reading_seconds: readingSeconds });

          if (milestone === 100 && readingSeconds > 30) {
            trackArticleComplete({ article_id: articleId, reading_seconds: readingSeconds });
          }
        }
      }
    }, 500),
    { passive: true }
  );
}

/* ── Video Progress Tracker (debounced) ────────────────────────── */

const videoMilestones = new Map<string, Set<number>>();

export function initVideoTracker(
  videoElement: HTMLVideoElement,
  videoId: string,
  videoTitle: string,
  courseId?: string
): () => void {
  videoMilestones.set(videoId, new Set());

  const handler = () => {
    const pct = Math.floor((videoElement.currentTime / videoElement.duration) * 100);
    const milestones = videoMilestones.get(videoId)!;

    for (const milestone of [25, 50, 75, 100] as const) {
      if (pct >= milestone && !milestones.has(milestone)) {
        milestones.add(milestone);
        trackVideoProgress({
          course_id: courseId || "",
          video_id: videoId,
          video_title: videoTitle,
          video_pct: milestone,
        });
      }
    }
  };

  videoElement.addEventListener("timeupdate", debounce(handler, 1000), { passive: true });

  return () => {
    videoMilestones.delete(videoId);
  };
}

/* ── Utilities ─────────────────────────────────────────────────── */

function getScrollPercentage(): number {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 100;
  return Math.min(100, Math.floor((window.scrollY / docHeight) * 100));
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
