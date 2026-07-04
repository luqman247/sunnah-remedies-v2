/**
 * Phase 9 — Community Database Schema
 *
 * Identity, membership, roles, consent, and community audit tables.
 * Extends the Phase 8 Postgres database as the community data plane.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { people } from "@/operations/db/schema";

/* ── Enums ──────────────────────────────────────────────────────── */

export const memberRoleEnum = pgEnum("member_role", [
  "registered_user",
  "student",
  "graduate",
  "practitioner",
  "researcher",
  "faculty",
  "moderator",
  "institution_member",
  "partner",
  "admin",
  "donor",
  "volunteer",
  "ambassador",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "pending_verification",
  "active",
  "suspended",
  "deactivated",
  "archived",
]);

export const membershipTierEnum = pgEnum("membership_tier", [
  "free_registered",
  "student",
  "practitioner",
  "research",
  "institutional",
  "supporting_member",
  "lifetime",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "paused",
  "cancelled",
  "expired",
  "grace_period",
]);

export const membershipSourceEnum = pgEnum("membership_source", [
  "signup",
  "stripe",
  "grant",
  "enrolment",
  "migration",
]);

export const verificationTypeEnum = pgEnum("verification_type", [
  "practitioner",
  "researcher",
  "faculty",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "expired",
]);

/* ── Accounts ───────────────────────────────────────────────────── */

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").references(() => people.id),
  email: text("email").notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  passwordHash: text("password_hash"),
  authProviderIds: jsonb("auth_provider_ids")
    .$type<Record<string, string>>()
    .default({}),
  displayName: text("display_name").notNull(),
  accountStatus: accountStatusEnum("account_status")
    .default("pending_verification")
    .notNull(),
  locale: text("locale").default("en"),
  region: text("region"),
  conductAcknowledgedAt: timestamp("conduct_acknowledged_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  archivedAt: timestamp("archived_at"),
}, (table) => [
  uniqueIndex("accounts_email_idx").on(table.email),
  index("accounts_person_idx").on(table.personId),
  index("accounts_status_idx").on(table.accountStatus),
]);

/* ── Profiles ───────────────────────────────────────────────────── */

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  bio: text("bio"),
  qualifications: jsonb("qualifications")
    .$type<Array<{ title: string; institution?: string; year?: number }>>()
    .default([]),
  interests: jsonb("interests").$type<string[]>().default([]),
  avatarCloudinaryId: text("avatar_cloudinary_id"),
  city: text("city"),
  profileRegion: text("profile_region"),
  visibilitySettings: jsonb("visibility_settings")
    .$type<Record<string, "private" | "members_only" | "public">>()
    .default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("profiles_account_idx").on(table.accountId),
]);

/* ── Role Assignments ───────────────────────────────────────────── */

export const roleAssignments = pgTable("role_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  role: memberRoleEnum("role").notNull(),
  grantedBy: uuid("granted_by").references(() => accounts.id),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("role_assignments_account_idx").on(table.accountId),
  index("role_assignments_role_idx").on(table.role),
  uniqueIndex("role_assignments_account_role_idx").on(
    table.accountId,
    table.role
  ),
]);

/* ── Memberships ────────────────────────────────────────────────── */

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  tierKey: membershipTierEnum("tier_key").notNull(),
  status: membershipStatusEnum("status").default("active").notNull(),
  source: membershipSourceEnum("source").default("signup").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  renewsAt: timestamp("renews_at"),
  grantedBy: uuid("granted_by").references(() => accounts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("memberships_account_idx").on(table.accountId),
  index("memberships_tier_idx").on(table.tierKey),
  index("memberships_status_idx").on(table.status),
  index("memberships_stripe_idx").on(table.stripeSubscriptionId),
]);

/* ── Membership History (lifecycle audit) ───────────────────────── */

export const membershipHistory = pgTable("membership_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  tierKey: membershipTierEnum("tier_key").notNull(),
  status: membershipStatusEnum("status").notNull(),
  previousTierKey: membershipTierEnum("previous_tier_key"),
  previousStatus: membershipStatusEnum("previous_status"),
  reason: text("reason"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
}, (table) => [
  index("membership_history_account_idx").on(table.accountId),
  index("membership_history_changed_idx").on(table.changedAt),
]);

