import { Link } from "@/i18n/navigation";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="type-micro" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? (
            <Link href={item.href} className="quiet-link" style={{ fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
