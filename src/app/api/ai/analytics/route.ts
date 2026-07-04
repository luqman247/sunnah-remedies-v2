/**
 * AI Analytics & Knowledge Gap Dashboard Endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getKnowledgeGaps,
  getTopUnansweredQueries,
  getPerformanceMetrics,
  getMostCitedSources,
} from "@/ai/analytics";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.AI_ADMIN_TOKEN;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "overview";

  switch (view) {
    case "knowledge_gaps":
      return NextResponse.json({
        gaps: getKnowledgeGaps(50),
        topUnanswered: getTopUnansweredQueries(20),
      });

    case "performance":
      return NextResponse.json(getPerformanceMetrics());

    case "citations":
      return NextResponse.json({
        mostCited: getMostCitedSources(10),
      });

    case "overview":
    default:
      return NextResponse.json({
        performance: getPerformanceMetrics(),
        knowledgeGaps: getKnowledgeGaps(10),
        topUnanswered: getTopUnansweredQueries(10),
        mostCited: getMostCitedSources(10),
      });
  }
}
