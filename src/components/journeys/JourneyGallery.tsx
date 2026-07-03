import type { GalleryItem } from "@/lib/content/journeys/types";

export function JourneyGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="facility-gallery">
      {items.map((item) => (
        <figure key={item.id} className="facility-gallery__item">
          <svg viewBox="0 0 320 220" role="img" aria-label={item.alt} className="facility-gallery__svg">
            <title>{item.alt}</title>
            {item.id === "grove-path" && <GrovePathStudy />}
            {item.id === "lodge" && <LodgeStudy />}
            {item.id === "press" && <PressStudy />}
            {item.id === "ridge" && <RidgeStudy />}
            {item.id === "desert-walk" && <DesertWalkStudy />}
            {item.id === "camp" && <CampStudy />}
            {item.id === "stars" && <StarsStudy />}
            {item.id === "host" && <HostStudy />}
          </svg>
          <figcaption className="type-small facility-gallery__caption">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function GrovePathStudy() {
  return (
    <>
      <path d="M40 180 Q80 120 160 100 Q240 80 280 140" fill="none" stroke="#96763f" strokeWidth="1.4" />
      {[60, 100, 140, 200, 240].map((x) => (
        <ellipse key={x} cx={x} cy={120 - (x % 40)} rx="18" ry="28" fill="none" stroke="#96763f" strokeWidth="1.4" />
      ))}
    </>
  );
}

function LodgeStudy() {
  return (
    <>
      <rect x="80" y="80" width="160" height="100" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <path d="M80 80 L160 40 L240 80" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x="120" y="120" width="80" height="60" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function PressStudy() {
  return (
    <>
      <circle cx="160" cy="130" r="50" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x="130" y="60" width="60" height="40" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function RidgeStudy() {
  return (
    <>
      <path d="M20 180 L160 60 L300 180" fill="none" stroke="#96763f" strokeWidth="1.4" />
      {[80, 120, 160, 200, 240].map((x) => (
        <circle key={x} cx={x} cy={160 - (x % 60)} r="4" fill="none" stroke="#96763f" strokeWidth="1.4" />
      ))}
    </>
  );
}

function DesertWalkStudy() {
  return (
    <>
      <path d="M20 160 Q160 80 300 160" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <line x1="0" y1="180" x2="320" y2="180" stroke="#96763f" strokeWidth="1.4" />
      <circle cx="80" cy="145" r="5" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <circle cx="120" cy="130" r="5" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function CampStudy() {
  return (
    <>
      <path d="M60 160 L100 80 L140 160" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <path d="M180 160 L220 80 L260 160" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <circle cx="160" cy="190" r="20" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function StarsStudy() {
  return (
    <>
      <line x1="0" y1="180" x2="320" y2="180" stroke="#96763f" strokeWidth="1.4" />
      {[[60,40],[120,70],[200,50],[260,90],[180,30]].map(([x,y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#96763f" />
      ))}
    </>
  );
}

function HostStudy() {
  return (
    <>
      <ellipse cx="160" cy="150" rx="100" ry="30" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x="100" y="120" width="120" height="8" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}
