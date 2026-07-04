import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { LOCALES } from "@/i18n/locales";

/**
 * Revalidate both locale paths for a given base path.
 * EN: /path, DA: /dk/path
 */
function revalidateI18n(basePath: string, type?: "layout" | "page") {
  for (const locale of LOCALES) {
    const localePath = locale.prefix
      ? `${locale.prefix}${basePath === "/" ? "" : basePath}`
      : basePath;
    revalidatePath(localePath || "/", type);
  }
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-sanity-webhook-secret");
    if (process.env.SANITY_REVALIDATE_SECRET && secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();
    const { _type, slug } = body;

    switch (_type) {
      case "homepage":
        revalidateI18n("/");
        break;
      case "product":
        revalidateI18n("/the-apothecary");
        if (slug?.current) revalidateI18n(`/the-apothecary/${slug.current}`);
        break;
      case "programme":
        revalidateI18n("/the-academy");
        if (slug?.current) revalidateI18n(`/the-academy/${slug.current}`);
        break;
      case "journey":
        revalidateI18n("/sacred-journeys");
        if (slug?.current) revalidateI18n(`/sacred-journeys/${slug.current}`);
        break;
      case "article":
      case "topic":
        revalidateI18n("/knowledge-library");
        if (slug?.current) revalidateI18n(`/knowledge-library/${slug.current}`);
        break;
      case "charter":
        revalidateI18n("/charter");
        break;
      case "consultationsPage":
        revalidateI18n("/consultations");
        break;
      case "navigation":
      case "footerSettings":
      case "institutionSettings":
        revalidateI18n("/", "layout");
        break;
      default:
        revalidateI18n("/");
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 },
    );
  }
}
