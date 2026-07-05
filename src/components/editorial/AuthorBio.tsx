"use client";

/**
 * AuthorBio — person reference rendered as a compact bio block (Ch. 3.2).
 * Portrait + name + role + short bio.
 */

import { useTranslations } from "next-intl";
import { EditorialImage } from "@/components/media/EditorialImage";

interface AuthorBioProps {
  name: string;
  role?: string;
  bio?: string;
  portrait?: { publicId?: string; src?: string; alt: string };
}

export function AuthorBio({ name, role, bio, portrait }: AuthorBioProps) {
  const t = useTranslations("editorial");

  return (
    <aside
      aria-label={t("aboutAuthor", { name })}
      style={{
        display: "grid",
        gridTemplateColumns: portrait ? "64px 1fr" : "1fr",
        gap: "var(--space-4)",
        alignItems: "start",
        paddingBlock: "var(--space-6)",
        borderBlockStart: "var(--hairline)",
      }}
    >
      {portrait && (
        <EditorialImage
          publicId={portrait.publicId}
          src={portrait.src}
          preset="portrait"
          alt={portrait.alt}
          sizes="64px"
          aspect="1/1"
          width={64}
          height={64}
        />
      )}
      <div>
        <p className="type-dept-name" style={{ margin: 0 }}>{name}</p>
        {role && (
          <p className="type-caption" style={{ margin: "var(--space-1) 0 0", color: "var(--ink-soft)" }}>
            {role}
          </p>
        )}
        {bio && (
          <p className="type-small-v2" style={{ margin: "var(--space-3) 0 0", color: "var(--ink-soft)" }}>
            {bio}
          </p>
        )}
      </div>
    </aside>
  );
}
