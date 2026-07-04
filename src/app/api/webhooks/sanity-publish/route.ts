/**
 * Phase 8 — Sanity Publish Webhook
 *
 * Triggered when content is published in Sanity. Verifies the
 * Integrity gate has been cleared, then emits content.published
 * to the orchestration bus. All downstream propagation happens
 * automatically via Inngest workflows.
 *
 * This webhook does NOT process inline — it verifies, emits, and returns.
 */

import { NextRequest, NextResponse } from "next/server";
import { emitEvent } from "@/operations/events/emit";
import { logger } from "@/operations/logging";

const INTEGRITY_CONTENT_TYPES = ["article", "research", "knowledge", "clinical"];

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sanity-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      _id: documentId,
      _type: documentType,
      _rev: sanityRevision,
      slug,
      locale,
      authorId,
      integrityApproval,
    } = body;

    if (!documentId || !documentType) {
      return NextResponse.json({ error: "Missing document data" }, { status: 400 });
    }

    const contentType = mapDocumentType(documentType);
    const requiresIntegrity = INTEGRITY_CONTENT_TYPES.includes(contentType);

    if (requiresIntegrity && !integrityApproval?.approved) {
      logger.info("Content blocked — Integrity gate not cleared", {
        documentId,
        documentType,
      });
      return NextResponse.json({
        status: "blocked",
        reason: "integrity_gate_not_cleared",
      });
    }

    const eventName = getEventName(documentType);

    if (eventName === "product.launched") {
      await emitEvent("product.launched", {
        productId: documentId,
        shopifyProductId: body.shopifyProductId ?? "",
        sanityDocumentId: documentId,
        handle: slug?.current ?? "",
        title: body.title ?? "",
      });
    } else if (eventName === "course.launched") {
      await emitEvent("course.launched", {
        courseId: documentId,
        sanityDocumentId: documentId,
        slug: slug?.current ?? "",
        title: body.title ?? "",
        capacity: body.capacity ?? 0,
        startDate: body.startDate ?? "",
      });
    } else if (eventName === "journey.published") {
      await emitEvent("journey.published", {
        journeyId: documentId,
        sanityDocumentId: documentId,
        slug: slug?.current ?? "",
        title: body.title ?? "",
        capacity: body.capacity ?? 0,
        departureDate: body.departureDate ?? "",
      });
    } else {
      await emitEvent("content.published", {
        documentId,
        documentType,
        sanityRevision: sanityRevision ?? "",
        contentType,
        slug: slug?.current ?? "",
        locale: locale ?? "en",
        authorId: authorId ?? undefined,
        integrityApprovedBy: integrityApproval?.approvedBy ?? undefined,
        integrityApprovedAt: integrityApproval?.approvedAt ?? undefined,
      });
    }

    return NextResponse.json({ received: true, event: eventName });
  } catch (error) {
    logger.error("Sanity publish webhook error", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

function mapDocumentType(type: string): string {
  const map: Record<string, string> = {
    article: "article",
    knowledge: "knowledge",
    research: "research",
    product: "editorial",
    programme: "editorial",
    journey: "editorial",
  };
  return map[type] ?? "editorial";
}

function getEventName(documentType: string): string {
  switch (documentType) {
    case "product": return "product.launched";
    case "programme": return "course.launched";
    case "journey": return "journey.published";
    default: return "content.published";
  }
}
