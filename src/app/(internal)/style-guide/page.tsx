import { palette, spacing, typeScale, edition, shadows, radius } from "@/config/theme";

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="type-folio text-muted mb-2">Internal reference</p>
        <h1 className="type-display-l mb-3">Design tokens</h1>
        <p className="type-body text-muted max-w-xl">
          Living style reference for Edition I. Values mirror{" "}
          <code className="font-[family-name:var(--font-utility)] text-sm">src/config/theme.ts</code>{" "}
          and <code className="font-[family-name:var(--font-utility)] text-sm">src/styles/tokens.css</code>.
        </p>
        <p className="type-micro text-muted mt-4">{edition}</p>
      </header>

      <section className="mb-16">
        <h2 className="type-title mb-6">Palette</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 list-none p-0 m-0">
          {palette.map(({ name, token, hex }) => (
            <li key={token} className="border border-rule p-3">
              <div
                className="h-14 w-full mb-2 border border-rule"
                style={{ backgroundColor: hex }}
                aria-hidden
              />
              <p className="type-micro text-muted">{name}</p>
              <p className="font-[family-name:var(--font-utility)] text-xs">{hex}</p>
              <p className="font-[family-name:var(--font-utility)] text-[10px] text-muted">
                --{token}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="type-title mb-6">Typography</h2>
        <ul className="space-y-6 list-none p-0 m-0">
          {typeScale.map(({ name, className, sample }) => (
            <li key={name} className="border-b border-rule pb-6">
              <p className="type-micro text-muted mb-2">.{className}</p>
              <p className={className}>{sample}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="type-title mb-6">Spacing</h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {Object.entries(spacing)
            .filter(([key]) => key.startsWith("s"))
            .map(([key, value]) => (
              <li key={key} className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-utility)] text-xs text-muted w-8">
                  {key}
                </span>
                <span
                  className="h-4 bg-sage-deep"
                  style={{ width: value }}
                  aria-hidden
                />
                <span className="font-[family-name:var(--font-utility)] text-xs">{value}</span>
              </li>
            ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="type-title mb-6">Radius &amp; shadow</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="border border-rule p-4">
            <dt className="type-micro text-muted mb-2">Radius</dt>
            <dd className="font-[family-name:var(--font-utility)] text-sm">{radius.base}</dd>
          </div>
          {Object.entries(shadows).map(([name, value]) => (
            <div key={name} className="border border-rule p-4">
              <dt className="type-micro text-muted mb-2">{name}</dt>
              <dd
                className="h-12 bg-paper-deep font-[family-name:var(--font-utility)] text-[10px] text-muted p-2"
                style={{ boxShadow: value }}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="type-title mb-6">Dark theme</h2>
        <p className="type-body text-muted mb-4">
          Toggle via masthead theme control on the public site, or set{" "}
          <code className="font-[family-name:var(--font-utility)] text-sm">data-theme=&quot;dark&quot;</code>{" "}
          on the document root.
        </p>
        <div data-theme="dark" className="border border-rule p-8 bg-paper">
          <p className="type-lede text-ink mb-2">Dark surface preview</p>
          <p className="type-body text-muted">Tokens resolve from [data-theme=&quot;dark&quot;] overrides.</p>
        </div>
      </section>
    </div>
  );
}
