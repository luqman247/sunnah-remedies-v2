interface HospitableEmptyProps {
  heading?: string;
  message?: string;
}

export function HospitableEmpty({
  heading = "The house is preparing",
  message = "This section is being readied — it will open when it is worthy of the visitor",
}: HospitableEmptyProps) {
  return (
    <div className="hospitable-empty">
      <p className="hospitable-empty__heading type-title">{heading}</p>
      <p className="hospitable-empty__message type-body">{message}</p>
    </div>
  );
}
