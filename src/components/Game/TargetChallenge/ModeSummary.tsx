import React, { useEffect, useRef } from "react";
import { ChallengeModeMeta, ModeResult, RoundCompletionDetail } from "../../../types";
import { useAppState } from "../../../context/AppStateContext";
import { CarryThisLensForwardCard } from "../../common/CarryThisLensForwardCard";

interface ModeSummaryProps {
  mode: ChallengeModeMeta;
  result: RoundCompletionDetail;
  standardResult: ModeResult | undefined;
  onPlayAgain: () => void;
  onTryAnotherMode: () => void;
  onPlaySpotTheBug: () => void;
  onReturnToOverview: () => void;
}

export function ModeSummary({
  mode,
  result,
  standardResult,
  onPlayAgain,
  onTryAnotherMode,
  onPlaySpotTheBug,
  onReturnToOverview,
}: ModeSummaryProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { progress } = useAppState();

  // This replaces the active game area in place, so it's already where the
  // player was just looking — but focus and scroll are still confirmed
  // explicitly so it's never possible to miss, e.g. after a page had
  // scrolled during a longer round.
  useEffect(() => {
    const node = headingRef.current;
    if (!node) return;
    node.focus();
    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!alreadyInView) {
      const prefersReducedMotion =
        progress.reducedMotionOverride ||
        (typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      node.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Matches the original's completion message: time and misses, plus — for
  // any non-Standard mode, once Standard has been played at least once — a
  // comparison against the visitor's own Standard time.
  let comparisonLine: string | null = null;
  if (mode.id !== "standard" && standardResult?.bestTimeMs) {
    const multiplier = result.timeMs / standardResult.bestTimeMs;
    comparisonLine = `${multiplier.toFixed(1)}x your standard time.`;
  }

  return (
    <div className="stack">
      <div className="card stack-sm" style={{ borderColor: "var(--color-success)" }}>
        <h2 ref={headingRef} tabIndex={-1} style={{ margin: 0, fontSize: "1.2rem", outline: "none" }}>
          What this showed you
        </h2>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>{mode.title}</p>

        <dl className="summary-list">
          <div>
            <dt>Your result</dt>
            <dd>
              {(result.timeMs / 1000).toFixed(1)}s, {result.misclicks} miss{result.misclicks === 1 ? "" : "es"}
            </dd>
          </div>
          {comparisonLine && (
            <div>
              <dt>Compared with Standard</dt>
              <dd>{comparisonLine}</dd>
            </div>
          )}
          <div>
            <dt>Why this barrier matters</dt>
            <dd>{mode.explanation}</dd>
          </div>
          <div>
            <dt>Practical fix</dt>
            <dd>{mode.recommendation}</dd>
          </div>
        </dl>
      </div>

      <CarryThisLensForwardCard />

      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn btn-secondary" onClick={onTryAnotherMode}>
          Try another mode
        </button>
        <button type="button" className="btn btn-secondary" onClick={onPlaySpotTheBug}>
          Play Spot the Bug
        </button>
        <button type="button" className="btn btn-primary" onClick={onReturnToOverview}>
          Exit to game menu
        </button>
      </div>
    </div>
  );
}
