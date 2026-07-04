/**
 * Analytics type definitions — shared across client and server.
 *
 * These types encode the tracking plan's event taxonomy as TypeScript,
 * ensuring compile-time correctness for every emitted event.
 */

/* ── Consent ───────────────────────────────────────────────────── */

export type ConsentCategory =
  | "analytics_storage"
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization";

export type ConsentState = "granted" | "denied";

export interface ConsentConfig {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
}

/* ── Ledger ────────────────────────────────────────────────────── */

export type Ledger = "integrity" | "commercial" | "both";

/* ── Custom Dimensions ─────────────────────────────────────────── */

export type Pillar =
  | "apothecary"
  | "academy"
  | "journeys"
  | "knowledge"
  | "clinical"
  | "institute";

export type ContentType =
  | "article"
  | "product"
  | "course"
  | "entity"
  | "consultation"
  | "journey"
  | "video"
  | "faq";

export type EntityType =
  | "disease"
  | "herb"
  | "product"
  | "hadith"
  | "verse"
  | "ingredient"
  | "faculty";

export type HadithGrade = "sahih" | "hasan" | "daif";
export type ContentFreshness = "fresh" | "due_review" | "stale";
export type AIConfidenceBand = "high" | "medium" | "low";
export type FunnelStage = "threshold" | "corridor" | "pathway";
export type UserSegment = "visitor" | "patient" | "student" | "researcher" | "customer";
export type StudentStatus = "prospect" | "applicant" | "enrolled" | "graduate";

/* ── Enhanced Ecommerce Item ───────────────────────────────────── */

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  coupon?: string;
  item_list_name?: string;
  index?: number;
}

/* ── Event Parameter Maps ──────────────────────────────────────── */

export interface EditorialEventParams {
  article_id: string;
  article_title?: string;
  pillar?: Pillar;
  content_type?: ContentType;
  content_freshness?: ContentFreshness;
  scroll_pct?: number;
  reading_seconds?: number;
  citation_id?: string;
  citation_type?: string;
  reference_id?: string;
  source_page?: string;
  destination_page?: string;
  link_text?: string;
}

export interface SearchEventParams {
  search_term: string;
  previous_term?: string;
  search_refinements?: number;
}

export interface KnowledgeEventParams {
  entity_id?: string;
  entity_type?: EntityType;
  entity_name?: string;
  topic_id?: string;
  topic_name?: string;
  from_entity?: string;
  to_entity?: string;
  relationship_type?: string;
  faq_id?: string;
  faq_question?: string;
  page?: string;
}

export interface CommerceEventParams {
  items?: EcommerceItem[];
  currency?: string;
  value?: number;
  transaction_id?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  item_list_name?: string;
  item_list_id?: string;
  payment_type?: string;
  shipping_tier?: string;
  item_id?: string;
  interaction_type?: string;
  image_index?: number;
}

export interface CourseEventParams {
  course_id: string;
  course_name?: string;
  pillar?: Pillar;
  cohort?: string;
  lesson_id?: string;
  lesson_index?: number;
  reading_seconds?: number;
  video_id?: string;
  video_title?: string;
  video_pct?: number;
  quiz_id?: string;
  quiz_score?: number;
  passed?: boolean;
  query_topic?: string;
  material_type?: string;
}

export interface ClinicalEventParams {
  consultation_type?: string;
  practitioner?: string;
  appointment_date?: string;
}

export interface JourneyEventParams {
  journey_id?: string;
  journey_name?: string;
  programme_id?: string;
  pillar?: Pillar;
  value?: number;
  currency?: string;
  material_type?: string;
}

export interface AIEventParams {
  query_topic?: string;
  pillar?: Pillar;
  ai_confidence?: number;
  ai_confidence_band?: AIConfidenceBand;
  citation_count?: number;
  has_uncited_claims?: boolean;
  source_id?: string;
  source_type?: string;
  fallback_reason?: string;
  recommendation_type?: string;
  recommendation_id?: string;
  recommendation_name?: string;
  feedback_type?: string;
  rating?: number;
}

export interface SystemEventParams {
  source_page?: string;
  account_type?: string;
  error_type?: string;
  error_page?: string;
  error_component?: string;
  from_language?: string;
  to_language?: string;
}

/* ── Union event type ──────────────────────────────────────────── */

export type AnalyticsEventParams =
  | EditorialEventParams
  | SearchEventParams
  | KnowledgeEventParams
  | CommerceEventParams
  | CourseEventParams
  | ClinicalEventParams
  | JourneyEventParams
  | AIEventParams
  | SystemEventParams
  | ConsentConfig
  | Record<string, unknown>;

/* ── Event names (exhaustive) ──────────────────────────────────── */

export type AnalyticsEventName =
  // Editorial
  | "article_view"
  | "article_read_25"
  | "article_read_50"
  | "article_read_75"
  | "article_read_100"
  | "article_complete"
  | "citation_click"
  | "reference_click"
  | "internal_link_click"
  | "topic_view"
  // Knowledge / Search
  | "search"
  | "search_refine"
  | "search_zero_result"
  | "entity_view"
  | "graph_traverse"
  | "faq_expand"
  // Commerce
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "gallery_interact"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info"
  | "purchase"
  | "refund"
  // Academy
  | "course_view"
  | "curriculum_view"
  | "course_application_start"
  | "course_enrol"
  | "lesson_start"
  | "lesson_complete"
  | "video_progress"
  | "quiz_attempt"
  | "quiz_complete"
  | "certificate_issued"
  | "revision_open"
  | "tutor_query"
  // Clinical
  | "consultation_view"
  | "booking_start"
  | "intake_start"
  | "intake_complete"
  | "appointment_booked"
  | "appointment_attended"
  // Journeys
  | "journey_view"
  | "programme_view"
  | "journey_booking_start"
  | "journey_deposit"
  | "preparation_open"
  // AI
  | "ai_query"
  | "ai_response"
  | "ai_citation_shown"
  | "ai_fallback"
  | "ai_recommendation"
  | "ai_feedback"
  | "translation_used"
  // Trust / System
  | "newsletter_signup"
  | "account_create"
  | "error_boundary"
  | "consent_update";

/* ── Alert types ───────────────────────────────────────────────── */

export type AlertSeverity = "info" | "warn" | "page";

export interface AlertConfig {
  name: string;
  trigger: string;
  severity: AlertSeverity;
  route: "slack" | "email" | "pagerduty";
  channel?: string;
  dedup_window_minutes?: number;
}

/* ── Dashboard types ───────────────────────────────────────────── */

export type DashboardRole = "leadership" | "analyst" | "domain_owner";

export interface DashboardTile {
  id: string;
  label: string;
  ledger: Ledger;
  paired_tile_id?: string;
  refresh_seconds: number;
}
