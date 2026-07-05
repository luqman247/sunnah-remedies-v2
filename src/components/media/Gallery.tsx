/**
 * Gallery — editorial gallery with accessible lightbox (Ch. 3.1).
 *
 * Layouts: strip (horizontal scroll), grid, editorial (mixed sizes).
 * Lightbox: keyboard-operable, focus-trapped, Esc to close, focus returns.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { EditorialImage } from "./EditorialImage";

interface GalleryItem {
  publicId?: string;
  src?: string;
  alt: string;
  caption?: string;
  credit?: string;
  aspect?: string;
}

interface GalleryProps {
  items: GalleryItem[];
  layout?: "strip" | "grid" | "editorial";
}

export function Gallery({ items, layout = "grid" }: GalleryProps) {
  const t = useTranslations("media");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openLightbox = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    triggerRef.current?.focus();
  }, []);

  const gridStyle: React.CSSProperties = layout === "strip"
    ? { display: "flex", gap: "var(--space-4)", overflowX: "auto", paddingBlockEnd: "var(--space-4)" }
    : { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--space-4)" };

  return (
    <>
      <div style={gridStyle} role="list" aria-label={t("gallery")}>
        {items.map((item, i) => (
          <div key={i} role="listitem" style={layout === "strip" ? { flexShrink: 0, width: "280px" } : undefined}>
            <button
              type="button"
              onClick={(e) => openLightbox(i, e.currentTarget)}
              aria-label={t("viewImage", { alt: item.alt || t("imageNumber", { number: i + 1 }) })}
              style={{ display: "block", width: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
            >
              <EditorialImage
                publicId={item.publicId}
                src={item.src}
                preset="galleryThumb"
                alt={item.alt}
                sizes={layout === "strip" ? "280px" : "(min-width:768px) 25vw, 50vw"}
                aspect={item.aspect || "1/1"}
              />
            </button>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const t = useTranslations("media");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const item = items[currentIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight" && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={t("lightbox")}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        margin: 0,
        padding: "var(--space-8)",
        border: "none",
        background: "color-mix(in srgb, var(--ink) 95%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("closeLightbox")}
        style={{
          position: "absolute",
          insetBlockStart: "var(--space-6)",
          insetInlineEnd: "var(--space-6)",
          background: "none",
          border: "none",
          color: "var(--paper)",
          fontSize: "1.5rem",
          cursor: "pointer",
          minWidth: "44px",
          minHeight: "44px",
        }}
      >
        ✕
      </button>

      <div style={{ maxWidth: "90vw", maxHeight: "80vh", position: "relative" }}>
        <EditorialImage
          publicId={item.publicId}
          src={item.src}
          preset="editorial"
          alt={item.alt}
          sizes="90vw"
          width={1920}
          height={1080}
        />
      </div>

      {(item.caption || item.credit) && (
        <p className="type-caption" style={{ color: "var(--paper-on-deep)", textAlign: "center" }}>
          {item.caption}{item.credit && ` — ${item.credit}`}
        </p>
      )}

      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <button
          type="button"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label={t("previousImage")}
          style={{ background: "none", border: "none", color: "var(--paper)", fontSize: "1.5rem", cursor: "pointer", minWidth: "44px", minHeight: "44px", opacity: currentIndex === 0 ? 0.3 : 1 }}
        >
          ←
        </button>
        <span className="type-caption" style={{ color: "var(--paper-on-deep)", alignSelf: "center" }}>
          {currentIndex + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === items.length - 1}
          aria-label={t("nextImage")}
          style={{ background: "none", border: "none", color: "var(--paper)", fontSize: "1.5rem", cursor: "pointer", minWidth: "44px", minHeight: "44px", opacity: currentIndex === items.length - 1 ? 0.3 : 1 }}
        >
          →
        </button>
      </div>
    </dialog>
  );
}
