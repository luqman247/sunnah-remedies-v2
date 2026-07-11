/**
 * GET /api/draft/disable — exit Draft Mode.
 * Optional ?redirect=/path to return to a specific page (defaults to /).
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const target = request.nextUrl.searchParams.get("redirect") || "/";
  const safe =
    target.startsWith("/") && !target.startsWith("//") ? target : "/";
  redirect(safe);
}
