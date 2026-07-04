import { getTranslations } from "next-intl/server";

interface HospitableEmptyProps {
  heading?: string;
  message?: string;
}

export async function HospitableEmpty({
  heading,
  message,
}: HospitableEmptyProps) {
  const t = await getTranslations("hospitable");

  return (
    <div className="hospitable-empty">
      <p className="hospitable-empty__heading type-title">{heading ?? t("heading")}</p>
      <p className="hospitable-empty__message type-body">{message ?? t("message")}</p>
    </div>
  );
}
