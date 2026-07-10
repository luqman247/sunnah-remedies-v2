/**
 * Media library document actions — where-used inspection and deletion protection.
 */

"use client";

import { useCallback, useState } from "react";
import {
  useClient,
  type DocumentActionComponent,
} from "sanity";

type RefHit = {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
};

const MEDIA_TYPES = new Set(["mediaAsset", "videoAsset", "audioAsset"]);

function displayName(doc: RefHit): string {
  return doc.title || doc.name || doc._id;
}

export const ShowWhereUsedAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refs, setRefs] = useState<RefHit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await client.fetch<RefHit[]>(
        `*[references($id)]{_id, _type, title, name} | order(_type asc) [0...50]`,
        { id: props.id },
      );
      setRefs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load references");
    } finally {
      setLoading(false);
    }
  }, [client, props.id]);

  if (!MEDIA_TYPES.has(props.type)) return null;

  return {
    label: "Where used",
    title: "Show documents that reference this asset",
    onHandle: () => {
      setDialogOpen(true);
      void load();
    },
    dialog: dialogOpen
      ? {
          type: "dialog",
          onClose: () => {
            setDialogOpen(false);
            props.onComplete();
          },
          header: "Where this asset is used",
          content: (
            <div style={{ padding: "1rem", maxWidth: "28rem" }}>
              {loading ? <p>Searching references…</p> : null}
              {error ? <p style={{ color: "#8b1e1e" }}>{error}</p> : null}
              {!loading && !error && refs.length === 0 ? (
                <p>No documents currently reference this asset.</p>
              ) : null}
              {!loading && refs.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.6 }}>
                  {refs.map((ref) => (
                    <li key={ref._id}>
                      <strong>{ref._type}</strong> — {displayName(ref)}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#6b6560" }}>
                Deletion is blocked while references exist. Replace the reference
                on each document first, or use Replace asset workflow.
              </p>
            </div>
          ),
        }
      : undefined,
  };
};

export const ProtectedMediaDeleteAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [checking, setChecking] = useState(false);

  // Replace built-in delete — registered by filtering delete out and adding this
  if (!MEDIA_TYPES.has(props.type)) return null;

  return {
    label: "Delete…",
    tone: "critical",
    disabled: checking,
    title: "Delete only when nothing references this asset",
    onHandle: async () => {
      setChecking(true);
      try {
        const count = await client.fetch<number>(
          `count(*[references($id)])`,
          { id: props.id },
        );
        if (count > 0) {
          window.alert(
            `Cannot delete: ${count} document(s) still reference this asset. Use “Where used”, then remove or replace those references first.`,
          );
          props.onComplete();
          return;
        }
        const confirmed = window.confirm(
          "This asset is not referenced. Delete permanently? Prefer archiving photography briefs when possible.",
        );
        if (!confirmed) {
          props.onComplete();
          return;
        }
        await client.delete(props.id);
        props.onComplete();
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "Delete failed",
        );
        props.onComplete();
      } finally {
        setChecking(false);
      }
    },
  };
};

/** Find likely duplicates by content hash (when set). */
export const FindDuplicatesAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<RefHit[]>([]);

  if (props.type !== "mediaAsset" && props.type !== "videoAsset") return null;

  const doc = (props.draft || props.published) as { contentHash?: string } | null;
  const hash = doc?.contentHash;

  return {
    label: "Find duplicates",
    disabled: !hash,
    title: hash
      ? "Find other assets with the same content hash"
      : "Set a content hash on this asset first",
    onHandle: () => {
      setDialogOpen(true);
      setLoading(true);
      void client
        .fetch<RefHit[]>(
          `*[_type == $type && contentHash == $hash && _id != $id]{_id, _type, title, name}`,
          { type: props.type, hash, id: props.id },
        )
        .then(setHits)
        .finally(() => setLoading(false));
    },
    dialog: dialogOpen
      ? {
          type: "dialog",
          onClose: () => {
            setDialogOpen(false);
            props.onComplete();
          },
          header: "Possible duplicates",
          content: (
            <div style={{ padding: "1rem" }}>
              {loading ? <p>Searching…</p> : null}
              {!loading && hits.length === 0 ? (
                <p>No other assets share this content hash.</p>
              ) : null}
              {!loading && hits.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                  {hits.map((hit) => (
                    <li key={hit._id}>{displayName(hit)}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ),
        }
      : undefined,
  };
};

export function resolveMediaActions(
  prev: DocumentActionComponent[],
  schemaType: string,
): DocumentActionComponent[] {
  if (!MEDIA_TYPES.has(schemaType)) return prev;
  const withoutDelete = prev.filter((action) => action.action !== "delete");
  return [
    ...withoutDelete,
    ShowWhereUsedAction,
    FindDuplicatesAction,
    ProtectedMediaDeleteAction,
  ];
}
