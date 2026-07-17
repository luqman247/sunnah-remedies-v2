import "./dhikr-collection.css";

/**
 * Shared status-notice box for both the "editorially reviewed" and
 * "reference collection" sections, on both Morning and Evening. Purely
 * presentational — the caller supplies the (already-translated) text; this
 * component never hardcodes copy.
 */
export function CollectionStatusNotice({
  variant,
  children,
}: {
  variant: "editorial" | "reference";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`dhikr-collection-notice${variant === "editorial" ? " dhikr-collection-notice--editorial" : ""}`}
      role="note"
    >
      <p className="type-body">{children}</p>
    </div>
  );
}
