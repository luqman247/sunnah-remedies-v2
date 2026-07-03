interface BotanicalFigureProps {
  variant: "black-seed" | "honey" | "senna" | "olive";
  alt: string;
}

export function BotanicalFigure({ variant, alt }: BotanicalFigureProps) {
  return (
    <figure className="botanical-figure">
      <svg viewBox="0 0 280 360" role="img" aria-label={alt}>
        <title>{alt}</title>
        {variant === "black-seed" && <BlackSeedStudy />}
        {variant === "honey" && <HoneyStudy />}
        {variant === "senna" && <SennaStudy />}
        {variant === "olive" && <OliveStudy />}
      </svg>
    </figure>
  );
}

function BlackSeedStudy() {
  return (
    <>
      <ellipse cx="140" cy="190" rx="62" ry="16" fill="none" stroke="#96763f" strokeWidth="1.4" />
      {[
        [118, 186], [132, 182], [148, 188], [162, 184], [128, 194], [142, 192], [156, 196],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="3.5" ry="5.5" fill="none" stroke="#96763f" strokeWidth="1.4" transform={`rotate(${i * 28} ${cx} ${cy})`} />
      ))}
      <path d="M140 118 Q122 152 140 190 Q158 152 140 118" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <line x1="140" y1="118" x2="140" y2="92" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function HoneyStudy() {
  return (
    <>
      <path d="M98 260 L98 138 Q98 108 140 108 Q182 108 182 138 L182 260" fill="none" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="88" y1="260" x2="192" y2="260" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="140" y1="260" x2="140" y2="286" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M118 140 Q140 124 162 140" fill="none" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function SennaStudy() {
  return (
    <>
      <path d="M140 280 Q108 230 118 168 Q128 112 140 98 Q152 112 162 168 Q172 230 140 280" fill="none" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="140" y1="98" x2="140" y2="74" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      {[128, 140, 152].map((x, i) => (
        <ellipse key={i} cx={x} cy={188 + i * 18} rx="10" ry="4.5" fill="none" stroke="#96763f" strokeWidth="1.4" />
      ))}
    </>
  );
}

function OliveStudy() {
  return (
    <>
      <path d="M98 260 L98 148 Q98 118 140 118 Q182 118 182 148 L182 260" fill="none" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="88" y1="260" x2="192" y2="260" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M122 98 Q140 78 158 98" fill="none" stroke="#96763f" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="128" cy="96" rx="7" ry="3.5" fill="none" stroke="#96763f" strokeWidth="1.4" />
      <ellipse cx="152" cy="96" rx="7" ry="3.5" fill="none" stroke="#96763f" strokeWidth="1.4" />
    </>
  );
}
