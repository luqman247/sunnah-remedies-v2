/**
 * Phase 8 — Event Contract
 *
 * The shared event vocabulary for the institution.
 * Systems communicate through named events, never by calling each other directly.
 * Events carry references (IDs), not payloads of record.
 *
 * Naming: domain.action (past tense, lower-case, dot-separated)
 * Domains: content, product, course, journey, consultation, order,
 *          student, patient, inventory, finance, email, media, system, contact
 */

export interface BaseEvent {
  id: string;
  name: string;
  occurredAt: string;
  source: string;
  version: number;
  correlationId: string;
}

/* ── Content Events ─────────────────────────────────────────────── */

export interface ContentPublishedEvent extends BaseEvent {
  name: "content.published";
  data: {
    documentId: string;
    documentType: string;
    sanityRevision: string;
    contentType: "article" | "research" | "knowledge" | "clinical" | "editorial";
    slug: string;
    locale: string;
    authorId?: string;
    integrityApprovedBy?: string;
    integrityApprovedAt?: string;
  };
}

export interface ContentUpdatedEvent extends BaseEvent {
  name: "content.updated";
  data: {
    documentId: string;
    documentType: string;
    sanityRevision: string;
    slug: string;
    locale: string;
    changedFields: string[];
  };
}

export interface ContentReviewDueEvent extends BaseEvent {
  name: "content.review_due";
  data: {
    documentId: string;
    documentType: string;
    slug: string;
    reviewDate: string;
    assignedEditorId?: string;
  };
}

/* ── Product Events ─────────────────────────────────────────────── */

export interface ProductLaunchedEvent extends BaseEvent {
  name: "product.launched";
  data: {
    productId: string;
    shopifyProductId: string;
    sanityDocumentId: string;
    handle: string;
    title: string;
  };
}

export interface ProductUpdatedEvent extends BaseEvent {
  name: "product.updated";
  data: {
    productId: string;
    shopifyProductId: string;
    handle: string;
    changedFields: string[];
  };
}

/* ── Course Events ──────────────────────────────────────────────── */

export interface CourseLaunchedEvent extends BaseEvent {
  name: "course.launched";
  data: {
    courseId: string;
    sanityDocumentId: string;
    slug: string;
    title: string;
    capacity: number;
    startDate: string;
  };
}

export interface CourseSessionUpcomingEvent extends BaseEvent {
  name: "course.session_upcoming";
  data: {
    courseId: string;
    sessionId: string;
    scheduledAt: string;
    studentIds: string[];
  };
}

/* ── Journey Events ─────────────────────────────────────────────── */

export interface JourneyPublishedEvent extends BaseEvent {
  name: "journey.published";
  data: {
    journeyId: string;
    sanityDocumentId: string;
    slug: string;
    title: string;
    capacity: number;
    departureDate: string;
  };
}

export interface JourneyEnrolledEvent extends BaseEvent {
  name: "journey.enrolled";
  data: {
    journeyId: string;
    personId: string;
    enrolmentId: string;
  };
}

export interface JourneyCompletedEvent extends BaseEvent {
  name: "journey.completed";
  data: {
    journeyId: string;
    personId: string;
    enrolmentId: string;
  };
}

/* ── Consultation Events ────────────────────────────────────────── */

export interface ConsultationBookedEvent extends BaseEvent {
  name: "consultation.booked";
  data: {
    consultationId: string;
    calcomBookingId: string;
    personId: string;
    practitionerId: string;
    scheduledAt: string;
    type: string;
  };
}

export interface ConsultationUpcomingEvent extends BaseEvent {
  name: "consultation.upcoming";
  data: {
    consultationId: string;
    personId: string;
    practitionerId: string;
    scheduledAt: string;
    hoursUntil: number;
  };
}

export interface ConsultationCompletedEvent extends BaseEvent {
  name: "consultation.completed";
  data: {
    consultationId: string;
    personId: string;
    practitionerId: string;
  };
}

/* ── Order Events ───────────────────────────────────────────────── */

export interface OrderPaidEvent extends BaseEvent {
  name: "order.paid";
  data: {
    orderId: string;
    shopifyOrderId: string;
    stripePaymentIntentId: string;
    personId: string;
    totalAmount: number;
    currency: string;
    lineItems: Array<{ productId: string; quantity: number; amount: number }>;
  };
}

export interface OrderShippedEvent extends BaseEvent {
  name: "order.shipped";
  data: {
    orderId: string;
    shopifyOrderId: string;
    personId: string;
    trackingNumber?: string;
    carrier?: string;
  };
}

export interface OrderRefundedEvent extends BaseEvent {
  name: "order.refunded";
  data: {
    orderId: string;
    shopifyOrderId: string;
    personId: string;
    refundAmount: number;
    currency: string;
    reason: string;
    approvedBy?: string;
  };
}

export interface CartAbandonedEvent extends BaseEvent {
  name: "cart.abandoned";
  data: {
    cartId: string;
    personId?: string;
    email?: string;
    items: Array<{ productId: string; quantity: number }>;
    totalValue: number;
    currency: string;
    abandonedAt: string;
  };
}

