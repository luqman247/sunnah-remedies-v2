"use client";

import { useEffect } from "react";
import { recordCollectionVisit } from "@/lib/dua-dhikr/local-storage";

/** Invisible client component that records a collection-page visit for the local "Continue reading" list. */
export function RecordCollectionVisit({ slug, titleEn }: { slug: string; titleEn: string }) {
  useEffect(() => {
    recordCollectionVisit(slug, titleEn);
  }, [slug, titleEn]);

  return null;
}
