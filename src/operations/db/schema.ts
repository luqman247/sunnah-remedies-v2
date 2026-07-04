/**
 * Phase 8 — App Database Schema (Drizzle ORM + Neon Postgres)
 *
 * Canonical CRM, operations, finance, inventory, audit tables.
 * Clinical data is isolated in a separate partition with access controls.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ── Enums ──────────────────────────────────────────────────────── */

export const roleEnum = pgEnum("role", [
  "patient", "student", "customer", "practitioner", "faculty",
  "researcher", "partner", "lead", "affiliate", "volunteer", "supplier",
]);

export const staffRoleEnum = pgEnum("staff_role", [
  "editor", "author", "faculty", "practitioner", "researcher",
  "operations", "finance", "marketing", "administrator", "leadership",
]);

export const publishingStateEnum = pgEnum("publishing_state", [
  "draft", "in_review", "integrity_review", "approved",
  "scheduled", "published", "needs_reattention", "archived",
]);

export const consentStatusEnum = pgEnum("consent_status", [
  "granted", "denied", "withdrawn",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending", "confirmed", "cancelled", "rescheduled", "completed", "no_show",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending", "paid", "processing", "shipped", "delivered",
  "cancelled", "refunded", "partially_refunded",
]);

export const alertSeverityEnum = pgEnum("alert_severity", [
  "info", "warning", "critical",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending", "approved", "rejected",
]);

export const batchStatusEnum = pgEnum("batch_status", [
  "active", "quarantined", "expired", "recalled", "depleted",
]);

/* ── People (CRM root entity) ──────────────────────────────────── */

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  locale: text("locale").default("en"),
  source: text("source"),
  marketingConsent: consentStatusEnum("marketing_consent").default("denied"),
  transactionalConsent: consentStatusEnum("transactional_consent").default("granted"),
  emailSuppressed: boolean("email_suppressed").default(false),
  suppressionReason: text("suppression_reason"),
  tags: jsonb("tags").$type<string[]>().default([]),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}),
  hubspotContactId: text("hubspot_contact_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("people_email_idx").on(table.email),
  index("people_hubspot_idx").on(table.hubspotContactId),
]);

/* ── Relationship Roles ─────────────────────────────────────────── */

export const personRoles = pgTable("person_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  role: roleEnum("role").notNull(),
  attributes: jsonb("attributes").$type<Record<string, unknown>>().default({}),
  isActive: boolean("is_active").default(true),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("person_roles_person_idx").on(table.personId),
  index("person_roles_role_idx").on(table.role),
]);

/* ── Staff Users & Permissions ──────────────────────────────────── */

export const staffUsers = pgTable("staff_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").references(() => people.id),
  email: text("email").notNull(),
  name: text("name").notNull(),
  roles: jsonb("roles").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("staff_users_email_idx").on(table.email),
]);

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffUserId: uuid("staff_user_id").notNull().references(() => staffUsers.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  conditions: jsonb("conditions").$type<Record<string, unknown>>().default({}),
  grantedBy: uuid("granted_by").references(() => staffUsers.id),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
});

/* ── Audit Log (append-only) ────────────────────────────────────── */

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffUserId: uuid("staff_user_id").references(() => staffUsers.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  before: jsonb("before"),
  after: jsonb("after"),
  justification: text("justification"),
  ipAddress: text("ip_address"),
  correlationId: text("correlation_id"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
}, (table) => [
  index("audit_log_staff_idx").on(table.staffUserId),
  index("audit_log_resource_idx").on(table.resource, table.resourceId),
  index("audit_log_occurred_idx").on(table.occurredAt),
]);

/* ── Approval Workflows ─────────────────────────────────────────── */

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id").notNull(),
  status: approvalStatusEnum("status").default("pending"),
  requestedBy: uuid("requested_by").references(() => staffUsers.id),
  decidedBy: uuid("decided_by").references(() => staffUsers.id),
  note: text("note"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
}, (table) => [
  index("approvals_resource_idx").on(table.resource, table.resourceId),
  index("approvals_status_idx").on(table.status),
]);

/* ── Interactions Timeline ──────────────────────────────────────── */

export const interactions = pgTable("interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  type: text("type").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  summary: text("summary"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
}, (table) => [
  index("interactions_person_idx").on(table.personId),
  index("interactions_type_idx").on(table.type),
  index("interactions_occurred_idx").on(table.occurredAt),
]);

