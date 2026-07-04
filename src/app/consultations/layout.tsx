import type { Metadata } from "next";
import "@/components/booking/booking.css";

export const metadata: Metadata = {
  title: "Book a Hijama Session",
  description:
    "Book your Hijama (wet cupping) appointment with a qualified practitioner at one of our clinics in London, Aarhus or Riyadh.",
};

export default function ConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
