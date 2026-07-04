/**
 * HeroMedia — full-bleed image OR ambient video hero (Ch. 3.1).
 *
 * When mode is 'image': renders EditorialImage with priority (LCP candidate).
 * When mode is 'video': renders EditorialVideo ambient with poster-first.
 * The poster is the LCP candidate when in video mode.
 */

import { EditorialImage } from "./EditorialImage";
import { EditorialVideo } from "./EditorialVideo";

interface HeroMediaImageProps {
  mode: "image";
  publicId?: string;
  src?: string;
  alt: string;
  aspect?: string;
  blurDataUrl?: string;
  caption?: string;
  credit?: string;
}

interface HeroMediaVideoProps {
  mode: "video";
  videoPublicId: string;
  poster: { publicId?: string; src?: string; alt: string; blurDataUrl?: string };
  aspect?: string;
  caption?: string;
  credit?: string;
}

type HeroMediaProps = HeroMediaImageProps | HeroMediaVideoProps;

export function HeroMedia(props: HeroMediaProps) {
  if (props.mode === "image") {
    return (
      <EditorialImage
        publicId={props.publicId}
        src={props.src}
        preset="hero"
        alt={props.alt}
        sizes="100vw"
        priority
        aspect={props.aspect || "16/7"}
        blurDataUrl={props.blurDataUrl}
        caption={props.caption}
        credit={props.credit}
      />
    );
  }

  return (
    <EditorialVideo
      publicId={props.videoPublicId}
      poster={props.poster}
      mode="ambient"
      aspect={props.aspect || "16/7"}
      caption={props.caption}
      credit={props.credit}
      priority
    />
  );
}
