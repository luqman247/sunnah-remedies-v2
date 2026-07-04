/**
 * IsnadRule — the signature element (Ch. 8).
 *
 * A 1px brass horizontal line with a node mark. Three placements only:
 * arrival (between Arabic and English hero), divider (between departments),
 * footer (above institution statement). Never more than these three on the page.
 */

interface IsnadRuleProps {
  variant: "arrival" | "divider" | "footer";
  nodePosition?: number;
  animated?: boolean;
}

export function IsnadRule({
  variant,
  nodePosition = 0.5,
  animated = false,
}: IsnadRuleProps) {
  const animClass = animated ? "choreo-rule" : "";
  const nodeAnimClass = animated ? "choreo-rule-node" : "";

  return (
    <div
      className={`isnad-rule isnad-rule--${variant} ${animClass}`}
      role="separator"
      aria-hidden="true"
      style={{
        position: "relative",
        inlineSize: "100%",
        blockSize: "1px",
        background: "var(--brass)",
        marginBlock: variant === "arrival" ? "var(--space-6)" : "var(--space-8)",
      }}
    >
      <span
        className={nodeAnimClass}
        style={{
          position: "absolute",
          insetInlineStart: `${nodePosition * 100}%`,
          insetBlockStart: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          inlineSize: "5px",
          blockSize: "5px",
          background: "var(--brass)",
        }}
      />
    </div>
  );
}
