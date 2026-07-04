import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Counter",
};

export default function CounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