/* ── Orders ─────────────────────────────────────────────────────── */

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  shopifyOrderId: text("shopify_order_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: orderStatusEnum("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").default("GBP"),
  lineItems: jsonb("line_items").$type<Array<{ productId: string; quantity: number; amount: number; title: string }>>().default([]),
  shippingAddress: jsonb("shipping_address"),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  invoiceId: uuid("invoice_id"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundReason: text("refund_reason"),
  refundApprovedBy: uuid("refund_approved_by").references(() => staffUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("orders_person_idx").on(table.personId),
  index("orders_shopify_idx").on(table.shopifyOrderId),
  index("orders_status_idx").on(table.status),
]);

/* ── Enrolments ─────────────────────────────────────────────────── */

export const enrolments = pgTable("enrolments", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  status: text("status").default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  certificateId: uuid("certificate_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
}, (table) => [
  index("enrolments_person_idx").on(table.personId),
  index("enrolments_entity_idx").on(table.entityType, table.entityId),
]);

/* ── Certificates ───────────────────────────────────────────────── */

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  courseId: text("course_id").notNull(),
  courseName: text("course_name").notNull(),
  certificateNumber: text("certificate_number").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  templateData: jsonb("template_data").$type<Record<string, unknown>>().default({}),
}, (table) => [
  uniqueIndex("certificates_number_idx").on(table.certificateNumber),
  index("certificates_person_idx").on(table.personId),
]);

/* ── Bookings ───────────────────────────────────────────────────── */

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  type: text("type").notNull(),
  entityId: text("entity_id"),
  calcomBookingId: text("calcom_booking_id"),
  practitionerId: uuid("practitioner_id"),
  status: bookingStatusEnum("status").default("pending"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"),
  timezone: text("timezone"),
  intakeCompleted: boolean("intake_completed").default(false),
  briefingPrepared: boolean("briefing_prepared").default(false),
  feedbackRequested: boolean("feedback_requested").default(false),
  feedbackReceived: boolean("feedback_received").default(false),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("bookings_person_idx").on(table.personId),
  index("bookings_calcom_idx").on(table.calcomBookingId),
  index("bookings_status_idx").on(table.status),
  index("bookings_scheduled_idx").on(table.scheduledAt),
]);

/* ── Waiting Lists ──────────────────────────────────────────────── */

export const waitlists = pgTable("waitlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").notNull().references(() => people.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  position: integer("position"),
  notified: boolean("notified").default(false),
  notifiedAt: timestamp("notified_at"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("waitlists_entity_idx").on(table.entityType, table.entityId),
  index("waitlists_person_idx").on(table.personId),
]);

/* ── Clinical Records (Isolated Partition) ──────────────────────── */

export const clinicalRecords = pgTable("clinical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientRef: text("patient_ref").notNull(),
  practitionerId: uuid("practitioner_id").notNull(),
  consultationId: uuid("consultation_id").references(() => bookings.id),
  type: text("type").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  accessedBy: jsonb("accessed_by").$type<Array<{ staffId: string; accessedAt: string; reason: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("clinical_records_patient_idx").on(table.patientRef),
  index("clinical_records_practitioner_idx").on(table.practitionerId),
]);

/* ── Inventory — Batches ────────────────────────────────────────── */

export const inventoryBatches = pgTable("inventory_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: text("product_id").notNull(),
  shopifyVariantId: text("shopify_variant_id"),
  sku: text("sku"),
  batchNumber: text("batch_number").notNull(),
  supplierId: uuid("supplier_id"),
  quantity: integer("quantity").notNull(),
  originalQuantity: integer("original_quantity").notNull(),
  expiryDate: timestamp("expiry_date"),
  status: batchStatusEnum("status").default("active"),
  locationId: text("location_id").default("primary"),
  receivedAt: timestamp("received_at").defaultNow(),
  quarantinedAt: timestamp("quarantined_at"),
  quarantineReason: text("quarantine_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("inventory_batches_product_idx").on(table.productId),
  index("inventory_batches_batch_idx").on(table.batchNumber),
  index("inventory_batches_expiry_idx").on(table.expiryDate),
  index("inventory_batches_status_idx").on(table.status),
]);

/* ── Inventory — Reorder Rules ──────────────────────────────────── */

export const reorderRules = pgTable("reorder_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: text("product_id").notNull(),
  sku: text("sku"),
  reorderPoint: integer("reorder_point").notNull(),
  parLevel: integer("par_level").notNull(),
  preferredSupplierId: uuid("preferred_supplier_id"),
  locationId: text("location_id").default("primary"),
  isActive: boolean("is_active").default(true),
  lastTriggeredAt: timestamp("last_triggered_at"),
}, (table) => [
  uniqueIndex("reorder_rules_product_location_idx").on(table.productId, table.locationId),
]);

