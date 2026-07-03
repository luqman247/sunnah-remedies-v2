import Image from "next/image";
import { tagline } from "@/lib/tokens";

export function Wordmark({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  const primary = isLight ? "var(--paper)" : "var(--ink)";
  const accent = isLight ? "var(--gilt-soft)" : "var(--gilt)";
  const sub = isLight ? "var(--paper-dim)" : "var(--muted)";

  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: primary,
          margin: "0 0 var(--s2)",
          lineHeight: 1.1,
        }}
      >
        Sunnah
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--s3)",
          marginBottom: "var(--s4)",
        }}
      >
        <span style={{ width: "2.5rem", height: "1px", background: accent }} aria-hidden="true" />
        <span
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          Remedies
        </span>
        <span style={{ width: "2.5rem", height: "1px", background: accent }} aria-hidden="true" />
      </div>
      <p
        className="type-folio"
        style={{ color: sub, letterSpacing: "0.24em", margin: 0 }}
      >
        {tagline}
      </p>
    </div>
  );
}

export function Emblem({ size = 120 }: { size?: number }) {
  return (
    <Image
      src="/brand/emblem-transparent.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      style={{
        width: "auto",
        height: `clamp(72px, 14vw, ${size}px)`,
        display: "block",
        margin: "0 auto",
      }}
    />
  );
}
