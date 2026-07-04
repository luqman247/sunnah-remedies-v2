/**
 * AI Ingestion Endpoint — Webhook + Manual Triggers.
 *
 * Handles incremental ingestion (single document) and full
 * corpus re-indexing. Called by Sanity webhooks on publish/unpublish.
 */

import { NextRequest, NextResponse } from "next/server";
import { ingestDocument, ingestAllDocuments } from "@/ai/ingestion/adapters";
import { upsertChunks, deleteByDocId, fullReindex } from "@/ai/ingestion/indexing";
import { logEvent } from "@/ai/analytics";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.AI_ADMIN_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, docType, docId } = body as {
      action: "ingest" | "delete" | "full_reindex";
      docType?: string;
      docId?: string;
    };

    switch (action) {
      case "ingest": {
        if (!docType || !docId) {
          return NextResponse.json(
            { error: "docType and docId required for ingest" },
            { status: 400 }
          );
        }

        const chunks = await ingestDocument(docType, docId);
        if (chunks.length === 0) {
          return NextResponse.json({
            success: true,
            message: "No chunks generated (document may not exist or have no content)",
            chunks: 0,
          });
        }

        const result = await upsertChunks(chunks);

        logEvent({
          type: "query",
          surface: "ingestion",
          language: "en",
          data: { action, docType, docId, chunks: result.upserted, errors: result.errors },
        });

        return NextResponse.json({
          success: true,
          chunks: result.upserted,
          errors: result.errors,
        });
      }

      case "delete": {
        if (!docId) {
          return NextResponse.json(
            { error: "docId required for delete" },
            { status: 400 }
          );
        }

        await deleteByDocId(docId);

        logEvent({
          type: "query",
          surface: "ingestion",
          language: "en",
          data: { action, docId },
        });

        return NextResponse.json({ success: true, deleted: docId });
      }

      case "full_reindex": {
        const { chunks, results } = await ingestAllDocuments();
        const indexResult = await fullReindex(chunks);

        logEvent({
          type: "query",
          surface: "ingestion",
          language: "en",
          data: {
            action,
            totalChunks: indexResult.upserted,
            sources: results,
            errors: indexResult.errors,
          },
        });

        return NextResponse.json({
          success: true,
          totalChunks: indexResult.upserted,
          sources: results,
          errors: indexResult.errors,
        });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action. Use: ingest, delete, full_reindex" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Ingest Error]", error);
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
