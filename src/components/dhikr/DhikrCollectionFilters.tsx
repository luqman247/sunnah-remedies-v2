import "./dhikr-collection.css";

/** A translator function bound to the caller's own message namespace — kept loose so this component works with either dhikrMorning or dhikrEvening. */
export type DhikrCollectionTranslator = (key: string, values?: Record<string, string | number>) => string;

export interface DhikrCollectionFilterDef<FilterKey extends string> {
  key: FilterKey;
  labelKey: string;
}

/**
 * Shared filter-button bar used by both Morning and Evening collections.
 * Purely a controlled presentational component — filtering logic and state
 * live in the caller. Every button has aria-pressed reflecting the active
 * filter and a visible focus ring (see .dhikr-filter-button:focus-visible
 * in dhikr-collection.css).
 */
export function DhikrCollectionFilters<FilterKey extends string>({
  filters,
  activeFilter,
  onChange,
  t,
  ariaLabel,
}: {
  filters: readonly DhikrCollectionFilterDef<FilterKey>[];
  activeFilter: FilterKey;
  onChange: (key: FilterKey) => void;
  t: DhikrCollectionTranslator;
  ariaLabel: string;
}) {
  return (
    <div className="dhikr-filterbar" role="group" aria-label={ariaLabel}>
      {filters.map(({ key, labelKey }) => (
        <button
          key={key}
          type="button"
          className="dhikr-filter-button"
          aria-pressed={activeFilter === key}
          onClick={() => onChange(key)}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
