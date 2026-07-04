"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SolidAction } from "@/components/ui/Links";

interface BookingSuccessProps {
  referenceId?: string;
  onBookAnother: () => void;
}

export function BookingSuccess({ referenceId, onBookAnother }: BookingSuccessProps) {
  const t = useTranslations("booking.success");

  return (
    <motion.section
      className="booking-success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="booking-success__icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </motion.div>

      <motion.h1
        className="booking-success__title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {t("title")}
      </motion.h1>

      <motion.p
        className="booking-success__message"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        {t("message")}
      </motion.p>

      {referenceId && (
        <motion.p
          className="booking-success__reference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          {t("reference", { id: referenceId })}
        </motion.p>
      )}

      <motion.div
        className="booking-success__actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <SolidAction href="/">{t("returnHome")}</SolidAction>
        <SolidAction onClick={onBookAnother}>{t("bookAnother")}</SolidAction>
      </motion.div>
    </motion.section>
  );
}
