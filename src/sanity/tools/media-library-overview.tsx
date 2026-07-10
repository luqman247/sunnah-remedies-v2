/**
 * Media Library overview — Studio tool for DAM health.
 */

"use client";

import { useEffect, useState } from "react";
import { useClient } from "sanity";

interface MediaCounts {
  images: number;
  videos: number;
  audio: number;
  brief: number;
  interim: number;
  final: number;
  productClass: number;
  apothecaryTagged: number;
  qcPending: number;
  missingAlt: number;
}

const EMPTY: MediaCounts = {
  images: 0,
  videos: 0,
  audio: 0,
  brief: 0,
  interim: 0,
  final: 0,
  productClass: 0,
  apothecaryTagged: 0,
  qcPending: 0,
  missingAlt: 0,
};

export function MediaLibraryOverview() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [counts, setCounts] = useState<MediaCounts>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await client.fetch<MediaCounts>(`{
          "images": count(*[_type == "mediaAsset"]),
          "videos": count(*[_type == "videoAsset"]),
          "audio": count(*[_type == "audioAsset"]),
          "brief": count(*[_type == "mediaAsset" && status == "brief"]),
          "interim": count(*[_type == "mediaAsset" && status == "interim"]),
          "final": count(*[_type == "mediaAsset" && status == "final"]),
          "productClass": count(*[_type == "mediaAsset" && assetClass == "product"]),
          "apothecaryTagged": count(*[_type == "mediaAsset" && "pillar:apothecary" in tags]),
          "qcPending": count(*[_type == "mediaAsset" && qcStatus == "pending"]),
          "missingAlt": count(*[_type == "mediaAsset" && decorative != true && !defined(alt)])
        }`);
        setCounts(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load media library");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [client]);

  const cards: { label: string; value: number; hint: string }[] = [
    { label: "Images", value: counts.images, hint: "mediaAsset documents" },
    { label: "Videos", value: counts.videos, hint: "videoAsset documents" },
    { label: "Audio", value: counts.audio, hint: "audioAsset documents" },
    { label: "Brief", value: counts.brief, hint: "Photography placeholders" },
    { label: "Interim", value: counts.interim, hint: "Early delivery" },
    { label: "Final", value: counts.final, hint: "Production-ready" },
    { label: "Product class", value: counts.productClass, hint: "Product photography" },
    { label: "Apothecary tagged", value: counts.apothecaryTagged, hint: "pillar:apothecary" },
    { label: "QC pending", value: counts.qcPending, hint: "Awaiting review" },
    { label: "Missing alt", value: counts.missingAlt, hint: "Accessibility gap" },
  ];

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "56rem",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#1a1814",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6b6560",
          }}
        >
          Digital Asset Management
        </p>
        <h1 style={{ margin: "0.5rem 0 0", fontSize: "1.75rem", fontWeight: 400 }}>
          Media Library
        </h1>
        <p style={{ margin: "0.75rem 0 0", color: "#6b6560", lineHeight: 1.5, maxWidth: "38rem" }}>
          Sanity holds metadata and references. Cloudinary delivers interim and
          final binaries. Products select library assets — they do not own the
          file. Use Where used before deleting
        </p>
      </header>

      {loading ? <p style={{ color: "#6b6560" }}>Loading library health…</p> : null}
      {error ? <p style={{ color: "#8b1e1e" }}>{error}</p> : null}

      {!loading && !error ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
            gap: "1rem",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                border: "1px solid #cac4b8",
                padding: "1rem",
                background: "#faf8f5",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6b6560",
                }}
              >
                {card.label}
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>{card.value}</p>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.75rem", color: "#6b6560" }}>
                {card.hint}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, margin: "0 0 0.75rem" }}>
          How to attach media to a product
        </h2>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "#3d3a36", lineHeight: 1.7 }}>
          <li>Create or find the asset under Structure → The Apothecary → Media Library</li>
          <li>Set status to Interim or Final and add Cloudinary delivery when ready</li>
          <li>Open the product → Media → Media Gallery → From Media Library</li>
          <li>For video, attach a library video (poster required for player mode)</li>
          <li>Never autoplay with sound</li>
        </ol>
      </section>
    </div>
  );
}
