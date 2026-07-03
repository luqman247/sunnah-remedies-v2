interface MonographSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function MonographSection({ id, title, children }: MonographSectionProps) {
  return (
    <section id={id} className="monograph-section" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="monograph-section__title">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function MonographProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 48)} className="type-body monograph-prose">
          {p}
        </p>
      ))}
    </>
  );
}

export function MonographList({ items }: { items: string[] }) {
  return (
    <ul className="monograph-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
