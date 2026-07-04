import Link from "next/link";

interface WayForwardItem {
  label: string;
  href: string;
  description?: string;
}

interface WayForwardProps {
  back?: WayForwardItem;
  forward?: WayForwardItem[];
}

/**
 * WayForward — the arcade's promise: always show the way back and the way onward.
 * Placed at the bottom of content sections to ensure the visitor is never abandoned.
 */
export function WayForward({ back, forward }: WayForwardProps) {
  if (!back && (!forward || forward.length === 0)) return null;

  return (
    <nav className="way-forward" aria-label="Continue reading">
      {back && (
        <div className="way-forward__back">
          <Link href={back.href} className="way-forward__link way-forward__link--back">
            <span className="way-forward__arrow" aria-hidden="true">←</span>
            <span className="way-forward__text">
              <span className="way-forward__direction type-eyebrow">Return to</span>
              <span className="way-forward__label type-title">{back.label}</span>
            </span>
          </Link>
        </div>
      )}

      {forward && forward.length > 0 && (
        <div className="way-forward__onward">
          {forward.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="way-forward__link way-forward__link--forward"
            >
              <span className="way-forward__text">
                <span className="way-forward__direction type-eyebrow">Continue to</span>
                <span className="way-forward__label type-title">{item.label}</span>
                {item.description && (
                  <span className="way-forward__desc type-small">{item.description}</span>
                )}
              </span>
              <span className="way-forward__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
