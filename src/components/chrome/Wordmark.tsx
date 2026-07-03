import { tagline } from "@/lib/tokens";
import Image from "next/image";

export function Wordmark({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <div className={`wordmark wordmark--${variant}`}>
      <p className="wordmark__primary">Sunnah</p>
      <div className="wordmark__secondary-row">
        <span className="wordmark__rule" aria-hidden="true" />
        <span className="wordmark__secondary">Remedies</span>
        <span className="wordmark__rule" aria-hidden="true" />
      </div>
      <p className="type-folio wordmark__tagline">{tagline}</p>
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
      height={Math.round(size * 1.25)}
      className="emblem"
      priority={size >= 100}
      style={{ height: `clamp(64px, 12vw, ${size}px)` }}
    />
  );
}
