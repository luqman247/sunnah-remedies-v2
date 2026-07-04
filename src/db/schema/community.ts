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
