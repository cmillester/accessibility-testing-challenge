import React, { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value: string;
}

interface RoundStatusBarProps {
  /** Same stat shown first in the full inline row on wider screens — e.g.
   * {label: "Round", value: "3/8"} — unchanged from how this was always
   * presented. */
  stageStat: StatItem;
  /** A prominent headline used only in the compact mobile view — e.g.
   * "Round 3 of 8" or "Scenario 3 of 8". Always visible, never collapsed. */
  stageLabel: string;
  /** The one stat that stays visible on narrow screens even when others collapse. */
  primary: StatItem;
  /** Anything beyond the primary stat — shown inline on wider screens, and
   * tucked into a "Round details" disclosure on narrow screens so this bar
   * never grows tall enough to crowd the game controls below it. All
   * values here are exactly what the caller already computed — this
   * component only changes how they're presented, never what they say. */
  secondary?: StatItem[];
  detailsLabel?: string;
}

const NARROW_QUERY = "(max-width: 480px)";

function useIsNarrowViewport(): boolean {
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(NARROW_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(NARROW_QUERY);
    function handleChange() {
      setIsNarrow(mql.matches);
    }
    handleChange();
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, []);

  return isNarrow;
}

/**
 * A presentation-only status bar shared by both games. It never computes or
 * stores any value itself — callers pass in already-derived strings, so
 * scoring/timer logic stays exactly where it was.
 *
 * Renders one of two markups (never both at once, so nothing is ever
 * duplicated in the DOM or announced twice to assistive tech): the original
 * always-visible stat row on wider screens, or a compact stage + one
 * primary value with a "Round details" disclosure for anything else on
 * narrow screens, where the goal is to keep this bar short enough that it
 * never crowds the game controls below it.
 */
export function RoundStatusBar({
  stageStat,
  stageLabel,
  primary,
  secondary = [],
  detailsLabel = "Round details",
}: RoundStatusBarProps) {
  const isNarrow = useIsNarrowViewport();

  if (!isNarrow) {
    return (
      <div className="round-status__full card--sunken card">
        <Stat label={stageStat.label} value={stageStat.value} />
        <Stat label={primary.label} value={primary.value} />
        {secondary.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    );
  }

  return (
    <div className="round-status__compact card--sunken card">
      <div className="round-status__compact-row">
        <span className="round-status__stage">{stageLabel}</span>
        <span className="round-status__primary">
          <strong>{primary.value}</strong>{" "}
          <span className="text-muted" style={{ fontSize: "0.72rem" }}>
            {primary.label}
          </span>
        </span>
      </div>
      {secondary.length > 0 && (
        <details className="round-status__details">
          <summary>{detailsLabel}</summary>
          <div className="round-status__details-grid">
            {secondary.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function Stat({ label, value }: StatItem) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 700 }}>{value}</div>
      <div className="text-muted" style={{ fontSize: "0.72rem" }}>
        {label}
      </div>
    </div>
  );
}
