/**
 * Apothecary Seller Centre — Studio tool entry.
 * Route: /studio/apothecary-manager
 */

"use client";

import { useState } from "react";
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
  const [view, setView] = useState<SellerView>(() =>
    typeof window === "undefined" ? { kind: "home" } : initialViewFromLocation(),
  );

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
