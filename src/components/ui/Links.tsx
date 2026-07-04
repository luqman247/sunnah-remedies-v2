import { Link } from "@/i18n/navigation";

interface RunningHeadProps {
  section: string;
  folio: string;
}

export function RunningHead({ section, folio }: RunningHeadProps) {
  return (
    <div className="running-head">
      <span className="type-eyebrow">{section}</span>
      <span className="type-folio running-head__folio">{folio}</span>
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
