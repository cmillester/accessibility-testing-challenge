import React, { useEffect, useRef, useState } from "react";
import { BUG_SCENARIOS } from "../../../data/bugScenarios";
import { SPOT_THE_BUG_ABOUT_TEXT } from "../../../data/challengeModes";
import { BugScenarioCard } from "./BugScenarioCard";
import { useChallengeState } from "../../../context/ChallengeStateContext";
import { InfoButton } from "../../common/InfoButton";
import { ConfirmExitDialog } from "../../common/ConfirmExitDialog";
import { CarryThisLensForwardCard } from "../../common/CarryThisLensForwardCard";

const SCENARIOS_PER_RUN = 8;
const TICK_MS = 100;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SpotTheBugFlowProps {
  onlyMissed?: boolean;
  onExit: () => void;
  onPlayChallenge: () => void;
  onReplayMissed: () => void;
}

export function SpotTheBugFlow({
  onlyMissed = false,
  onExit,
  onPlayChallenge,
  onReplayMissed,
}: SpotTheBugFlowProps) {
  const { challenge, recordBugOutcome, recordScenarioExplored, recordBugRunComplete } =
    useChallengeState();
  const [order] = useState(() => {
    if (onlyMissed) {
      const missed = BUG_SCENARIOS.filter(
        (s) =>
          challenge.scenariosExploredIds.includes(s.id) &&
          !challenge.scenariosIdentifiedIds.includes(s.id)
      );
      return shuffle(missed.length > 0 ? missed : BUG_SCENARIOS).slice(0, SCENARIOS_PER_RUN);
    }
    // Eight game scenarios, randomly selected and shuffled from the pool
    // of twelve — matching the original.
    return shuffle(BUG_SCENARIOS).slice(0, SCENARIOS_PER_RUN);
  });
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(() =>
    typeof document !== "undefined" ? document.hidden : false
  );
  const [done, setDone] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const totalActiveMsRef = useRef(0);
  const exitTriggerRef = useRef<HTMLButtonElement | null>(null);

  const scenario = order[index];
  const isLast = index >= order.length - 1;

  // Active-investigation timing only: ticks while a scenario is on screen,
  // waiting for an answer, with the tab visible and nothing paused. Frozen
  // the instant an answer is chosen, while feedback and "why it matters"
  // are visible, and whenever the player pauses, opens the exit dialog,
  // or switches to another browser tab.
  const timingActive = !answered && !paused && !tabHidden && !done && !showExitConfirm;

  useEffect(() => {
    if (!timingActive) return;
    const id = window.setInterval(() => {
      setElapsedMs((t) => t + TICK_MS);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [timingActive]);

  useEffect(() => {
    function handleVisibility() {
      setTabHidden(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!scenario || done) return;
    recordScenarioExplored(scenario.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  function handleAnswered(correct: boolean) {
    recordBugOutcome({ scenarioId: scenario.id, correct });
    if (correct) setSessionCorrect((n) => n + 1);
    // Bank this scenario's active time now — the timer visibly freezes at
    // this value while feedback is shown, and doesn't resume until Next.
    totalActiveMsRef.current += elapsedMs;
    setAnswered(true);
  }

  function advance() {
    if (isLast) {
      setDone(true);
      if (order.length === SCENARIOS_PER_RUN) {
        recordBugRunComplete({
          correctCount: sessionCorrect,
          totalCount: order.length,
          timeMs: Math.round(totalActiveMsRef.current),
        });
      }
    } else {
      setIndex((i) => i + 1);
    }
    setElapsedMs(0);
    setAnswered(false);
  }

  function goNext() {
    advance();
  }

  function handleSkip() {
    // Skipping banks whatever investigation time had already accrued, but
    // adds none of the (nonexistent, since there's no feedback shown)
    // reading time — it moves straight to the next scenario.
    totalActiveMsRef.current += elapsedMs;
    advance();
  }

  function requestExit(event: React.MouseEvent<HTMLButtonElement>) {
    exitTriggerRef.current = event.currentTarget;
    setShowExitConfirm(true);
  }

  function confirmExit() {
    setShowExitConfirm(false);
    onExit();
  }

  function cancelExit() {
    setShowExitConfirm(false);
    // Timing (and the flashing scenario, if one is showing) resumes on its
    // own once showExitConfirm is false again — nothing else was paused
    // just by opening this dialog.
    exitTriggerRef.current?.focus();
  }

  if (!scenario || done) {
    const missedCount = BUG_SCENARIOS.filter(
      (s) =>
        challenge.scenariosExploredIds.includes(s.id) &&
        !challenge.scenariosIdentifiedIds.includes(s.id)
    ).length;

    return (
      <div className="stack">
        <div>
          <button type="button" className="btn-tertiary" onClick={onExit}>
            ← Back to Home
          </button>
        </div>
        <div className="card stack-sm">
          <h1 style={{ margin: 0, fontSize: "1.3rem" }}>Spot the Bug</h1>
          <p style={{ margin: 0 }}>
            {sessionCorrect} of {order.length} identified this run ·{" "}
            {(totalActiveMsRef.current / 1000).toFixed(1)}s active investigation time.
          </p>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
            Time includes active investigation only. Reading and feedback time are excluded.
          </p>
          <div className="btn-row">
            {missedCount > 0 && (
              <button type="button" className="btn btn-secondary" onClick={onReplayMissed}>
                Replay missed scenarios
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onPlayChallenge}>
              Play the Accessibility Challenge
            </button>
            <button type="button" className="btn btn-primary" onClick={onExit}>
              Done for now
            </button>
          </div>
        </div>

        <CarryThisLensForwardCard />
      </div>
    );
  }

  return (
    <div className="stack">
      {showExitConfirm && <ConfirmExitDialog onExitRound={confirmExit} onKeepPlaying={cancelExit} />}

      <div className="btn-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
          <h1 style={{ margin: 0, fontSize: "1.15rem" }}>Spot the Bug</h1>
          <InfoButton label="Spot the Bug" text={SPOT_THE_BUG_ABOUT_TEXT} />
        </div>
        <span className="text-muted" style={{ fontSize: "0.85rem" }}>
          {index + 1} of {order.length}
        </span>
      </div>

      {/* Not role="status": this redraws every 100ms while timing is active,
          and a live region that busy would announce constantly. Only the
          deliberate, discrete events (round start, correct/incorrect, etc.)
          go through the shared LiveRegion above. */}
      <div
        className="card--sunken card"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          justifyContent: "space-between",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700 }}>{(elapsedMs / 1000).toFixed(1)}s</div>
          <div className="text-muted" style={{ fontSize: "0.72rem" }}>
            Active time {answered ? "(frozen)" : ""}
          </div>
        </div>
      </div>

      <BugScenarioCard
        key={scenario.id}
        scenario={scenario}
        paused={paused || showExitConfirm}
        onAnswered={handleAnswered}
        onNext={goNext}
        onSkip={handleSkip}
      />

      <div className="btn-row">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPaused((p) => !p)}
          disabled={answered}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={requestExit}>
          Exit game
        </button>
      </div>
    </div>
  );
}
