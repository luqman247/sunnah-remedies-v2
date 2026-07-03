import { ListingRow } from "@/components/ui/Attestation";
import { GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";

interface GatewayEntry {
  title: string;
  subtitle?: string;
  provenance: string;
  href: string;
}

interface DepartmentGatewayProps {
  numeral: string;
  name: string;
  role: string;
  story: string;
  catalogueLabel: string;
  href: string;
  linkLabel: string;
  entries: GatewayEntry[];
}

export function DepartmentGateway({
  numeral,
  name,
  role,
  story,
  catalogueLabel,
  href,
  linkLabel,
  entries,
}: DepartmentGatewayProps) {
  return (
    <article className="dept-gateway">
      <header className="dept-gateway__header">
        <span className="dept-row__numeral" aria-hidden="true">
          {numeral}
        </span>
        <div>
          <h2 className="type-title">{name}</h2>
          <p className="type-micro dept-row__role">{role}</p>
          <p className="type-body dept-gateway__story">{story}</p>
        </div>
      </header>

      <div className="dept-gateway__cabinet">
        <SectionLabel>{catalogueLabel}</SectionLabel>
        {entries.map((entry) => (
          <ListingRow key={entry.href} {...entry} />
        ))}
      </div>

      <div className="dept-gateway__link">
        <GoLink href={href}>{linkLabel}</GoLink>
      </div>
    </article>
  );
}
