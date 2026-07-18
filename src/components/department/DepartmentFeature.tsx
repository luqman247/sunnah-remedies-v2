import { Link, getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import Image from "next/image";
import { type ReactNode } from "react";
import NextLink from "next/link";

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
  /**
   * When provided (e.g. from an RSC department page), resolve the locale
   * prefix with getPathname so English stays unprefixed and Danish uses /dk.
   * Do not pass an already-prefixed href.
   */
  locale?: AppLocale;
}

export function DepartmentFeatureLink({
  href,
  children,
  locale,
}: DepartmentFeatureLinkProps) {
  const resolvedHref = locale ? getPathname({ href, locale }) : href;

  // next/link receives the fully resolved pathname so as-needed English
  // routes stay unprefixed and Danish routes are not double-prefixed.
  const LinkComponent = locale ? NextLink : Link;

  return (
    <LinkComponent href={resolvedHref} className="dept-enter">
      {children}{" "}
      <span className="arrow" aria-hidden="true">
        ⟶
      </span>
    </LinkComponent>
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
          {source && <cite style={{ fontStyle: "normal" }}>{source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}
