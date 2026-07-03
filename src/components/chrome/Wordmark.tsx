import Image from "next/image";
import { brand, brandAlt } from "@/lib/brand";

export function Wordmark({ variant = "light" }: { variant?: "light" | "dark" }) {
  const src = variant === "light" ? brand.wordmark.ivory : brand.wordmark.emerald;

  return (
    <div className="wordmark" style={{ textAlign: "center" }}>
      <Image
        src={src}
        alt={brandAlt}
        width={600}
        height={71}
        priority
        style={{
          width: "clamp(200px, 40vw, 480px)",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

export function Emblem({ size = 120, variant = "primary" }: { size?: number; variant?: "primary" | "reversed" }) {
  const src = variant === "reversed" ? brand.icon.ivoryReversed : brand.icon.primary;

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="emblem"
      priority={size >= 100}
      style={{ height: `clamp(64px, 12vw, ${size}px)`, width: "auto" }}
    />
  );
}

export function BrandLockup({
  layout = "horizontal",
  variant = "primary",
  height = 48,
}: {
  layout?: "horizontal" | "stacked";
  variant?: "primary" | "reversed" | "descriptor";
  height?: number;
}) {
  const src =
    layout === "stacked"
      ? variant === "reversed"
        ? brand.lockup.stackedReversed
        : variant === "descriptor"
          ? brand.lockup.stackedDescriptor
          : brand.lockup.stackedPrimary
      : variant === "reversed"
        ? brand.lockup.horizontalReversed
        : variant === "descriptor"
          ? brand.lockup.horizontalDescriptor
          : brand.lockup.horizontalPrimary;

  const aspectRatio = layout === "stacked" ? 674 / 374 : 898 / 260;
  const width = Math.round(height * aspectRatio);

  return (
    <Image
      src={src}
      alt={brandAlt}
      width={width}
      height={height}
      style={{
        height: `${height}px`,
        width: "auto",
        display: "block",
      }}
    />
  );
}
