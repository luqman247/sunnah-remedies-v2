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
        This remedy is dispensed from the cabinet and not presented as a retail
        commodity. The amount below covers preparation, packaging, and delivery,
        and is provided after the monograph so the evidence may be read first.
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
          This remedy is currently unavailable. Write to us to receive a return
          notice when stock is restored.
        </p>
      )}
      <p className="type-small dispensation-block__note">
        There is no need to decide immediately. Read the full monograph before
        requesting dispensation.
      </p>
    </section>
  );
}
