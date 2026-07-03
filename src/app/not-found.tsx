import Link from "next/link";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";

export default function NotFound() {
  return (
    <Leaf>
      <div className="measure" style={{ margin: "0 auto", textAlign: "center" }}>
        <RunningHead section="Utility" folio="—" />
        <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
          This leaf is not in the institution
        </h1>
        <p className="type-body-l" style={{ marginBottom: "var(--s5)" }}>
          Return to the threshold, or search the Register.
        </p>
        <nav style={{ display: "flex", justifyContent: "center", gap: "var(--s5)", flexWrap: "wrap" }}>
          <Link href="/" className="quiet-link">
            The Threshold
          </Link>
          <Link href="/the-register" className="quiet-link">
            The Register
          </Link>
        </nav>
      </div>
    </Leaf>
  );
}
