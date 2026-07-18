"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

interface LatestAdditionsRailProps {
  itemCount: number;
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
}

/**
 * Horizontally scrollable editorial rail with optional previous/next controls.
 * No autoplay. Native overflow scrolling remains available for touch, trackpad,
 * and keyboard when the list is focused.
 */
export function LatestAdditionsRail({
  itemCount,
  previousLabel,
  nextLabel,
  children,
}: LatestAdditionsRailProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const labelId = useId();

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const epsilon = 4;
    setCanScrollPrev(el.scrollLeft > epsilon);
    setCanScrollNext(el.scrollLeft < maxScroll - epsilon);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, itemCount]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-highlight-card]");
    const amount = card
      ? card.getBoundingClientRect().width + 24
      : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      listRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      const el = listRef.current;
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  };

  const showControls = itemCount > 1 && (canScrollPrev || canScrollNext);

  return (
    <div className="latest-additions__rail-shell" data-item-count={itemCount}>
      {showControls ? (
        <div className="latest-additions__controls">
          <button
            type="button"
            className="latest-additions__control"
            aria-controls={labelId}
            aria-label={previousLabel}
            disabled={!canScrollPrev}
            onClick={() => scrollByCard(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="latest-additions__control"
            aria-controls={labelId}
            aria-label={nextLabel}
            disabled={!canScrollNext}
            onClick={() => scrollByCard(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      <ul
        id={labelId}
        ref={listRef}
        className="latest-additions__rail"
        tabIndex={itemCount > 1 ? 0 : undefined}
        onKeyDown={itemCount > 1 ? onKeyDown : undefined}
        data-autoplay="false"
      >
        {children}
      </ul>
    </div>
  );
}
