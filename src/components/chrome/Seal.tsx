import Image from "next/image";
import Link from "next/link";

type SealSize = "full" | "mid" | "small";

const sizes: Record<SealSize, { width: number; height: number; src: string }> = {
  full: { width: 320, height: 400, src: "/brand/primary_logo.png" },
  mid: { width: 160, height: 200, src: "/brand/primary_logo.png" },
  small: { width: 32, height: 40, src: "/brand/emblem-transparent.png" },
};

interface SealProps {
  size?: SealSize;
  linked?: boolean;
  className?: string;
}

export function Seal({ size = "small", linked = true, className = "" }: SealProps) {
  const { width, height, src } = sizes[size];
  const clearSpace = size === "small" ? "0.75rem" : "1.5rem";

  const image = (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      priority={size === "full"}
      style={{
        width: "auto",
        height: size === "full" ? "clamp(88px, 20vw, 320px)" : size === "mid" ? "clamp(40px, 8vw, 160px)" : "32px",
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