/* ── Purchase Orders ────────────────────────────────────────────── */

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull(),
  supplierId: uuid("supplier_id").notNull(),
  status: approvalStatusEnum("status").default("pending"),
  items: jsonb("items").$type<Array<{ productId: string; sku: string; quantity: number; unitCost: number }>>().default([]),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  currency: text("currency").default("GBP"),
  approvedBy: uuid("approved_by").references(() => staffUsers.id),
  approvedAt: timestamp("approved_at"),
  orderedAt: timestamp("ordered_at"),
  expectedDelivery: timestamp("expected_delivery"),
  receivedAt: timestamp("received_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("purchase_orders_number_idx").on(table.orderNumber),
  index("purchase_orders_supplier_idx").on(table.supplierId),
  index("purchase_orders_status_idx").on(table.status),
]);

/* ── Finance Ledger ─────────────────────────────────────────────── */

export const financeLedger = pgTable("finance_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  stripePaymentId: text("stripe_payment_id"),
  revenueStream: text("revenue_stream"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").default("GBP"),
  description: text("description"),
  reconciled: boolean("reconciled").default(false),
  reconciledAt: timestamp("reconciled_at"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("finance_ledger_type_idx").on(table.type),
  index("finance_ledger_order_idx").on(table.orderId),
  index("finance_ledger_stream_idx").on(table.revenueStream),
  index("finance_ledger_occurred_idx").on(table.occurredAt),
]);

/* ── Invoices ───────────────────────────────────────────────────── */

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  personId: uuid("person_id").references(() => people.id),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  vatRate: decimal("vat_rate", { precision: 5, scale: 4 }).default("0.20"),
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("GBP"),
  lineItems: jsonb("line_items").$type<Array<{ description: string; quantity: number; unitPrice: number; total: number }>>().default([]),
  billingAddress: jsonb("billing_address"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  status: text("status").default("issued"),
}, (table) => [
  uniqueIndex("invoices_number_idx").on(table.invoiceNumber),
  index("invoices_order_idx").on(table.orderId),
  index("invoices_person_idx").on(table.personId),
]);

/* ── Email Suppression List ─────────────────────────────────────── */

export const emailSuppressions = pgTable("email_suppressions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  reason: text("reason").notNull(),
  source: text("source"),
  suppressedAt: timestamp("suppressed_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("email_suppressions_email_idx").on(table.email),
]);

/* ── Communications Log ─────────────────────────────────────────── */

export const communications = pgTable("communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  personId: uuid("person_id").references(() => people.id),
  channel: text("channel").notNull(),
  type: text("type").notNull(),
  subject: text("subject"),
  templateId: text("template_id"),
  resendId: text("resend_id"),
  status: text("status").default("sent"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
}, (table) => [
  index("communications_person_idx").on(table.personId),
  index("communications_type_idx").on(table.type),
]);

/* ── Operational Alerts ─────────────────────────────────────────── */

export const operationalAlerts = pgTable("operational_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  severity: alertSeverityEnum("severity").default("info"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  resource: text("resource"),
  resourceId: text("resource_id"),
  ownerId: uuid("owner_id").references(() => staffUsers.id),
  channel: text("channel"),
  deduplicationKey: text("deduplication_key"),
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedBy: uuid("acknowledged_by").references(() => staffUsers.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  escalated: boolean("escalated").default(false),
  escalatedAt: timestamp("escalated_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("alerts_type_idx").on(table.type),
  index("alerts_severity_idx").on(table.severity),
  index("alerts_dedup_idx").on(table.deduplicationKey),
  index("alerts_acknowledged_idx").on(table.acknowledged),
]);

/* ── Feature Flags ──────────────────────────────────────────────── */

export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  enabled: boolean("enabled").default(false),
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => staffUsers.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("feature_flags_key_idx").on(table.key),
]);

/* ── Operations Log ─────────────────────────────────────────────── */

export const operationsLog = pgTable("operations_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowName: text("workflow_name").notNull(),
  eventName: text("event_name"),
  correlationId: text("correlation_id"),
  status: text("status").notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
  error: text("error"),
  attempts: integer("attempts").default(1),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("ops_log_workflow_idx").on(table.workflowName),
  index("ops_log_correlation_idx").on(table.correlationId),
  index("ops_log_status_idx").on(table.status),
]);
