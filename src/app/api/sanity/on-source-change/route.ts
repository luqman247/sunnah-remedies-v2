import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

function getWritableClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    token: process.env.SANITY_API_WRITE_TOKEN!,
    apiVersion: "2024-01-01",
    useCdn: false,
  });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { _id, language } = body;

  if (language !== "en") {
    return NextResponse.json({ skipped: true, reason: "Not English source" });
  }

  const writableClient = getWritableClient();

  const siblings = await writableClient.fetch<{ _id: string }[]>(
    `*[_type == "translation.metadata" && references($id)][0]
      .translations[].value->{ _id }`,
    { id: _id },
  );

  if (!siblings?.length) {
    return NextResponse.json({ skipped: true, reason: "No translation siblings found" });
  }

  const nonEnglish = siblings.filter(
    (s) => s._id !== _id && !s._id.endsWith("-en"),
  );

  let updated = 0;
  for (const sibling of nonEnglish) {
    const docId = sibling._id.startsWith("drafts.") ? sibling._id : sibling._id;
    const current = await writableClient.fetch<{ state?: string }>(
      `*[_id == $id][0].translationStatus`,
      { id: docId },
    );

    if (current?.state === "upToDate") {
      await writableClient
        .patch(docId)
        .set({
          "translationStatus.state": "needsTranslation",
          "translationStatus.sourceVersion": _id,
        })
        .commit();
      updated++;
    }
  }

  return NextResponse.json({ flagged: updated });
}
