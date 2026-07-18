"use client";

import { useTranslations } from "next-intl";

interface BookingStepNavProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  showContinue?: boolean;
  showBack?: boolean;
}

export function BookingStepNav({
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel,
  showContinue = true,
  showBack = true,
}: BookingStepNavProps) {
  const t = useTranslations("booking.nav");

  return (
    <div className="booking-step-nav">
      {showBack && onBack ? (
        <button type="button" className="booking-step-nav__back" onClick={onBack}>
          {t("back")}
        </button>
      ) : (
        <span className="booking-step-nav__spacer" />
      )}
      {showContinue && onContinue ? (
        <button
          type="button"
          className="booking-step-nav__continue solid-action"
          onClick={onContinue}
          disabled={continueDisabled}
        >
          {continueLabel || t("continue")}
        </button>
      ) : null}
    </div>
  );
}
