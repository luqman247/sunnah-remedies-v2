import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

/* ——————————————————————————————————————————————————
   Editorial Atmosphere Components
   Photography, rhythm, and institutional presence
   —————————————————————————————————————————————————— */

interface CinematicHeroProps {
  src: string;
  alt: string;
  statement: string;
  qualifier?: string;
  children?: ReactNode;
}

export function CinematicHero({
  src,
  alt,
  statement,
  qualifier,
  children,
}: CinematicHeroProps) {
  return (
    <section className="cinematic-hero">
      <div className="cinematic-hero__image">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          quality={85}
        />
      </div>
      <div className="cinematic-hero__scrim" aria-hidden="true" />
      <div className="cinematic-hero__content">
        <h1 className="cinematic-hero__statement">{statement}</h1>
        {qualifier && (
          <p className="cinematic-hero__qualifier">{qualifier}</p>
        )}
        {children}
      </div>
    </section>
  );
}

interface EditorialPhotoProps {
  src: string;
  alt: string;
  aspect?: "landscape" | "portrait" | "square" | "wide";
  fullBleed?: boolean;
  caption?: string;
  priority?: boolean;
}

export function EditorialPhoto({
  src,
  alt,
  aspect = "wide",
  fullBleed = false,
  caption,
  priority = false,
}: EditorialPhotoProps) {
  const content = (
    <figure className="editorial-figure">
      <div
        className={`editorial-photo editorial-photo--${aspect} ${fullBleed ? "editorial-photo--full" : ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={fullBleed ? "100vw" : "(max-width: 1200px) 100vw, 1200px"}
          quality={80}
          priority={priority}
          style={{ position: "absolute" }}
        />
      </div>
      {caption && (
        <figcaption className="editorial-figure__caption">{caption}</figcaption>
      )}
    </figure>
  );

  return content;
}

interface PullQuoteProps {
  text: string;
  attribution?: string;
  dark?: boolean;
}

export function PullQuote({ text, attribution, dark }: PullQuoteProps) {
  return (
    <blockquote className={`pull-quote ${dark ? "pull-quote--dark" : ""}`}>
      <p className="pull-quote__text">{text}</p>
      {attribution && (
        <footer className="pull-quote__attribution">{attribution}</footer>
      )}
    </blockquote>
  );
}

interface EditorialPillarProps {
  src: string;
  alt: string;
  caption?: string;
  reverse?: boolean;
  children: ReactNode;
}

export function EditorialPillar({
  src,
  alt,
  caption,
  reverse = false,
  children,
}: EditorialPillarProps) {
  return (
    <article
      className={`editorial-pillar ${reverse ? "editorial-pillar--reverse" : ""}`}
    >
      <figure className="editorial-figure">
        <div className="editorial-pillar__photo">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
            style={{ position: "absolute" }}
          />
        </div>
        {caption && (
          <figcaption className="editorial-figure__caption">{caption}</figcaption>
        )}
      </figure>
      <div className="editorial-pillar__body">{children}</div>
    </article>
  );
}

interface EditorialStatementProps {
  children: ReactNode;
  variant?: "default" | "grave" | "inset";
}

export function EditorialStatement({
  children,
  variant = "default",
}: EditorialStatementProps) {
  const bg =
    variant === "grave"
      ? "leaf--grave"
      : variant === "inset"
        ? "leaf--inset"
        : "";

  return (
    <section className={`editorial-statement ${bg}`}>
      <p className="editorial-statement__text">{children}</p>
    </section>
  );
}

interface EditorialFeatureProps {
  src: string;
  alt: string;
  reverse?: boolean;
  children: ReactNode;
}

export function EditorialFeature({
  src,
  alt,
  reverse = false,
  children,
}: EditorialFeatureProps) {
  return (
    <article
      className={`editorial-feature ${reverse ? "editorial-feature--reverse" : ""}`}
    >
      <div className="editorial-feature__photo">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          quality={80}
          style={{ position: "absolute" }}
        />
      </div>
      <div className="editorial-feature__body">{children}</div>
    </article>
  );
}

interface TrustGridItemProps {
  numeral: string;
  title: string;
  text: string;
}

export function TrustGridItem({ numeral, title, text }: TrustGridItemProps) {
  return (
    <div className="trust-grid__item">
      <div className="trust-grid__numeral" aria-hidden="true">
        {numeral}
      </div>
      <h3 className="type-title trust-grid__title">{title}</h3>
      <p className="type-body trust-grid__text">{text}</p>
    </div>
  );
}

export function InstitutionalDivider({ mark = "·" }: { mark?: string }) {
  return (
    <div className="inst-divider" aria-hidden="true">
      <div className="inst-divider__rule" />
      <span className="inst-divider__mark">{mark}</span>
      <div className="inst-divider__rule" />
    </div>
  );
}

export function SectionNumeral({ children }: { children: ReactNode }) {
  return (
    <p className="section-numeral" aria-hidden="true">
      {children}
    </p>
  );
}

interface EditorialInvitationProps {
  title: string;
  body: string;
  actions: Array<{ href: string; label: string; primary?: boolean }>;
}

export function EditorialInvitation({
  title,
  body,
  actions,
}: EditorialInvitationProps) {
  return (
    <div className="editorial-invitation">
      <h2 className="type-display-l editorial-invitation__title">{title}</h2>
      <p className="type-body-l editorial-invitation__body">{body}</p>
      <div className="editorial-invitation__actions">
        {actions.map((a) =>
          a.primary ? (
            <Link key={a.href} href={a.href} className="solid-action">
              {a.label}
            </Link>
          ) : (
            <Link key={a.href} href={a.href} className="quiet-link">
              {a.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
