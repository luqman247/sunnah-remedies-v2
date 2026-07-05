"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryItem } from "@/lib/content/academy/types";

const galleryPhotoIds = ["clinical-suite", "reading-room", "seminar-hall", "instruments"] as const;

const galleryPhotoKeys: Record<(typeof galleryPhotoIds)[number], "clinicalSuite" | "readingRoom" | "seminarHall" | "clinicalInstruments"> = {
  "clinical-suite": "clinicalSuite",
  "reading-room": "readingRoom",
  "seminar-hall": "seminarHall",
  instruments: "clinicalInstruments",
};

const galleryPhotoSrc: Record<(typeof galleryPhotoIds)[number], string> = {
  "clinical-suite": "/photography/clinical-practice.jpg",
  "reading-room": "/photography/reading-room.jpg",
  "seminar-hall": "/photography/academy-learning.jpg",
  instruments: "/photography/clinical-practice.jpg",
};

export function FacilityGallery({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("academy.facilityGallery");

  return (
    <div className="facility-gallery">
      {items.map((item) => {
        const photoId = galleryPhotoIds.find((id) => id === item.id);
        const photo = photoId
          ? { src: galleryPhotoSrc[photoId], alt: t(galleryPhotoKeys[photoId]) }
          : undefined;

        return (
          <figure key={item.id} className="facility-gallery__item">
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
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