/* ── Student Events ─────────────────────────────────────────────── */

export interface StudentEnrolledEvent extends BaseEvent {
  name: "student.enrolled";
  data: {
    studentId: string;
    personId: string;
    courseId: string;
    enrolmentId: string;
  };
}

export interface CertificateEarnedEvent extends BaseEvent {
  name: "certificate.earned";
  data: {
    certificateId: string;
    studentId: string;
    personId: string;
    courseId: string;
    issuedAt: string;
  };
}

/* ── Inventory Events ───────────────────────────────────────────── */

export interface InventoryLowEvent extends BaseEvent {
  name: "inventory.low";
  data: {
    productId: string;
    shopifyVariantId: string;
    sku: string;
    currentStock: number;
    reorderPoint: number;
    locationId: string;
  };
}

export interface InventoryBatchExpiringEvent extends BaseEvent {
  name: "inventory.batch_expiring";
  data: {
    batchId: string;
    productId: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    locationId: string;
    daysUntilExpiry: number;
  };
}

/* ── Finance Events ─────────────────────────────────────────────── */

export interface InvoiceIssuedEvent extends BaseEvent {
  name: "invoice.issued";
  data: {
    invoiceId: string;
    orderId: string;
    personId: string;
    totalAmount: number;
    vatAmount: number;
    currency: string;
  };
}

export interface FinanceReconciliationExceptionEvent extends BaseEvent {
  name: "finance.reconciliation_exception";
  data: {
    exceptionId: string;
    type: "payout_mismatch" | "order_mismatch" | "missing_entry";
    details: string;
    amount?: number;
  };
}

/* ── Contact Events ─────────────────────────────────────────────── */

export interface ContactCreatedEvent extends BaseEvent {
  name: "contact.created";
  data: {
    personId: string;
    email: string;
    source: string;
    roles: string[];
  };
}

/* ── Auth Events ────────────────────────────────────────────────── */

export interface AuthResetRequestedEvent extends BaseEvent {
  name: "auth.reset_requested";
  data: { personId: string; email: string };
}

export interface AuthVerifyRequestedEvent extends BaseEvent {
  name: "auth.verify_requested";
  data: { personId: string; email: string; token: string };
}

/* ── Waitlist Events ────────────────────────────────────────────── */

export interface WaitlistSpotAvailableEvent extends BaseEvent {
  name: "waitlist.spot_available";
  data: {
    waitlistId: string;
    entityType: "course" | "journey" | "consultation" | "product";
    entityId: string;
    personId: string;
  };
}

/* ── Email Events ───────────────────────────────────────────────── */

export interface EmailBouncedEvent extends BaseEvent {
  name: "email.bounced";
  data: {
    emailId: string;
    email: string;
    reason: string;
    bounceType: "hard" | "soft";
  };
}

export interface EmailComplainedEvent extends BaseEvent {
  name: "email.complained";
  data: {
    emailId: string;
    email: string;
  };
}

/* ── System Events ──────────────────────────────────────────────── */

export interface SystemJobFailedEvent extends BaseEvent {
  name: "system.job_failed";
  data: {
    jobId: string;
    workflowName: string;
    error: string;
    attempts: number;
    lastAttemptAt: string;
  };
}

export interface SystemConsistencyDriftEvent extends BaseEvent {
  name: "system.consistency_drift";
  data: {
    surface: string;
    expectedHash: string;
    actualHash: string;
    diff: string;
  };
}

export interface SystemHealthCheckEvent extends BaseEvent {
  name: "system.health_check";
  data: {
    service: string;
    status: "healthy" | "degraded" | "down";
    latencyMs?: number;
    details?: string;
  };
}

/* ── Union Type ─────────────────────────────────────────────────── */

export type InstitutionEvent =
  | ContentPublishedEvent
  | ContentUpdatedEvent
  | ContentReviewDueEvent
  | ProductLaunchedEvent
  | ProductUpdatedEvent
  | CourseLaunchedEvent
  | CourseSessionUpcomingEvent
  | JourneyPublishedEvent
  | JourneyEnrolledEvent
  | JourneyCompletedEvent
  | ConsultationBookedEvent
  | ConsultationUpcomingEvent
  | ConsultationCompletedEvent
  | OrderPaidEvent
  | OrderShippedEvent
  | OrderRefundedEvent
  | CartAbandonedEvent
  | StudentEnrolledEvent
  | CertificateEarnedEvent
  | InventoryLowEvent
  | InventoryBatchExpiringEvent
  | InvoiceIssuedEvent
  | FinanceReconciliationExceptionEvent
  | ContactCreatedEvent
  | AuthResetRequestedEvent
  | AuthVerifyRequestedEvent
  | WaitlistSpotAvailableEvent
  | EmailBouncedEvent
  | EmailComplainedEvent
  | SystemJobFailedEvent
  | SystemConsistencyDriftEvent
  | SystemHealthCheckEvent;

export type EventName = InstitutionEvent["name"];
