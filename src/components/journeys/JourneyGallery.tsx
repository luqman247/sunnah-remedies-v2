import Image from "next/image";
import type { GalleryItem } from "@/lib/content/journeys/types";

const galleryPhotography: Record<string, { src: string; alt: string }> = {
  "grove-path": {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "Ancient olive grove path — stone walkway through terraced hillsides at dawn",
  },
  lodge: {
    src: "/photography/architecture-twilight.jpg",
    alt: "The lodge — historic stone architecture with warm lantern light at twilight",
  },
  press: {
    src: "/photography/olive-oil-editorial.jpg",
    alt: "The olive press — traditional oil production from ancestral groves",
  },
  ridge: {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "The ridge path — pilgrims walking through ancient landscape at golden hour",
  },
  "desert-walk": {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "The desert walk — an open landscape of sand and sky at dawn",
  },
  camp: {
    src: "/photography/architecture-twilight.jpg",
    alt: "The evening camp — a quiet gathering place under shelter",
  },
  stars: {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "Night sky over the landscape — reflection and stillness",
  },
  host: {
    src: "/photography/architecture-twilight.jpg",
    alt: "The host — a gathering space for companionship and shared meals",
  },
};

export function JourneyGallery({ items }: { items: GalleryItem[] }) {
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
