import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Draft Mode API — enables Sanity preview.
 *
 * Usage from Sanity Studio or browser:
 *   GET /api/draft?secret=YOUR_SECRET&slug=/the-apothecary/honey
 *
 * Enables Next.js Draft Mode and redirects to the target page,
 * which will then use the previewClient to fetch unpublished drafts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Preview secret not configured", { status: 500 });
  }

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
