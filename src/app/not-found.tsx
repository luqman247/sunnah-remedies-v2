import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { QuietLink } from "@/components/ui/Links";

export default function NotFound() {
  return (
    <Leaf>
      <div className="measure grave-block">
        <PageIntro
          section="Utility"
          folio="—"
          title="No record at this address"
        />
        <p className="type-body-l" style={{ marginBottom: "var(--s5)" }}>
          The path does not correspond to a page in the institution. Return to
          the Threshold, or consult the Register.
        </p>
        <nav style={{ display: "flex", justifyContent: "center", gap: "var(--s5)", flexWrap: "wrap" }}>
          <QuietLink href="/">The Threshold</QuietLink>
          <QuietLink href="/the-register">The Register</QuietLink>
        </nav>
      </div>
    </Leaf>
  );
}