/* ── Admin Permission Grants ────────────────────────────────────── */

export const adminGrants = pgTable("admin_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  permissionKey: text("permission_key").notNull(),
  grantedBy: uuid("granted_by").references(() => accounts.id),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  index("admin_grants_account_idx").on(table.accountId),
  index("admin_grants_permission_idx").on(table.permissionKey),
]);

/* ── Suspensions ────────────────────────────────────────────────── */

export const suspensions = pgTable("suspensions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  reason: text("reason").notNull(),
  suspendedBy: uuid("suspended_by").references(() => accounts.id),
  suspendedAt: timestamp("suspended_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  liftedAt: timestamp("lifted_at"),
}, (table) => [
  index("suspensions_account_idx").on(table.accountId),
  index("suspensions_active_idx").on(table.isActive),
]);

/* ── Consent Records ────────────────────────────────────────────── */

export const consentRecords = pgTable("consent_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  purpose: text("purpose").notNull(),
  granted: boolean("granted").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawn_at"),
}, (table) => [
  index("consent_records_account_idx").on(table.accountId),
  index("consent_records_purpose_idx").on(table.purpose),
]);

/* ── Verification Requests ──────────────────────────────────────── */

export const verificationRequests = pgTable("verification_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  type: verificationTypeEnum("type").notNull(),
  evidenceRefs: jsonb("evidence_refs").$type<string[]>().default([]),
  status: verificationStatusEnum("status").default("draft").notNull(),
  reviewerId: uuid("reviewer_id").references(() => accounts.id),
  decisionAt: timestamp("decision_at"),
  reason: text("reason"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("verification_requests_account_idx").on(table.accountId),
  index("verification_requests_status_idx").on(table.status),
]);

/* ── Community Audit Log ────────────────────────────────────────── */

export const communityAuditLog = pgTable("community_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorAccountId: uuid("actor_account_id").references(() => accounts.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  targetId: text("target_id"),
  before: jsonb("before"),
  after: jsonb("after"),
  ipAddress: text("ip_address"),
  correlationId: text("correlation_id"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
}, (table) => [
  index("community_audit_actor_idx").on(table.actorAccountId),
  index("community_audit_target_idx").on(table.target, table.targetId),
  index("community_audit_occurred_idx").on(table.occurredAt),
]);

/* ── CPD Records ────────────────────────────────────────────────── */

export const cpdCategoryEnum = pgEnum("cpd_category", [
  "clinical_practice",
  "research",
  "teaching",
  "institutional_event",
  "journal_club",
  "external_activity",
  "mentorship",
]);

export const cpdRecords = pgTable("cpd_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  activity: text("activity").notNull(),
  categoryKey: cpdCategoryEnum("category_key").notNull(),
  credits: integer("credits").notNull(),
  evidenceRef: text("evidence_ref"),
  activityDate: timestamp("activity_date").notNull(),
  verifiedBy: uuid("verified_by").references(() => accounts.id),
  verifiedAt: timestamp("verified_at"),
  sourceType: text("source_type"),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  archivedAt: timestamp("archived_at"),
}, (table) => [
  index("cpd_records_account_idx").on(table.accountId),
  index("cpd_records_date_idx").on(table.activityDate),
  index("cpd_records_category_idx").on(table.categoryKey),
]);

/* ── CPD Cycles ─────────────────────────────────────────────────── */

export const cpdCycles = pgTable("cpd_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  year: integer("year").notNull(),
  targetCredits: integer("target_credits").default(20).notNull(),
  accruedCredits: integer("accrued_credits").default(0).notNull(),
  statementRef: text("statement_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("cpd_cycles_account_year_idx").on(table.accountId, table.year),
  index("cpd_cycles_account_idx").on(table.accountId),
]);

/* ── Saved Resources ────────────────────────────────────────────── */

