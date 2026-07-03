import Link from "next/link";
import type { Remedy } from "@/lib/content/types";
import { formatPrice } from "@/lib/content/remedies";
import { AddToCounter } from "./AddToCounter";

interface DispensationBlockProps {
  remedy: Remedy;
}

export function DispensationBlock({ remedy }: DispensationBlockProps) {
  return (
    <section id="dispensation" className="dispensation-block" aria-labelledby="dispensation-heading">
      <h2 id="dispensation-heading" className="monograph-section__title">
        Dispensation
      </h2>
      <p className="type-body dispensation-block__intro">
        This remedy is dispensed from the cabinet — not sold as a commodity. The
        measure below covers preparation and delivery; it is stated after the
        monograph so that you may read first and decide in time.
      </p>
      <dl className="dispensation-block__details">
        <div>
          <dt className="type-micro dispensation-block__dt">Measure</dt>
          <dd className="type-body dispensation-block__dd">{remedy.volume}</dd>
        </div>
        <div>
          <dt className="type-micro dispensation-block__dt">Fee</dt>
          <dd className="type-title dispensation-block__dd">{formatPrice(remedy.price)}</dd>
        </div>
        <div>
          <dt className="type-micro dispensation-block__dt">Delivery</dt>
          <dd className="type-body dispensation-block__dd">{remedy.priceNote}</dd>
        </div>
      </dl>
      {remedy.inStock ? (
        <AddToCounter slug={remedy.slug} name={remedy.name} />
      ) : (
        <p className="type-body">
          This remedy is not in stock at present.{" "}
          <Link href="/correspondence" className="quiet-link">
            Write to us
          </Link>{" "}
          to be told when it returns.
        </p>
      )}
      <p className="type-small dispensation-block__note">
        There is no need to decide today. Read the monograph; the cabinet keeps.
      </p>
    </section>
  );
}
