export function CorridorLoader() {
  return (
    <div className="corridor-loader" role="status" aria-label="Loading">
      <div className="corridor-loader__inner">
        <span className="corridor-loader__mark" aria-hidden="true">·</span>
      </div>
    </div>
  );
}
