/**
 * Sanity Webhook → AI Ingestion Pipeline.
 *
 * Triggered on document publish/unpublish. Performs incremental
 * upsert or delete in the vector index.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { ingestDocument } from "@/ai/ingestion/adapters";
import { upsertChunks, deleteByDocId } from "@/ai/ingestion/indexing";
import { logEvent } from "@/ai/analytics";

export const runtime = "nodejs";
export const maxDuration = 60;

const INDEXED_TYPES = new Set([
  "hadith",
  "quranReferenceDoc",
  "article",
  "product",
  "researchPaper",
  "programme",
  "ingredient",
  "condition",
  "faq",
]);

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const body = await request.text();
    const signature = request.headers.get("sanity-webhook-signature");
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (secret && signature) {
      const expected = createHash("sha256")
        .update(body + secret)
        .digest("hex");
      if (signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { _type, _id, _rev, operation } = payload as {
      _type: string;
      _id: string;
      _rev?: string;
      operation?: string;
    };

    // Skip draft documents
    if (_id.startsWith("drafts.")) {
      return NextResponse.json({ skipped: true, reason: "draft document" });
    }

    // Skip non-indexed types
    if (!INDEXED_TYPES.has(_type)) {
      return NextResponse.json({ skipped: true, reason: `type ${_type} not indexed` });
    }

    if (operation === "delete") {
      await deleteByDocId(_id);
      logEvent({
        type: "query",
        surface: "ingestion",
        language: "en",
        data: { action: "webhook_delete", docType: _type, docId: _id },
      });
      return NextResponse.json({ success: true, action: "deleted", docId: _id });
    }

    // Ingest (create or update)
    const chunks = await ingestDocument(_type, _id);
    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        action: "no_chunks",
        docId: _id,
      });
    }

    // Delete old vectors first, then upsert new ones
    await deleteByDocId(_id);
    const result = await upsertChunks(chunks);

    logEvent({
      type: "query",
      surface: "ingestion",
      language: "en",
      data: {
        action: "webhook_upsert",
        docType: _type,
        docId: _id,
        chunks: result.upserted,
      },
    });

    return NextResponse.json({
      success: true,
      action: "upserted",
      docId: _id,
      chunks: result.upserted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[AI Webhook Error]", error);
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
