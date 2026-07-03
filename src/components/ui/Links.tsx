import Link from "next/link";

interface RunningHeadProps {
  section: string;
  folio: string;
}

export function RunningHead({ section, folio }: RunningHeadProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "var(--s3)",
        borderBottom: "1px solid var(--rule)",
        marginBottom: "var(--s5)",
      }}
    >
      <span className="type-eyebrow" style={{ color: "var(--muted)" }}>
        {section}
      </span>
      <span className="type-folio" style={{ color: "var(--muted-light)" }}>
        {folio}
      </span>
    </div>
  );
}

interface GoLinkProps {
  href: string;
  children: React.ReactNode;
}

export function GoLink({ href, children }: GoLinkProps) {
  return (
    <Link href={href} className="go-link">
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

interface QuietLinkProps {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}

export function QuietLink({ href, children, dark }: QuietLinkProps) {
  return (
    <Link href={href} className={`quiet-link ${dark ? "quiet-link--dark" : ""}`}>
      {children}
    </Link>
  );
}

interface SolidActionProps {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}

export function SolidAction({
  href,
  children,
  disabled,
  type = "button",
  onClick,
}: SolidActionProps) {
  if (href && !disabled) {
    return (
      <Link href={href} className="solid-action">
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className="solid-action"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
