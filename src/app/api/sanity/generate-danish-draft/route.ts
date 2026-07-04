import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { translateToDanish } from "@/lib/translation/translate";

const writableClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { _id, _type, title, excerpt, body: docBody, language } = body;

  if (language !== "en") {
    return NextResponse.json({ skipped: true, reason: "Not English source" });
  }

  const existing = await writableClient.fetch(
    `*[_type == $type && language == "da" && references($id)][0]._id`,
    { type: _type, id: _id },
  );

  if (existing) {
    return NextResponse.json({ skipped: true, reason: "Danish version already exists" });
  }

  const translated = await translateToDanish({
    title,
    excerpt,
    bodyJson: docBody,
  });

  if (!translated.title && !translated.excerpt) {
    return NextResponse.json({ error: "Translation returned empty" }, { status: 500 });
  }

  const draftId = `drafts.${_id}-da`;

  await writableClient.createOrReplace({
    _id: draftId,
    _type,
    language: "da",
    title: translated.title || title,
    excerpt: translated.excerpt || excerpt,
    body: translated.bodyJson || docBody,
    translationStatus: {
      _type: "translationStatus",
      state: "aiDraft",
      sourceVersion: _id,
      lastReviewedAt: null,
    },
  });

  return NextResponse.json({ created: draftId });
}
