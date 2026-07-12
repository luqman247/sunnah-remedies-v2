/**
 * Listing Centre entry — Studio tool.
 * Route: /studio/apothecary-listing
 * Registered alongside Seller Centre; does not replace it.
 */

"use client";

import { useState } from "react";
import type { ListingView } from "./listing-types";
import { ListingDashboard } from "./ListingDashboard";
import { ListingComposer } from "./ListingComposer";

function initialViewFromLocation(): ListingView {
  if (typeof window === "undefined") return { kind: "home" };
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  if (editId) return { kind: "edit", documentId: editId };
  if (params.get("add") === "1") return { kind: "add" };
  return { kind: "home" };
}

export function ApothecaryListingCentre() {
  const [view, setView] = useState<ListingView>(() =>
    typeof window === "undefined" ? { kind: "home" } : initialViewFromLocation(),
  );

  if (view.kind === "add" || view.kind === "edit") {
    return (
      <ListingComposer
        documentId={view.kind === "edit" ? view.documentId : undefined}
        onNavigate={setView}
      />
    );
  }

  return <ListingDashboard onNavigate={setView} />;
}
