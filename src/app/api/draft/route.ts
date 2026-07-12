/**
 * GET /api/draft
 *
 * Legacy secret-in-query enable is retired. Studio and Seller Centre must use
 * POST /api/apothecary/preview (Sanity user token) or Presentation's
 * /api/draft-mode/enable (short-lived preview-url secrets).
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message:
        "Use authenticated preview initiation. Long-lived preview secrets are not accepted on this route.",
    },
    { status: 401 },
  );
}
