import "./evening-dhikr.css";

export default function EveningDhikrLoading() {
  return (
    <div className="evening-dhikr-skeleton" role="status">
      <div className="evening-dhikr-skeleton__line evening-dhikr-skeleton__line--short" />
      <div className="evening-dhikr-skeleton__line" />
    </div>
  );
}
