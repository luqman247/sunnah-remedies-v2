/**
 * Institutional Open Graph image — shared ImageResponse composition.
 *
 * Used by app/opengraph-image.tsx and app/twitter-image.tsx.
 * Page-specific routes can later call createInstitutionalOgImage()
 * with alternate copy, or define their own opengraph-image.tsx.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/brand";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";
export const ogAlt =
  "Sunnah Remedies — Prophetic Medicine. Practised with Excellence.";

export interface InstitutionalOgCopy {
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  supporting?: string;
  footerLeft?: string;
  footerRight?: string;
}

const DEFAULT_COPY: Required<InstitutionalOgCopy> = {
  eyebrow: "SUNNAH REMEDIES",
  headlineLine1: "Prophetic Medicine.",
  headlineLine2: "Practised with Excellence.",
  supporting:
    "Scholarship, clinical care and natural therapeutics under one house.",
  footerLeft: "Institute of Prophetic Medicine",
  footerRight: "sunnahremedies.co.uk",
};

async function loadAsset(relativePath: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), relativePath));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

function toDataUrl(buffer: ArrayBuffer, mime: string): string {
  return `data:${mime};base64,${Buffer.from(buffer).toString("base64")}`;
}

export async function createInstitutionalOgImage(
  copy: InstitutionalOgCopy = {},
): Promise<ImageResponse> {
  const text = { ...DEFAULT_COPY, ...copy };

  const [fontRegular, fontBold, photo, monogram] = await Promise.all([
    loadAsset("src/assets/fonts/LibreBaskerville-Regular.ttf"),
    loadAsset("src/assets/fonts/LibreBaskerville-Bold.ttf"),
    loadAsset("public/photography/institution-hero.jpg"),
    loadAsset("public/brand/icon-ivory-reversed@1024.png"),
  ]);

  const photoSrc = toDataUrl(photo, "image/png");
  const monogramSrc = toDataUrl(monogram, "image/png");

  const { deepEmerald, antiqueGold, warmIvory } = brandColors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: deepEmerald,
          fontFamily: "Libre Baskerville",
        }}
      >
        {/* Editorial photograph — left half */}
        <div
          style={{
            display: "flex",
            width: "52%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            width={624}
            height={630}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Soft emerald wash toward the text panel */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "100%",
              background: `linear-gradient(to right, transparent 0%, ${deepEmerald} 100%)`,
            }}
          />
          {/* Subtle bottom vignette */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "28%",
              background:
                "linear-gradient(to top, rgba(14, 59, 46, 0.45) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Text panel — right half */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "48%",
            height: "100%",
            padding: "56px 56px 48px 40px",
            backgroundColor: deepEmerald,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Gold accent rule */}
            <div
              style={{
                display: "flex",
                width: "48px",
                height: "2px",
                backgroundColor: antiqueGold,
                marginBottom: "28px",
              }}
            />

            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                color: antiqueGold,
                fontSize: "18px",
                letterSpacing: "0.28em",
                fontWeight: 400,
                marginBottom: "28px",
              }}
            >
              {text.eyebrow}
            </div>

            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: warmIvory,
                fontSize: "46px",
                lineHeight: 1.18,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              <div style={{ display: "flex" }}>{text.headlineLine1}</div>
              <div style={{ display: "flex" }}>{text.headlineLine2}</div>
            </div>

            {/* Supporting line */}
            <div
              style={{
                display: "flex",
                marginTop: "28px",
                color: "rgba(246, 243, 238, 0.78)",
                fontSize: "20px",
                lineHeight: 1.45,
                fontWeight: 400,
                maxWidth: "440px",
              }}
            >
              {text.supporting}
            </div>
          </div>

          {/* Footer signature */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(199, 162, 90, 0.45)",
                marginBottom: "22px",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={monogramSrc}
                alt=""
                width={36}
                height={36}
                style={{ width: "36px", height: "36px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: warmIvory,
                    fontSize: "15px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {text.footerLeft}
                </div>
                <div
                  style={{
                    display: "flex",
                    color: antiqueGold,
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {text.footerRight}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Libre Baskerville",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Libre Baskerville",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
