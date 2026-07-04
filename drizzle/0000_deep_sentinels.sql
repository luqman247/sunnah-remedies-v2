CREATE TYPE "public"."alert_severity" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."batch_status" AS ENUM('active', 'quarantined', 'expired', 'recalled', 'depleted');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'rescheduled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."consent_status" AS ENUM('granted', 'denied', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."publishing_state" AS ENUM('draft', 'in_review', 'integrity_review', 'approved', 'scheduled', 'published', 'needs_reattention', 'archived');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('patient', 'student', 'customer', 'practitioner', 'faculty', 'researcher', 'partner', 'lead', 'affiliate', 'volunteer', 'supplier');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('editor', 'author', 'faculty', 'practitioner', 'researcher', 'operations', 'finance', 'marketing', 'administrator', 'leadership');--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('pending_verification', 'active', 'suspended', 'deactivated', 'archived');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('registered_user', 'student', 'graduate', 'practitioner', 'researcher', 'faculty', 'moderator', 'institution_member', 'partner', 'admin', 'donor', 'volunteer', 'ambassador');--> statement-breakpoint
CREATE TYPE "public"."membership_source" AS ENUM('signup', 'stripe', 'grant', 'enrolment', 'migration');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'paused', 'cancelled', 'expired', 'grace_period');--> statement-breakpoint
CREATE TYPE "public"."membership_tier" AS ENUM('free_registered', 'student', 'practitioner', 'research', 'institutional', 'supporting_member', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('practitioner', 'researcher', 'faculty');--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text NOT NULL,
	"status" "approval_status" DEFAULT 'pending',
	"requested_by" uuid,
	"decided_by" uuid,
	"note" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"decided_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_user_id" uuid,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"before" jsonb,
	"after" jsonb,
	"justification" text,
	"ip_address" text,
	"correlation_id" text,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"type" text NOT NULL,
	"entity_id" text,
	"calcom_booking_id" text,
	"practitioner_id" uuid,
	"status" "booking_status" DEFAULT 'pending',
	"scheduled_at" timestamp NOT NULL,
	"duration" integer,
	"timezone" text,
	"intake_completed" boolean DEFAULT false,
	"briefing_prepared" boolean DEFAULT false,
	"feedback_requested" boolean DEFAULT false,
	"feedback_received" boolean DEFAULT false,
	"notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"course_id" text NOT NULL,
	"course_name" text NOT NULL,
	"certificate_number" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"template_data" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "clinical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_ref" text NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"consultation_id" uuid,
	"type" text NOT NULL,
	"encrypted_data" text NOT NULL,
	"accessed_by" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"channel" text NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"template_id" text,
	"resend_id" text,
	"status" text DEFAULT 'sent',
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "email_suppressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"reason" text NOT NULL,
	"source" text,
	"suppressed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrolments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"status" text DEFAULT 'active',
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"certificate_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"enabled" boolean DEFAULT false,
	"description" text,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"order_id" uuid,
	"stripe_payment_id" text,
	"revenue_stream" text,
	"amount" numeric(10, 2) NOT NULL,
	"vat_amount" numeric(10, 2) DEFAULT '0',
	"currency" text DEFAULT 'GBP',
	"description" text,
	"reconciled" boolean DEFAULT false,
	"reconciled_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"type" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"shopify_variant_id" text,
	"sku" text,
	"batch_number" text NOT NULL,
	"supplier_id" uuid,
	"quantity" integer NOT NULL,
	"original_quantity" integer NOT NULL,
	"expiry_date" timestamp,
	"status" "batch_status" DEFAULT 'active',
	"location_id" text DEFAULT 'primary',
	"received_at" timestamp DEFAULT now(),
	"quarantined_at" timestamp,
	"quarantine_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"order_id" uuid,
	"person_id" uuid,
	"subtotal" numeric(10, 2) NOT NULL,
	"vat_rate" numeric(5, 4) DEFAULT '0.20',
	"vat_amount" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'GBP',
	"line_items" jsonb DEFAULT '[]'::jsonb,
	"billing_address" jsonb,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	"status" text DEFAULT 'issued'
);
--> statement-breakpoint
CREATE TABLE "operational_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"severity" "alert_severity" DEFAULT 'info',
	"title" text NOT NULL,
	"message" text NOT NULL,
	"resource" text,
	"resource_id" text,
	"owner_id" uuid,
	"channel" text,
	"deduplication_key" text,
	"acknowledged" boolean DEFAULT false,
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp,
	"escalated" boolean DEFAULT false,
	"escalated_at" timestamp,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operations_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_name" text NOT NULL,
	"event_name" text,
	"correlation_id" text,
	"status" text NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"duration_ms" integer,
	"error" text,
	"attempts" integer DEFAULT 1,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"shopify_order_id" text,
	"stripe_payment_intent_id" text,
	"status" "order_status" DEFAULT 'pending',
	"total_amount" numeric(10, 2) NOT NULL,
	"vat_amount" numeric(10, 2) DEFAULT '0',
	"currency" text DEFAULT 'GBP',
	"line_items" jsonb DEFAULT '[]'::jsonb,
	"shipping_address" jsonb,
	"tracking_number" text,
	"carrier" text,
	"invoice_id" uuid,
	"refund_amount" numeric(10, 2),
	"refund_reason" text,
	"refund_approved_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"locale" text DEFAULT 'en',
	"source" text,
	"marketing_consent" "consent_status" DEFAULT 'denied',
	"transactional_consent" "consent_status" DEFAULT 'granted',
	"email_suppressed" boolean DEFAULT false,
	"suppression_reason" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"hubspot_contact_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"conditions" jsonb DEFAULT '{}'::jsonb,
	"granted_by" uuid,
	"granted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"status" "approval_status" DEFAULT 'pending',
	"items" jsonb DEFAULT '[]'::jsonb,
	"total_cost" numeric(10, 2),
	"currency" text DEFAULT 'GBP',
	"approved_by" uuid,
	"approved_at" timestamp,
	"ordered_at" timestamp,
	"expected_delivery" timestamp,
	"received_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reorder_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"sku" text,
	"reorder_point" integer NOT NULL,
	"par_level" integer NOT NULL,
	"preferred_supplier_id" uuid,
	"location_id" text DEFAULT 'primary',
	"is_active" boolean DEFAULT true,
	"last_triggered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "staff_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"roles" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"position" integer,
	"notified" boolean DEFAULT false,
	"notified_at" timestamp,
	"converted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
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
--> statement-breakpoint
CREATE TABLE "admin_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"permission_key" text NOT NULL,
	"granted_by" uuid,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_account_id" uuid,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"target_id" text,
	"before" jsonb,
	"after" jsonb,
	"ip_address" text,
	"correlation_id" text,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"purpose" text NOT NULL,
	"granted" boolean NOT NULL,
	"jurisdiction" text NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL,
	"withdrawn_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "membership_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"tier_key" "membership_tier" NOT NULL,
	"status" "membership_status" NOT NULL,
	"previous_tier_key" "membership_tier",
	"previous_status" "membership_status",
	"reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"tier_key" "membership_tier" NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL,
	"source" "membership_source" DEFAULT 'signup' NOT NULL,
	"stripe_subscription_id" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"renews_at" timestamp,
	"granted_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "role_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"role" "member_role" NOT NULL,
	"granted_by" uuid,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suspensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"suspended_by" uuid,
	"suspended_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"lifted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"type" "verification_type" NOT NULL,
	"evidence_refs" jsonb DEFAULT '[]'::jsonb,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"reviewer_id" uuid,
	"decision_at" timestamp,
	"reason" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_requested_by_staff_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_decided_by_staff_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_staff_user_id_staff_users_id_fk" FOREIGN KEY ("staff_user_id") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_consultation_id_bookings_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updated_by_staff_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_ledger" ADD CONSTRAINT "finance_ledger_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operational_alerts" ADD CONSTRAINT "operational_alerts_owner_id_staff_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operational_alerts" ADD CONSTRAINT "operational_alerts_acknowledged_by_staff_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_refund_approved_by_staff_users_id_fk" FOREIGN KEY ("refund_approved_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_staff_user_id_staff_users_id_fk" FOREIGN KEY ("staff_user_id") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_granted_by_staff_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_roles" ADD CONSTRAINT "person_roles_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_staff_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_users" ADD CONSTRAINT "staff_users_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlists" ADD CONSTRAINT "waitlists_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_grants" ADD CONSTRAINT "admin_grants_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_grants" ADD CONSTRAINT "admin_grants_granted_by_accounts_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_audit_log" ADD CONSTRAINT "community_audit_log_actor_account_id_accounts_id_fk" FOREIGN KEY ("actor_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_history" ADD CONSTRAINT "membership_history_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_granted_by_accounts_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_granted_by_accounts_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suspensions" ADD CONSTRAINT "suspensions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suspensions" ADD CONSTRAINT "suspensions_suspended_by_accounts_id_fk" FOREIGN KEY ("suspended_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_reviewer_id_accounts_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "approvals_resource_idx" ON "approvals" USING btree ("resource","resource_id");--> statement-breakpoint
CREATE INDEX "approvals_status_idx" ON "approvals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_log_staff_idx" ON "audit_log" USING btree ("staff_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_resource_idx" ON "audit_log" USING btree ("resource","resource_id");--> statement-breakpoint
CREATE INDEX "audit_log_occurred_idx" ON "audit_log" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "bookings_person_idx" ON "bookings" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "bookings_calcom_idx" ON "bookings" USING btree ("calcom_booking_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_scheduled_idx" ON "bookings" USING btree ("scheduled_at");--> statement-breakpoint
CREATE UNIQUE INDEX "certificates_number_idx" ON "certificates" USING btree ("certificate_number");--> statement-breakpoint
CREATE INDEX "certificates_person_idx" ON "certificates" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "clinical_records_patient_idx" ON "clinical_records" USING btree ("patient_ref");--> statement-breakpoint
CREATE INDEX "clinical_records_practitioner_idx" ON "clinical_records" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "communications_person_idx" ON "communications" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "communications_type_idx" ON "communications" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "email_suppressions_email_idx" ON "email_suppressions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "enrolments_person_idx" ON "enrolments" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "enrolments_entity_idx" ON "enrolments" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "feature_flags_key_idx" ON "feature_flags" USING btree ("key");--> statement-breakpoint
CREATE INDEX "finance_ledger_type_idx" ON "finance_ledger" USING btree ("type");--> statement-breakpoint
CREATE INDEX "finance_ledger_order_idx" ON "finance_ledger" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "finance_ledger_stream_idx" ON "finance_ledger" USING btree ("revenue_stream");--> statement-breakpoint
CREATE INDEX "finance_ledger_occurred_idx" ON "finance_ledger" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "interactions_person_idx" ON "interactions" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "interactions_type_idx" ON "interactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "interactions_occurred_idx" ON "interactions" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "inventory_batches_product_idx" ON "inventory_batches" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "inventory_batches_batch_idx" ON "inventory_batches" USING btree ("batch_number");--> statement-breakpoint
CREATE INDEX "inventory_batches_expiry_idx" ON "inventory_batches" USING btree ("expiry_date");--> statement-breakpoint
CREATE INDEX "inventory_batches_status_idx" ON "inventory_batches" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_idx" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_order_idx" ON "invoices" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "invoices_person_idx" ON "invoices" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "alerts_type_idx" ON "operational_alerts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "alerts_severity_idx" ON "operational_alerts" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "alerts_dedup_idx" ON "operational_alerts" USING btree ("deduplication_key");--> statement-breakpoint
CREATE INDEX "alerts_acknowledged_idx" ON "operational_alerts" USING btree ("acknowledged");--> statement-breakpoint
CREATE INDEX "ops_log_workflow_idx" ON "operations_log" USING btree ("workflow_name");--> statement-breakpoint
CREATE INDEX "ops_log_correlation_idx" ON "operations_log" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "ops_log_status_idx" ON "operations_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_person_idx" ON "orders" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "orders_shopify_idx" ON "orders" USING btree ("shopify_order_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "people_email_idx" ON "people" USING btree ("email");--> statement-breakpoint
CREATE INDEX "people_hubspot_idx" ON "people" USING btree ("hubspot_contact_id");--> statement-breakpoint
CREATE INDEX "person_roles_person_idx" ON "person_roles" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "person_roles_role_idx" ON "person_roles" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_orders_number_idx" ON "purchase_orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "purchase_orders_supplier_idx" ON "purchase_orders" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "reorder_rules_product_location_idx" ON "reorder_rules" USING btree ("product_id","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_users_email_idx" ON "staff_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "waitlists_entity_idx" ON "waitlists" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "waitlists_person_idx" ON "waitlists" USING btree ("person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_email_idx" ON "accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "accounts_person_idx" ON "accounts" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "accounts_status_idx" ON "accounts" USING btree ("account_status");--> statement-breakpoint
CREATE INDEX "admin_grants_account_idx" ON "admin_grants" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "admin_grants_permission_idx" ON "admin_grants" USING btree ("permission_key");--> statement-breakpoint
CREATE INDEX "community_audit_actor_idx" ON "community_audit_log" USING btree ("actor_account_id");--> statement-breakpoint
CREATE INDEX "community_audit_target_idx" ON "community_audit_log" USING btree ("target","target_id");--> statement-breakpoint
CREATE INDEX "community_audit_occurred_idx" ON "community_audit_log" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "consent_records_account_idx" ON "consent_records" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "consent_records_purpose_idx" ON "consent_records" USING btree ("purpose");--> statement-breakpoint
CREATE INDEX "membership_history_account_idx" ON "membership_history" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "membership_history_changed_idx" ON "membership_history" USING btree ("changed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_account_idx" ON "memberships" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "memberships_tier_idx" ON "memberships" USING btree ("tier_key");--> statement-breakpoint
CREATE INDEX "memberships_status_idx" ON "memberships" USING btree ("status");--> statement-breakpoint
CREATE INDEX "memberships_stripe_idx" ON "memberships" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_account_idx" ON "profiles" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "role_assignments_account_idx" ON "role_assignments" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "role_assignments_role_idx" ON "role_assignments" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "role_assignments_account_role_idx" ON "role_assignments" USING btree ("account_id","role");--> statement-breakpoint
CREATE INDEX "suspensions_account_idx" ON "suspensions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "suspensions_active_idx" ON "suspensions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "verification_requests_account_idx" ON "verification_requests" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "verification_requests_status_idx" ON "verification_requests" USING btree ("status");