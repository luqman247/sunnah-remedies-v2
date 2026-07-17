import type { IconKey } from "@/lib/dua-dhikr/taxonomy";

/**
 * Original, restrained two-tone line icon system for Duʿa & Dhikr
 * collections — see docs/dua-dhikr/VISUAL_SYSTEM.md.
 *
 * Every icon shares one 24x24 grid, 1.5px stroke, round joins/caps, and
 * currentColor so it inherits emerald/gold/ivory from its context via CSS,
 * never a hardcoded fill. None depict Prophets, Companions, angels, or
 * sacred personalities — every motif is geometric, botanical,
 * architectural, or a plain natural form (sun, water, cloud, wind, plate,
 * doorway, etc.), per the brief.
 *
 * Decorative by default (aria-hidden) because the adjacent collection
 * title always names the concept in text — pass `title` to expose an
 * accessible name for a standalone icon (e.g. in a legend).
 */

const PATHS: Record<IconKey, React.ReactNode> = {
  sunrise: (
    <>
      <path d="M12 3v4" />
      <path d="M4.5 12h-2M21.5 12h-2" />
      <path d="M6.5 6.5 5 5M19 5l-1.5 1.5" />
      <path d="M6 16a6 6 0 0 1 12 0" />
      <path d="M3 20h18" />
    </>
  ),
  "moon-bedding": (
    <>
      <path d="M16 5.5a5 5 0 1 0 3.5 8.6A6 6 0 0 1 16 5.5Z" />
      <path d="M3 19c1.5-2 3.5-3 6-3s4.5 1 6 3" />
      <path d="M3 19h18" />
    </>
  ),
  "prayer-mat": (
    <>
      <rect x="5" y="4" width="14" height="17" rx="1" />
      <path d="M8 8h8M8 11h8" />
      <path d="M12 14a3 3 0 0 0 3 3H9a3 3 0 0 0 3-3Z" />
    </>
  ),
  tasbih: (
    <>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="18" cy="8.5" r="1.6" />
      <circle cx="19.5" cy="14.5" r="1.6" />
      <circle cx="15" cy="19" r="1.6" />
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="4.5" cy="14.5" r="1.6" />
      <circle cx="6" cy="8.5" r="1.6" />
      <path d="M12 5v3" />
    </>
  ),
  "bedding-crescent": (
    <>
      <path d="M17 4.5a4 4 0 1 0 2.6 7A5 5 0 0 1 17 4.5Z" />
      <path d="M3 19c1.4-1.8 3.2-2.7 5.5-2.7s4.1.9 5.5 2.7" />
      <path d="M3 19h18" />
    </>
  ),
  "waking-sun": (
    <>
      <circle cx="12" cy="11" r="3.5" />
      <path d="M12 4v2M5 11H3M21 11h-2M6.8 5.8 5.4 4.4M17.2 5.8l1.4-1.4" />
      <path d="M3 20h18" />
    </>
  ),
  minaret: (
    <>
      <path d="M12 3 9.5 6h5L12 3Z" />
      <rect x="10" y="6" width="4" height="12" />
      <path d="M8 21v-1.5A2.5 2.5 0 0 1 10.5 17h3a2.5 2.5 0 0 1 2.5 2.5V21" />
      <path d="M6 21h12" />
    </>
  ),
  "istikharah-compass": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m14.5 9.5-5 2.5 2.5 5 5-2.5-2.5-5Z" />
    </>
  ),
  "plate-cup": (
    <>
      <ellipse cx="9" cy="17" rx="6" ry="2.3" />
      <path d="M4.5 17V9a4.5 4.5 0 0 1 9 0v8" />
      <path d="M17 6v6a2.5 2.5 0 0 0 2.5 2.5V6" />
      <path d="M19.5 6V4" />
    </>
  ),
  doorway: (
    <>
      <path d="M6 21V9l6-5 6 5v12" />
      <path d="M9 21v-7a3 3 0 0 1 6 0v7" />
    </>
  ),
  garment: (
    <>
      <path d="M9 4 5 6.5 6.5 10 8 8.5V21h8V8.5L17.5 10 19 6.5 15 4a3 3 0 0 1-6 0Z" />
    </>
  ),
  "water-droplet": (
    <>
      <path d="M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0c0-4.4 6-10.8 6-10.8Z" />
    </>
  ),
  "journey-path": (
    <>
      <path d="M4 19c3-6 5-9 8-9s5 3 8 9" />
      <circle cx="4" cy="19" r="1.4" />
      <circle cx="20" cy="19" r="1.4" />
      <path d="M11 6.5 12 4l1 2.5" />
    </>
  ),
  "gathering-circle": (
    <>
      <circle cx="7" cy="8" r="2.2" />
      <circle cx="17" cy="8" r="2.2" />
      <circle cx="12" cy="14" r="2.2" />
      <path d="M12 16.2V19M7 10.2 9.5 14M17 10.2 14.5 14" />
    </>
  ),
  handshake: (
    <>
      <path d="M2.5 12.5 6 9l3 2 3-2 3 2 3.5-3.5" />
      <path d="m9 11 3.5 3.5a1.7 1.7 0 0 1-2.4 2.4L7 13.8" />
      <path d="m12 14.5 1.6 1.6a1.7 1.7 0 0 0 2.4-2.4" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10a2.5 2 0 0 1 2.5-1.5c1.4 0 2.5.7 2.5 1.7 0 2.3-5 1.3-5 3.6 0 1 1.1 1.7 2.5 1.7a2.5 2 0 0 0 2.5-1.5" />
    </>
  ),
  "family-abstract": (
    <>
      <circle cx="8" cy="7" r="2.3" />
      <circle cx="16" cy="7" r="2.3" />
      <circle cx="12" cy="15" r="1.8" />
      <path d="M4.5 20c.6-2.6 2-4 3.5-4s2.9 1.4 3.5 4M12.5 20c.4-1.8 1.4-2.8 2.5-2.8M16.5 20c-.6-2.6-2-4-3.5-4" />
    </>
  ),
  "child-abstract": (
    <>
      <circle cx="12" cy="7" r="2.6" />
      <path d="M7.5 20c.8-3.6 2.3-5.4 4.5-5.4s3.7 1.8 4.5 5.4" />
    </>
  ),
  cradle: (
    <>
      <path d="M4 15a8 3 0 0 0 16 0" />
      <path d="M4 15V9M20 15V9" />
      <path d="M9 9V6M15 9V6" />
      <path d="M4 19h16" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="13" r="4" />
      <circle cx="15" cy="13" r="4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "heart-hands": (
    <>
      <path d="M12 8.5c-1-1.6-3.7-1.9-4.8-.3-1.1 1.6-.4 3.3 1 4.6L12 16.5l3.8-3.7c1.4-1.3 2.1-3 1-4.6-1.1-1.6-3.8-1.3-4.8.3Z" />
      <path d="M4 19c1.5-1.7 3-2.5 4.5-2.5M20 19c-1.5-1.7-3-2.5-4.5-2.5" />
    </>
  ),
  "cloud-worry": (
    <>
      <path d="M7 16a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.6 1.6A3.5 3.5 0 0 1 17 16H7Z" />
      <path d="M9.5 19.5h.01M12 19.5h.01M14.5 19.5h.01" />
    </>
  ),
  "open-quran": (
    <>
      <path d="M12 6c-1.6-1.3-3.6-1.8-6-1.5v13c2.4-.3 4.4.2 6 1.5" />
      <path d="M12 6c1.6-1.3 3.6-1.8 6-1.5v13c-2.4-.3-4.4.2-6 1.5V6Z" />
      <path d="M9 8.5h2.2M9 11h2.2M12.8 8.5H15M12.8 11H15" />
    </>
  ),
  "salawat-star": (
    <>
      <path d="M12 3.5 13.8 9h5.6l-4.5 3.4 1.7 5.6L12 14.6l-4.6 3.4 1.7-5.6L4.6 9h5.6L12 3.5Z" />
    </>
  ),
  "beautiful-names": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.5v1.6M12 18.9v1.6M20.5 12h-1.6M5.1 12H3.5" />
    </>
  ),
  "cloud-raindrop": (
    <>
      <path d="M7 14.5a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.6 1.6A3.5 3.5 0 0 1 17 14.5H7Z" />
      <path d="M9 17.5c0 1-.7 1.8-1 2.5M13 17.5c0 1-.7 1.8-1 2.5M17 17.5c0 1-.7 1.8-1 2.5" />
    </>
  ),
  "wind-lines": (
    <>
      <path d="M3 9h11a2.5 2.5 0 1 0-2.2-3.7" />
      <path d="M3 14h14.5a2.5 2.5 0 1 1-2.2 3.7" />
      <path d="M3 19h8" />
    </>
  ),
  "leaf-branch": (
    <>
      <path d="M5 19c8-1 12-6 13-13-7 1-12 5-13 13Z" />
      <path d="M8 16c2-2.5 4.5-4.5 8-6.5" />
    </>
  ),
  "crescent-fade": (
    <>
      <path d="M15 4.5a6.5 6.5 0 1 0 4.6 11A8 8 0 0 1 15 4.5Z" />
    </>
  ),
  "janazah-arch": (
    <>
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M5 21h14M9 21v-4h6v4" />
    </>
  ),
  "crescent-moon": (
    <>
      <path d="M16 4.5a7.5 7.5 0 1 0 4.9 13.2A9 9 0 0 1 16 4.5Z" />
    </>
  ),
  "mountain-path": (
    <>
      <path d="m3 18 6-10 4 6 2-3 6 7Z" />
      <path d="M12 18v-4" />
    </>
  ),
  "kaaba-outline": (
    <>
      <rect x="6" y="7" width="12" height="12" />
      <path d="M6 11h12M6 7l3-3h6l3 3" />
      <path d="M9 4v3M15 4v3" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 18c0-8 4-12.5 12-13-1 8-5 12-12 13Z" />
      <path d="M7.5 16.5C10 13 12.5 10.5 16 8" />
    </>
  ),
};

export interface DuaDhikrIconProps {
  iconKey: IconKey;
  size?: number;
  className?: string;
  /** Provide only when this icon stands alone with no adjacent text label. */
  title?: string;
}

export function DuaDhikrIcon({ iconKey, size = 24, className, title }: DuaDhikrIconProps) {
  const content = PATHS[iconKey] ?? PATHS.leaf;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {content}
    </svg>
  );
}
