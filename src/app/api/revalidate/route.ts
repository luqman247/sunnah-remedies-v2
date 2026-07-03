import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation webhook for Sanity.
 *
 * When content is published in Sanity Studio, a webhook
 * triggers this endpoint to regenerate affected pages.
 *
 * Configure in Sanity: Settings → API → Webhooks
 * URL: https://your-domain.com/api/revalidate
 * Trigger: Create, Update, Delete
 * Filter: _type in ["homepage", "product", "programme", "journey", "article", ...]
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    switch (_type) {
      case "homepage":
        revalidatePath("/");
        break;
      case "product":
        revalidatePath("/the-apothecary");
        if (slug?.current) revalidatePath(`/the-apothecary/${slug.current}`);
        break;
      case "programme":
        revalidatePath("/the-academy");
        if (slug?.current) revalidatePath(`/the-academy/${slug.current}`);
        break;
      case "journey":
        revalidatePath("/sacred-journeys");
        if (slug?.current) revalidatePath(`/sacred-journeys/${slug.current}`);
        break;
      case "article":
      case "topic":
        revalidatePath("/knowledge-library");
        if (slug?.current) revalidatePath(`/knowledge-library/${slug.current}`);
        break;
      case "charter":
        revalidatePath("/charter");
        break;
      case "consultationsPage":
        revalidatePath("/consultations");
        break;
      case "navigation":
      case "footerSettings":
      case "institutionSettings":
        revalidatePath("/", "layout");
        break;
      default:
        revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}
