"use client";

import { motion } from "framer-motion";

const badges = [
  "Qualified Practitioners",
  "Separate Male & Female Clinics",
  "Sunnah-Based Care",
];

export function BookingHero() {
  return (
    <section className="booking-hero">
      <motion.h1
        className="booking-hero__title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Book Your Hijama Session
      </motion.h1>

      <motion.p
        className="booking-hero__subtitle"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        Experience Prophetic medicine in a calm, professional environment.
        Choose your practitioner, preferred clinic and appointment time.
      </motion.p>

      <motion.div
        className="booking-hero__badges"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {badges.map((badge) => (
          <span key={badge} className="booking-hero__badge">
            <span className="booking-hero__badge-check">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6.5L5 9.5L10 3" />
              </svg>
            </span>
            {badge}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
