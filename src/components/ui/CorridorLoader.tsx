import { getTranslations } from "next-intl/server";

export async function CorridorLoader() {
  const t = await getTranslations("common");

  return (
    <div className="corridor-loader" role="status" aria-label={t("loading")}>
      <div className="corridor-loader__inner">
        <span className="corridor-loader__mark" aria-hidden="true">·</span>
      </div>
    </div>
  );
}
