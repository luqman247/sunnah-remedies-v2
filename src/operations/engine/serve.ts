/**
 * Phase 8 — Inngest Function Registry
 *
 * All durable workflow functions are registered here and served
 * through a single Next.js API route.
 */

import { serve } from "inngest/next";
import { inngest } from "./client";

import { contentPublishedWorkflow } from "../workflows/publishing/content-published";
import { contentUpdatedWorkflow } from "../workflows/publishing/content-updated";
import { consistencyReconciliation } from "../workflows/publishing/consistency-reconciliation";

import { productLaunchWorkflow } from "../workflows/commerce/product-launch";
import { orderPaidWorkflow } from "../workflows/commerce/order-paid";
import { orderShippedWorkflow } from "../workflows/commerce/order-shipped";
import { orderRefundedWorkflow } from "../workflows/commerce/order-refunded";
import { cartAbandonmentWorkflow } from "../workflows/commerce/cart-abandonment";

import { courseLaunchWorkflow } from "../workflows/education/course-launch";
import { studentEnrolledWorkflow } from "../workflows/education/student-enrolled";
import { certificateEarnedWorkflow } from "../workflows/education/certificate-earned";
import { courseSessionReminderWorkflow } from "../workflows/education/course-session-reminder";

import { consultationBookedWorkflow } from "../workflows/consultation/consultation-booked";
import { consultationReminderWorkflow } from "../workflows/consultation/consultation-reminder";
import { consultationCompletedWorkflow } from "../workflows/consultation/consultation-completed";

import { journeyPublishedWorkflow } from "../workflows/journey/journey-published";
import { journeyEnrolledWorkflow } from "../workflows/journey/journey-enrolled";
import { journeyCompletedWorkflow } from "../workflows/journey/journey-completed";

import { inventoryLowWorkflow } from "../workflows/inventory/inventory-low";
import { batchExpiringWorkflow } from "../workflows/inventory/batch-expiring";

import { invoiceIssuedWorkflow } from "../workflows/finance/invoice-issued";
import { reconciliationWorkflow } from "../workflows/finance/reconciliation";

import { reviewDueWorkflow } from "../workflows/editorial/review-due";
import { brokenLinkCheckWorkflow } from "../workflows/editorial/broken-link-check";
import { citationValidationWorkflow } from "../workflows/editorial/citation-validation";
import { seoReviewWorkflow } from "../workflows/editorial/seo-review";

import { contactCreatedWorkflow } from "../workflows/commerce/contact-created";
import { emailBounceWorkflow } from "../workflows/commerce/email-bounce";

import { systemJobFailedWorkflow } from "../workflows/publishing/system-job-failed";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    contentPublishedWorkflow,
    contentUpdatedWorkflow,
    consistencyReconciliation,
    productLaunchWorkflow,
    orderPaidWorkflow,
    orderShippedWorkflow,
    orderRefundedWorkflow,
    cartAbandonmentWorkflow,
    courseLaunchWorkflow,
    studentEnrolledWorkflow,
    certificateEarnedWorkflow,
    courseSessionReminderWorkflow,
    consultationBookedWorkflow,
    consultationReminderWorkflow,
    consultationCompletedWorkflow,
    journeyPublishedWorkflow,
    journeyEnrolledWorkflow,
    journeyCompletedWorkflow,
    inventoryLowWorkflow,
    batchExpiringWorkflow,
    invoiceIssuedWorkflow,
    reconciliationWorkflow,
    reviewDueWorkflow,
    brokenLinkCheckWorkflow,
    citationValidationWorkflow,
    seoReviewWorkflow,
    contactCreatedWorkflow,
    emailBounceWorkflow,
    systemJobFailedWorkflow,
  ],
});
