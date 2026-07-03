import Image from "next/image";
import Link from "next/link";
import { brand, brandAlt } from "@/lib/brand";

type SealSize = "full" | "mid" | "small";

const dimensions: Record<SealSize, { width: number; height: number; heightStyle: string }> = {
  full: { width: 192, height: 192, heightStyle: "clamp(88px, 20vw, 192px)" },
  mid: { width: 120, height: 120, heightStyle: "clamp(40px, 8vw, 120px)" },
  small: { width: 32, height: 32, heightStyle: "32px" },
};

interface SealProps {
  size?: SealSize;
  linked?: boolean;
  className?: string;
  variant?: "primary" | "reversed";
}

export function Seal({ size = "small", linked = true, className = "", variant = "primary" }: SealProps) {
  const { width, height, heightStyle } = dimensions[size];
  const src = variant === "reversed" ? brand.icon.ivoryReversed : brand.icon.primary;
  const clearSpace = size === "small" ? "0.75rem" : "1.5rem";

  const image = (
    <Image
      src={src}
      alt={brandAlt}
      width={width}
      height={height}
      priority={size === "full"}
      style={{
        width: "auto",
        height: heightStyle,
        display: "block",
      }}
    />
  );

  const wrapper = (
    <span
      className={className}
      style={{
        display: "inline-block",
        padding: clearSpace,
        lineHeight: 0,
      }}
    >
      {image}
    </span>
  );

  if (linked) {
    return (
      <Link href="/" aria-label="Return to the threshold">
        {wrapper}
      </Link>
    );
  }

  return wrapper;
}
