/**
 * Apothecary Seller Centre — Studio tool entry.
 * Route: /studio/apothecary-manager
 */

"use client";

import { useEffect, useState } from "react";
import type { SellerView } from "./types";
import { SellerHome } from "./SellerHome";
import { AddProductWizard } from "./AddProductWizard";
import { QuickEdit } from "./QuickEdit";
import { loadWizardPersistence } from "./persistence";

function initialViewFromLocation(): SellerView {
  if (typeof window === "undefined") return { kind: "home" };
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  if (editId) {
    return { kind: "edit", documentId: editId };
  }
  if (params.get("add") === "1") {
    const persisted = loadWizardPersistence();
    return {
      kind: "add",
      draftId: persisted?.publishedId || undefined,
      step: persisted?.step || 1,
    };
  }
  return { kind: "home" };
}

export function ApothecarySellerCentre() {
  const [view, setView] = useState<SellerView>({ kind: "home" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setView(initialViewFromLocation());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#6b6560" }}>
        Opening Seller Centre…
      </div>
    );
  }

  if (view.kind === "add") {
    return (
      <AddProductWizard
        initialStep={view.step || 1}
        resumeDraftId={view.draftId}
        onNavigate={setView}
      />
    );
  }

  if (view.kind === "edit") {
    return (
      <QuickEdit documentId={view.documentId} onNavigate={setView} />
    );
  }

  return <SellerHome onNavigate={setView} />;
}
