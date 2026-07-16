import "./morning-dhikr.css";

export default function MorningDhikrLoading() {
  return (
    <div className="morning-dhikr-skeleton" role="status" aria-label="Loading Morning Dhikr">
      <div className="morning-dhikr-skeleton__card" />
      <div className="morning-dhikr-skeleton__card" />
      <div className="morning-dhikr-skeleton__card" />
    </div>
  );
}
