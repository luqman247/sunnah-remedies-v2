/**
 * Plate — unified photography/placeholder component (Ch. 10).
 *
 * Three states driven by asset.status:
 * - brief: art-directed placeholder panel with shot brief
 * - interim: early photography with same layout
 * - final: production image with responsive srcset
 *
 * Status change causes zero layout shift (aspect is always reserved).
 */

import Image from "next/image";

interface MediaAsset {
  status: "brief" | "interim" | "final";
  purpose: string;
  composition: string;
  lens?: string;
  lighting: string;
  grade?: string;
  mood: string;
  location?: string;
  subject?: string;
  image?: { url: string; width?: number; height?: number };
  caption?: string;
  alt?: string;
  decorative?: boolean;
  credit?: string;
}

interface PlateProps {
  asset: MediaAsset;
  aspect: string;
  priority?: boolean;
  variant?: "standard" | "feature";
}

export function Plate({ asset, aspect, priority = false, variant = "standard" }: PlateProps) {
  const accessibleName = asset.alt || asset.purpose;

  return (
    <figure
      className={`plate plate--${variant}`}
      style={{
        position: "relative",
        aspectRatio: aspect,
        overflow: "hidden",
        margin: 0,
        borderRadius: "var(--radius)",
      }}
      aria-label={accessibleName}
    >
      {asset.status === "brief" && (
        <PlateBrief asset={asset} />
      )}

      {asset.status === "interim" && asset.image && (
        <PlateInterim asset={asset} priority={priority} />
      )}

      {asset.status === "final" && asset.image && (
        <PlateFinal asset={asset} priority={priority} />
      )}

      {asset.caption && asset.status === "final" && (
        <figcaption className="type-caption" style={{ marginBlockStart: "var(--space-3)" }}>
          {asset.caption}
          {asset.credit && <span> — {asset.credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function PlateBrief({ asset }: { asset: MediaAsset }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--paper-deep)",
        border: "1px solid var(--brass)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span className="type-folio-v2" style={{ color: "var(--brass)" }}>
        TO BE COMMISSIONED
      </span>
      <div className="type-caption" style={{ maxInlineSize: "48ch" }}>
        <p style={{ margin: "0 0 var(--space-2)" }}><strong>Purpose:</strong> {asset.purpose}</p>
        <p style={{ margin: "0 0 var(--space-2)" }}><strong>Composition:</strong> {asset.composition}</p>
        {asset.lens && <p style={{ margin: "0 0 var(--space-2)" }}><strong>Lens:</strong> {asset.lens}</p>}
        <p style={{ margin: "0 0 var(--space-2)" }}><strong>Light:</strong> {asset.lighting}</p>
        {asset.grade && <p style={{ margin: "0 0 var(--space-2)" }}><strong>Grade:</strong> {asset.grade}</p>}
        <p style={{ margin: 0 }}><strong>Mood:</strong> {asset.mood}</p>
      </div>
    </div>
  );
}

function PlateInterim({ asset, priority }: { asset: MediaAsset; priority: boolean }) {
  return (
    <>
      <Image
        src={asset.image!.url}
        alt={asset.alt || asset.purpose}
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        priority={priority}
        style={{ objectFit: "cover", border: "1px solid var(--brass)" }}
      />
      {asset.caption && (
        <figcaption
          className="type-caption"
          style={{
            position: "absolute",
            insetBlockEnd: "var(--space-4)",
            insetInlineStart: "var(--space-4)",
            color: "var(--paper-on-deep)",
          }}
        >
          {asset.caption} <em>(Interim)</em>
        </figcaption>
      )}
    </>
  );
}

function PlateFinal({ asset, priority }: { asset: MediaAsset; priority: boolean }) {
  return (
    <Image
      src={asset.image!.url}
      alt={asset.decorative ? "" : (asset.alt || asset.purpose)}
      fill
      sizes="(min-width: 1024px) 1200px, 100vw"
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      style={{ objectFit: "cover" }}
    />
  );
}
