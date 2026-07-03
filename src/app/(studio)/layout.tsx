export const metadata = {
  title: "Sunnah Remedies — Editorial Studio",
  description: "Content management for Sunnah Remedies Institution",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
