import "./dua-dhikr.css";

interface ArabicTextProps {
  children: string;
  id?: string;
  className?: string;
  /** "large" is used by Memorise mode — see MemoriseMode.tsx. */
  size?: "default" | "large";
}

/**
 * Shared Arabic reading block for Duʿā & Dhikr content.
 *
 * Reuses the same `.type-arabic` global class + `dir="rtl" lang="ar"`
 * convention already established inline in
 * src/app/[locale]/knowledge/dhikr/morning/MorningDhikrCollection.tsx, now
 * factored into one component so future Duʿā & Dhikr surfaces do not
 * duplicate it a third time (see docs/dua-dhikr/VISUAL_SYSTEM.md). No
 * truncation, no decorative background — legibility of the Arabic is never
 * reduced.
 */
export function ArabicText({ children, id, className, size = "default" }: ArabicTextProps) {
  const classes = ["type-arabic", "dua-dhikr-arabic", `dua-dhikr-arabic--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <p id={id} dir="rtl" lang="ar" className={classes}>
      {children}
    </p>
  );
}
