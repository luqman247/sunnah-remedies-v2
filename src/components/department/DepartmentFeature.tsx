import Link from "next/link";
import Image from "next/image";
import { type ReactNode } from "react";

interface DepartmentFeatureProps {
  src: string;
  alt: string;
  reverse?: boolean;
  landscape?: boolean;
  children: ReactNode;
}

export function DepartmentFeature({
  src,
  alt,
  reverse = false,
  landscape = false,
  children,
}: DepartmentFeatureProps) {
  const classes = [
    "dept-feature",
    reverse ? "dept-feature--reverse" : "",
    landscape ? "dept-feature--landscape" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <div className="dept-feature__photo">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={80}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="dept-feature__body">{children}</div>
    </article>
  );
}

interface DepartmentFeatureLinkProps {
  href: string;
  children: ReactNode;
}

export function DepartmentFeatureLink({
  href,
  children,
}: DepartmentFeatureLinkProps) {
  return (
    <Link href={href} className="dept-enter">
      {children}{" "}
      <span className="arrow" aria-hidden="true">
        ⟶
      </span>
    </Link>
  );
}

interface DepartmentTrustItemProps {
  numeral: string;
  title: string;
  text: string;
}

export function DepartmentTrustItem({
  numeral,
  title,
  text,
}: DepartmentTrustItemProps) {
  return (
    <div className="dept-trust-item">
      <div className="dept-trust-numeral" aria-hidden="true">
        {numeral}
      </div>
      <h3 className="type-dept-name" style={{ margin: 0 }}>
        {title}
      </h3>
      <p className="type-body-v2" style={{ margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

interface DepartmentPullQuoteProps {
  text: string;
  attribution?: string;
  source?: string;
  dark?: boolean;
}

export function DepartmentPullQuote({
  text,
  attribution,
  source,
  dark = false,
}: DepartmentPullQuoteProps) {
  return (
    <blockquote className="dept-pullquote">
      <p className="type-pullquote dept-pullquote__text">{text}</p>
      {(attribution || source) && (
        <footer className="dept-pullquote__attribution">
          {attribution && <span>{attribution}</span>}
          {attribution && source && <span> · </span>}
          {source && (
            <cite style={{ fontStyle: "normal" }}>{source}</cite>
          )}
        </footer>
      )}
    </blockquote>
  );
}
