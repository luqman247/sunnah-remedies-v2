import type { GalleryItem } from "@/lib/content/academy/types";

export function FacilityGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="facility-gallery">
      {items.map((item) => (
        <figure key={item.id} className="facility-gallery__item">
          <svg viewBox="0 0 320 220" role="img" aria-label={item.alt} className="facility-gallery__svg">
            <title>{item.alt}</title>
            {item.id === "clinical-suite" && <ClinicalSuiteStudy />}
            {item.id === "reading-room" && <ReadingRoomStudy />}
            {item.id === "seminar-hall" && <SeminarHallStudy />}
            {item.id === "instruments" && <InstrumentsStudy />}
          </svg>
          <figcaption className="type-small facility-gallery__caption">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function ClinicalSuiteStudy() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={20 + i * 48} y={40} width={40} height={140} fill="none" stroke="#96763f" strokeWidth="1.4" />
      ))}
      <line x1={160} y1={180} x2={160} y2={200} stroke="#96763f" strokeWidth="1.4" />
      <rect x={120} y={190} width={80} height={20} fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function ReadingRoomStudy() {
  return (
    <>
      <rect x={40} y={30} width={240} height={160} fill="none" stroke="#96763f" strokeWidth="1.4" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={60} y1={50 + i * 28} x2={260} y2={50 + i * 28} stroke="#96763f" strokeWidth="1.4" />
      ))}
      <rect x={100} y={120} width={120} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function SeminarHallStudy() {
  return (
    <>
      <rect x={30} y={50} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x={120} y={50} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x={210} y={50} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x={30} y={120} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x={120} y={120} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <rect x={210} y={120} width={80} height={50} fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}

function InstrumentsStudy() {
  return (
    <>
      <circle cx={100} cy={110} r={28} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <circle cx={160} cy={110} r={28} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <circle cx={220} cy={110} r={28} fill="none" stroke="#96763f" strokeWidth="1.4" />
      <line x1={40} y1={170} x2={280} y2={170} stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}
