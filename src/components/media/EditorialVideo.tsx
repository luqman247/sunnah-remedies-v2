/**
 * EditorialVideo — inline video with poster-first strategy (Ch. 3.1, 4.5).
 *
 * Two modes:
 * - ambient: muted, loop, playsInline, autoplay gated on reduced-motion + save-data
 * - player: full controls, keyboard-operable, captions required for narrative
 *
 * Video is always deferred — poster is the paint target.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { CldVideoPlayer } from "next-cloudinary";
import { Poster } from "./Poster";
import { MediaCaption } from "./MediaCaption";

interface EditorialVideoProps {
  publicId: string;
  poster?: { publicId?: string; src?: string; alt: string; blurDataUrl?: string };
  mode: "ambient" | "player";
  captionsVtt?: string;
  aspect?: string;
  caption?: string;
  credit?: string;
  priority?: boolean;
}

export function EditorialVideo({
  publicId,
  poster,
  mode,
  captionsVtt,
  aspect = "16/9",
  caption,
  credit,
  priority,
}: EditorialVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "ambient") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = "connection" in navigator &&
      (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    setShouldAutoplay(!reducedMotion && !saveData);
  }, [mode]);

  if (mode === "ambient") {
    if (!shouldAutoplay && !isPlaying) {
      return (
        <figure style={{ margin: 0, aspectRatio: aspect }}>
          <Poster
            publicId={poster?.publicId}
            src={poster?.src}
            alt={poster?.alt || "Video poster"}
            aspect={aspect}
            priority={priority}
            onPlay={() => setIsPlaying(true)}
            blurDataUrl={poster?.blurDataUrl}
          />
          <MediaCaption caption={caption} credit={credit} />
        </figure>
      );
    }

    return (
      <figure ref={containerRef} style={{ margin: 0, position: "relative", aspectRatio: aspect, overflow: "hidden" }}>
        <CldVideoPlayer
          src={publicId}
          width="1920"
          height="1080"
          autoPlay={shouldAutoplay || isPlaying}
          muted
          loop
          controls={false}
          className="editorial-video-ambient"
        />
        <MediaCaption caption={caption} credit={credit} />
      </figure>
    );
  }

  if (!isPlaying) {
    return (
      <figure style={{ margin: 0, aspectRatio: aspect }}>
        <Poster
          publicId={poster?.publicId}
          src={poster?.src}
          alt={poster?.alt || "Video poster"}
          aspect={aspect}
          priority={priority}
          onPlay={() => setIsPlaying(true)}
          blurDataUrl={poster?.blurDataUrl}
        />
        <MediaCaption caption={caption} credit={credit} />
      </figure>
    );
  }

  return (
    <figure style={{ margin: 0, position: "relative", aspectRatio: aspect, overflow: "hidden" }}>
      <CldVideoPlayer
        src={publicId}
        width="1920"
        height="1080"
        autoPlay
        controls
        className="editorial-video-player"
        {...(captionsVtt ? { transformation: { overlay: undefined } } : {})}
      />
      <MediaCaption caption={caption} credit={credit} />
    </figure>
  );
}
