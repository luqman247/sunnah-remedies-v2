-- Phase 9 — Community membership tables (incremental, safe on existing Phase 8 DB)
-- Run against production Neon: psql $DATABASE_URL -f scripts/migrate-phase9-community.sql

DO $$ BEGIN
  CREATE TYPE "public"."account_status" AS ENUM('pending_verification', 'active', 'suspended', 'deactivated', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."member_role" AS ENUM('registered_user', 'student', 'graduate', 'practitioner', 'researcher', 'faculty', 'moderator', 'institution_member', 'partner', 'admin', 'donor', 'volunteer', 'ambassador');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."membership_source" AS ENUM('signup', 'stripe', 'grant', 'enrolment', 'migration');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."membership_status" AS ENUM('active', 'paused', 'cancelled', 'expired', 'grace_period');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."membership_tier" AS ENUM('free_registered', 'student', 'practitioner', 'research', 'institutional', 'supporting_member', 'lifetime');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."verification_status" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."verification_type" AS ENUM('practitioner', 'researcher', 'faculty');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "person_id" uuid REFERENCES "public"."people"("id"),
  "email" text NOT NULL,
  "email_verified_at" timestamp,
  "password_hash" text,
  "auth_provider_ids" jsonb DEFAULT '{}'::jsonb,
  "display_name" text NOT NULL,
  "account_status" "account_status" DEFAULT 'pending_verification' NOT NULL,
  "locale" text DEFAULT 'en',
  "region" text,
  "conduct_acknowledged_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "archived_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "accounts_email_idx" ON "accounts" ("email");
CREATE INDEX IF NOT EXISTS "accounts_person_idx" ON "accounts" ("person_id");
CREATE INDEX IF NOT EXISTS "accounts_status_idx" ON "accounts" ("account_status");

CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "bio" text,
  "qualifications" jsonb DEFAULT '[]'::jsonb,
  "interests" jsonb DEFAULT '[]'::jsonb,
  "avatar_cloudinary_id" text,
  "city" text,
  "profile_region" text,
  "visibility_settings" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_account_idx" ON "profiles" ("account_id");

CREATE TABLE IF NOT EXISTS "role_assignments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "role" "member_role" NOT NULL,
  "granted_by" uuid REFERENCES "public"."accounts"("id"),
  "granted_at" timestamp DEFAULT now() NOT NULL,
  "expires_at" timestamp,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "role_assignments_account_idx" ON "role_assignments" ("account_id");
CREATE INDEX IF NOT EXISTS "role_assignments_role_idx" ON "role_assignments" ("role");
CREATE UNIQUE INDEX IF NOT EXISTS "role_assignments_account_role_idx" ON "role_assignments" ("account_id", "role");

CREATE TABLE IF NOT EXISTS "memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "tier_key" "membership_tier" NOT NULL,
  "status" "membership_status" DEFAULT 'active' NOT NULL,
  "source" "membership_source" DEFAULT 'signup' NOT NULL,
  "stripe_subscription_id" text,
  "started_at" timestamp DEFAULT now() NOT NULL,
  "renews_at" timestamp,
  "granted_by" uuid REFERENCES "public"."accounts"("id"),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "memberships_account_idx" ON "memberships" ("account_id");
CREATE INDEX IF NOT EXISTS "memberships_tier_idx" ON "memberships" ("tier_key");
CREATE INDEX IF NOT EXISTS "memberships_status_idx" ON "memberships" ("status");
CREATE INDEX IF NOT EXISTS "memberships_stripe_idx" ON "memberships" ("stripe_subscription_id");

CREATE TABLE IF NOT EXISTS "membership_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "tier_key" "membership_tier" NOT NULL,
  "status" "membership_status" NOT NULL,
  "previous_tier_key" "membership_tier",
  "previous_status" "membership_status",
  "reason" text,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "changed_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "membership_history_account_idx" ON "membership_history" ("account_id");
CREATE INDEX IF NOT EXISTS "membership_history_changed_idx" ON "membership_history" ("changed_at");

CREATE TABLE IF NOT EXISTS "admin_grants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "permission_key" text NOT NULL,
  "granted_by" uuid REFERENCES "public"."accounts"("id"),
  "granted_at" timestamp DEFAULT now() NOT NULL,
  "expires_at" timestamp,
  "is_active" boolean DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS "admin_grants_account_idx" ON "admin_grants" ("account_id");
CREATE INDEX IF NOT EXISTS "admin_grants_permission_idx" ON "admin_grants" ("permission_key");

CREATE TABLE IF NOT EXISTS "suspensions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "reason" text NOT NULL,
  "suspended_by" uuid REFERENCES "public"."accounts"("id"),
  "suspended_at" timestamp DEFAULT now() NOT NULL,
  "expires_at" timestamp,
  "is_active" boolean DEFAULT true NOT NULL,
  "lifted_at" timestamp
);

CREATE INDEX IF NOT EXISTS "suspensions_account_idx" ON "suspensions" ("account_id");
CREATE INDEX IF NOT EXISTS "suspensions_active_idx" ON "suspensions" ("is_active");

CREATE TABLE IF NOT EXISTS "consent_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "purpose" text NOT NULL,
  "granted" boolean NOT NULL,
  "jurisdiction" text NOT NULL,
  "captured_at" timestamp DEFAULT now() NOT NULL,
  "withdrawn_at" timestamp
);

CREATE INDEX IF NOT EXISTS "consent_records_account_idx" ON "consent_records" ("account_id");
CREATE INDEX IF NOT EXISTS "consent_records_purpose_idx" ON "consent_records" ("purpose");

CREATE TABLE IF NOT EXISTS "verification_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "public"."accounts"("id"),
  "type" "verification_type" NOT NULL,
  "evidence_refs" jsonb DEFAULT '[]'::jsonb,
  "status" "verification_status" DEFAULT 'draft' NOT NULL,
  "reviewer_id" uuid REFERENCES "public"."accounts"("id"),
  "decision_at" timestamp,
  "reason" text,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "verification_requests_account_idx" ON "verification_requests" ("account_id");
CREATE INDEX IF NOT EXISTS "verification_requests_status_idx" ON "verification_requests" ("status");

CREATE TABLE IF NOT EXISTS "community_audit_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_account_id" uuid REFERENCES "public"."accounts"("id"),
  "action" text NOT NULL,
  "target" text NOT NULL,
  "target_id" text,
  "before" jsonb,
  "after" jsonb,
  "ip_address" text,
  "correlation_id" text,
  "occurred_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "community_audit_actor_idx" ON "community_audit_log" ("actor_account_id");
CREATE INDEX IF NOT EXISTS "community_audit_target_idx" ON "community_audit_log" ("target", "target_id");
CREATE INDEX IF NOT EXISTS "community_audit_occurred_idx" ON "community_audit_log" ("occurred_at");

-- Feature flag seed (idempotent)
INSERT INTO feature_flags (key, enabled, description)
VALUES ('community.membership', false, 'Phase 9 membership architecture')
ON CONFLICT (key) DO NOTHING;
