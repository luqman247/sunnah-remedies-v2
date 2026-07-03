import Image from "next/image";
import type { GalleryItem } from "@/lib/content/academy/types";

const galleryPhotography: Record<string, { src: string; alt: string }> = {
  "clinical-suite": {
    src: "/photography/clinical-practice.jpg",
    alt: "The clinical suite — a practitioner preparing sterile equipment in the treatment room",
  },
  "reading-room": {
    src: "/photography/reading-room.jpg",
    alt: "The reading room — a scholarly library with open texts, brass lamps, and bound volumes",
  },
  "seminar-hall": {
    src: "/photography/academy-learning.jpg",
    alt: "The seminar hall — students studying anatomical charts under natural light",
  },
  instruments: {
    src: "/photography/clinical-practice.jpg",
    alt: "Clinical instruments — sterile cupping cups arranged on a treatment tray",
  },
};

export function FacilityGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="facility-gallery">
      {items.map((item) => {
        const photo = galleryPhotography[item.id];
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