export const savedResources = pgTable("saved_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  title: text("title").notNull(),
  href: text("href"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (table) => [
  index("saved_resources_account_idx").on(table.accountId),
  uniqueIndex("saved_resources_account_target_idx").on(
    table.accountId,
    table.targetType,
    table.targetId
  ),
]);

/* ── Practitioner Profiles ──────────────────────────────────────── */

export const practitionerProfiles = pgTable("practitioner_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  scopeOfPractice: text("scope_of_practice"),
  registrationBody: text("registration_body"),
  registrationNumber: text("registration_number"),
  specialisations: jsonb("specialisations").$type<string[]>().default([]),
  servicesOffered: jsonb("services_offered").$type<string[]>().default([]),
  verifiedAt: timestamp("verified_at"),
  verifiedUntil: timestamp("verified_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("practitioner_profiles_account_idx").on(table.accountId),
]);

/* ── Directory Listings (future-ready) ──────────────────────────── */

export const directoryListings = pgTable("directory_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  visibilityScope: text("visibility_scope").default("members_only").notNull(),
  locationConsented: boolean("location_consented").default(false),
  contactConsented: boolean("contact_consented").default(false),
  city: text("city"),
  region: text("region"),
  contactPreference: text("contact_preference").default("institution_routed"),
  isListed: boolean("is_listed").default(false).notNull(),
  listedAt: timestamp("listed_at"),
  delistedAt: timestamp("delisted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("directory_listings_account_idx").on(table.accountId),
  index("directory_listings_listed_idx").on(table.isListed),
]);

/* ── Campus Enrolments (Phase 9 — Learning & Campus) ───────────── */

export const campusEnrolmentStatusEnum = pgEnum("campus_enrolment_status", [
  "active",
  "paused",
  "completed",
  "withdrawn",
]);

export const campusEnrolments = pgTable("campus_enrolments", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  courseRef: text("course_ref").notNull(),
  courseSlug: text("course_slug").notNull(),
  courseName: text("course_name").notNull(),
  status: campusEnrolmentStatusEnum("status").default("active").notNull(),
  progressPct: integer("progress_pct").default(0).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("campus_enrolments_account_idx").on(table.accountId),
  index("campus_enrolments_course_idx").on(table.courseRef),
  uniqueIndex("campus_enrolments_account_course_idx").on(
    table.accountId,
    table.courseRef
  ),
]);

export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  enrolmentId: uuid("enrolment_id")
    .notNull()
    .references(() => campusEnrolments.id),
  lessonRef: text("lesson_ref").notNull(),
  lessonSlug: text("lesson_slug").notNull(),
  completedAt: timestamp("completed_at"),
  secondsWatched: integer("seconds_watched").default(0),
  lastPosition: integer("last_position").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("lesson_progress_enrolment_idx").on(table.enrolmentId),
  uniqueIndex("lesson_progress_enrolment_lesson_idx").on(
    table.enrolmentId,
    table.lessonRef
  ),
]);

export const courseNotes = pgTable("course_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  courseRef: text("course_ref").notNull(),
  lessonRef: text("lesson_ref"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("course_notes_account_idx").on(table.accountId),
  index("course_notes_course_idx").on(table.courseRef),
]);

export const campusAssignments = pgTable("campus_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseRef: text("course_ref").notNull(),
  lessonRef: text("lesson_ref"),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("campus_assignments_course_idx").on(table.courseRef),
]);

export const campusSubmissions = pgTable("campus_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => campusAssignments.id),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  body: text("body").notNull(),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  grade: text("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
}, (table) => [
  index("campus_submissions_assignment_idx").on(table.assignmentId),
  index("campus_submissions_account_idx").on(table.accountId),
]);

export const flashcardDecks = pgTable("flashcard_decks", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  courseRef: text("course_ref").notNull(),
  lessonRef: text("lesson_ref"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("flashcard_decks_account_idx").on(table.accountId),
  index("flashcard_decks_course_idx").on(table.courseRef),
]);

export const flashcardReviews = pgTable("flashcard_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  deckId: uuid("deck_id")
    .notNull()
    .references(() => flashcardDecks.id),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id),
  easeFactor: integer("ease_factor").default(250).notNull(),
  interval: integer("interval").default(1).notNull(),
  dueAt: timestamp("due_at").defaultNow().notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
}, (table) => [
  index("flashcard_reviews_deck_idx").on(table.deckId),
  index("flashcard_reviews_account_idx").on(table.accountId),
  index("flashcard_reviews_due_idx").on(table.dueAt),
]);
