"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryItem } from "@/lib/content/journeys/types";

const galleryPhotoKeys: Record<string, { src: string; altKey: string }> = {
  "grove-path": {
    src: "/photography/sacred-journeys-hero.jpg",
    altKey: "grovePath",
  },
  lodge: {
    src: "/photography/architecture-twilight.jpg",
    altKey: "lodge",
  },
  press: {
    src: "/photography/olive-oil-editorial.jpg",
    altKey: "press",
  },
  ridge: {
    src: "/photography/sacred-journeys-hero.jpg",
    altKey: "ridge",
  },
  "desert-walk": {
    src: "/photography/sacred-journeys-hero.jpg",
    altKey: "desertWalk",
  },
  camp: {
    src: "/photography/architecture-twilight.jpg",
    altKey: "camp",
  },
  stars: {
    src: "/photography/sacred-journeys-hero.jpg",
    altKey: "stars",
  },
  host: {
    src: "/photography/architecture-twilight.jpg",
    altKey: "host",
  },
};

export function JourneyGallery({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("journeys.galleryAlts");

  return (
    <div className="facility-gallery">
      {items.map((item) => {
        const photo = galleryPhotoKeys[item.id];
        return (
          <figure key={item.id} className="facility-gallery__item">
            {photo ? (
              <Image
                src={photo.src}
                alt={t(photo.altKey as "grovePath" | "lodge" | "press" | "ridge" | "desertWalk" | "camp" | "stars" | "host")}
                width={640}
                height={440}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  aspectRatio: "320 / 220",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "320 / 220",
                  background: "var(--paper-deep)",
                }}
                role="img"
                aria-label={item.alt}
              />
            )}
            <figcaption className="type-small facility-gallery__caption">
              {item.caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
