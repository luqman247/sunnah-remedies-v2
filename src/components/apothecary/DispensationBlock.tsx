import { getTranslations } from "next-intl/server";
import type { Remedy } from "@/lib/content/types";
import { formatPrice } from "@/lib/content/remedies";
import { AddToCounter } from "./AddToCounter";

interface DispensationBlockProps {
  remedy: Remedy;
}

export async function DispensationBlock({ remedy }: DispensationBlockProps) {
  const t = await getTranslations("apothecary.dispensation");

  return (
    <section id="dispensation" className="dispensation-block" aria-labelledby="dispensation-heading">
      <h2 id="dispensation-heading" className="monograph-section__title">
        {t("title")}
      </h2>
      <p className="type-body dispensation-block__intro">
        {t("intro")}
      </p>
      <dl className="dispensation-block__details">
        <div>
          <dt className="type-micro dispensation-block__dt">{t("measure")}</dt>
          <dd className="type-body dispensation-block__dd">{remedy.volume}</dd>
        </div>
        <div>
          <dt className="type-micro dispensation-block__dt">{t("fee")}</dt>
          <dd className="type-title dispensation-block__dd">{formatPrice(remedy.price)}</dd>
        </div>
        <div>
          <dt className="type-micro dispensation-block__dt">{t("delivery")}</dt>
          <dd className="type-body dispensation-block__dd">{remedy.priceNote}</dd>
        </div>
      </dl>
      {remedy.inStock ? (
        <AddToCounter slug={remedy.slug} name={remedy.name} />
      ) : (
        <p className="type-body">
          {t("unavailable")}
        </p>
      )}
      <p className="type-small dispensation-block__note">
        {t("note")}
      </p>
    </section>
  );
}
