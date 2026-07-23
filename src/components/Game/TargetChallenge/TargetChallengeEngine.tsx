import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChallengeModeMeta, RoundCompletionDetail } from "../../../types";
import { LiveRegion } from "../../common/LiveRegion";
import { useAnnouncer } from "../../../hooks/useAnnouncer";
import { InfoButton } from "../../common/InfoButton";
import { ConfirmExitDialog } from "../../common/ConfirmExitDialog";

// Ported, with behavioral parity, from the original accessibility_challenge.html
// prototype: one real target (plus decoys only in Color Vision mode) placed
// inside a fixed-size arena, eight in a row. Each mode's difficulty comes
// from a fixed set of visual/interaction parameters — no invented themes,
// no progression curve, no practice round. Pause/Restart/Choose-another-mode
// are the only additions beyond the original.

const TOTAL_TARGETS = 8;
const ARENA_HEIGHT = 260;

interface ModeMechanics {
  arenaFilter: string;
  targetSize: number;
  targetColor: string;
  lowContrast?: boolean;
  decoyCount?: number;
  decoyColor?: string;
  jitter?: boolean;
  jitterMs?: number;
  jitterAmount?: number;
  isSwitch?: boolean;
}

// These exact values (blur/contrast/brightness, sizes, colors, jitter
// timing) are what makes each mode genuinely harder than Standard — ported
// directly from the original prototype rather than re-invented.
const MODE_MECHANICS: Record<string, ModeMechanics> = {
  standard: { arenaFilter: "none", targetSize: 44, targetColor: "#2a5db0" },
  "reduced-clarity": {
    arenaFilter: "blur(7px) contrast(0.45) brightness(1.1)",
    targetSize: 30,
    targetColor: "#e4e2d8",
    lowContrast: true,
  },
  "color-dependent": {
    arenaFilter: "url(#atl-protanopia)",
    targetSize: 34,
    targetColor: "#c0392b",
    decoyCount: 5,
    decoyColor: "#7a8a3a",
  },
  "pointer-stability": {
    arenaFilter: "none",
    targetSize: 34,
    targetColor: "#2a5db0",
    jitter: true,
    jitterMs: 110,
    jitterAmount: 22,
  },
  "switch-navigation": { arenaFilter: "none", targetSize: 0, targetColor: "", isSwitch: true },
};

interface Point {
  x: number;
  y: number;
}

interface SwitchBox {
  id: number;
  isSelect: boolean;
}

function randomPoint(width: number, height: number, size: number): Point {
  const w = Math.max(width, size + 20);
  const h = Math.max(height, size + 20);
  return {
    x: 10 + Math.random() * (w - size - 20),
    y: 10 + Math.random() * (h - size - 20),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildSwitchBoxes(): SwitchBox[] {
  const selectIndex = Math.floor(Math.random() * 5);
  return Array.from({ length: 5 }, (_, i) => ({ id: i, isSelect: i === selectIndex }));
}

interface TargetChallengeEngineProps {
  mode: ChallengeModeMeta;
  onRoundComplete: (detail: RoundCompletionDetail) => void;
  onExitToOverview: () => void;
  onSkipMode: () => void;
}

type Phase = "briefing" | "running" | "paused";

export function TargetChallengeEngine({
  mode,
  onRoundComplete,
  onExitToOverview,
  onSkipMode,
}: TargetChallengeEngineProps) {
  const mechanics = MODE_MECHANICS[mode.id] ?? MODE_MECHANICS.standard;
  const [phase, setPhase] = useState<Phase>("briefing");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [targetNumber, setTargetNumber] = useState(1);
  const [misses, setMisses] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [usedKeyboard, setUsedKeyboard] = useState(false);
  const [pos, setPos] = useState<Point>({ x: 20, y: 20 });
  const [decoys, setDecoys] = useState<Point[]>([]);
  const [switchBoxes, setSwitchBoxes] = useState<SwitchBox[]>(() => buildSwitchBoxes());

  const arenaRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const startRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pauseStartRef = useRef<number | null>(null);
  const roundBoundsRef = useRef({ w: 600, h: ARENA_HEIGHT });
  const needsFirstPlacementRef = useRef(false);
  const exitTriggerRef = useRef<HTMLButtonElement | null>(null);
  const wasAlreadyPausedRef = useRef(false);
  const { message, announce } = useAnnouncer();

  // The arena only exists in the DOM once phase is "running" — placing the
  // first target has to wait until after that render commits, or it's
  // measured against a not-yet-mounted (or previous, stale) element and
  // falls back to a guessed width. useLayoutEffect runs after the DOM
  // update but before paint, so arenaRef.current here reflects the arena's
  // real, current size at every viewport width and zoom level.
  useLayoutEffect(() => {
    if (phase === "running" && needsFirstPlacementRef.current) {
      needsFirstPlacementRef.current = false;
      placeRound(mechanics.targetSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Live elapsed-time ticker — only while a round is actually running, so
  // no time or motion accrues while paused, briefing, or after finishing.
  useEffect(() => {
    if (phase !== "running") return;
    const interval = window.setInterval(() => {
      setElapsedMs(performance.now() - startRef.current - pausedAccumRef.current);
    }, 100);
    return () => window.clearInterval(interval);
  }, [phase]);

  // Motor-tremor jitter: nudges the target every 110ms by up to ±22px,
  // clamped to the arena bounds captured when this target was placed.
  useEffect(() => {
    if (phase !== "running" || !mechanics.jitter) return;
    const amount = mechanics.jitterAmount ?? 22;
    const interval = window.setInterval(() => {
      setPos((prev) => {
        const { w, h } = roundBoundsRef.current;
        const size = mechanics.targetSize;
        const dx = Math.random() * amount * 2 - amount;
        const dy = Math.random() * amount * 2 - amount;
        return {
          x: clamp(prev.x + dx, 4, Math.max(4, w - size - 4)),
          y: clamp(prev.y + dy, 4, Math.max(4, h - size - 4)),
        };
      });
    }, mechanics.jitterMs ?? 110);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, targetNumber, mechanics.jitter]);

  // Switch mode always focuses the first box when a new round of boxes
  // appears — matching the original, the labeled "Select" box is not
  // necessarily first, so the player must Tab to find it.
  useEffect(() => {
    if (phase === "running" && mechanics.isSwitch) {
      boxRefs.current[0]?.focus();
    }
  }, [phase, targetNumber, mechanics.isSwitch]);

  function placeRound(size: number) {
    const arenaWidth = arenaRef.current?.clientWidth || 600;
    const arenaHeight = arenaRef.current?.clientHeight || ARENA_HEIGHT;
    roundBoundsRef.current = { w: arenaWidth, h: arenaHeight };
    setPos(randomPoint(arenaWidth, arenaHeight, size));
    if (mechanics.decoyCount) {
      setDecoys(
        Array.from({ length: mechanics.decoyCount }, () =>
          randomPoint(arenaWidth, arenaHeight, size)
        )
      );
    } else {
      setDecoys([]);
    }
    if (mechanics.isSwitch) {
      setSwitchBoxes(buildSwitchBoxes());
    }
  }

  function startRound() {
    startRef.current = performance.now();
    pausedAccumRef.current = 0;
    setMisses(0);
    setUsedKeyboard(false);
    setTargetNumber(1);
    needsFirstPlacementRef.current = true;
    setPhase("running");
    announce("Round started. Target 1 of 8.");
  }

  function togglePause() {
    if (phase === "running") {
      pauseStartRef.current = performance.now();
      setPhase("paused");
      announce("Paused.");
    } else if (phase === "paused") {
      if (pauseStartRef.current !== null) {
        pausedAccumRef.current += performance.now() - pauseStartRef.current;
      }
      setPhase("running");
      announce("Resumed.");
    }
  }

  function restart() {
    setPhase("briefing");
    setMisses(0);
    setElapsedMs(0);
    setTargetNumber(1);
  }

  function finish() {
    const finalTime = performance.now() - startRef.current - pausedAccumRef.current;
    announce("Round finished.");
    onRoundComplete({
      timeMs: Math.round(finalTime),
      misclicks: misses,
      usedKeyboard,
    });
  }

  function onHit(keyboardUsed: boolean) {
    if (phase !== "running") return;
    if (keyboardUsed) setUsedKeyboard(true);
    if (targetNumber >= TOTAL_TARGETS) {
      finish();
    } else {
      const next = targetNumber + 1;
      setTargetNumber(next);
      placeRound(mechanics.targetSize);
      announce(`Target ${next} of 8.`);
    }
  }

  function onMiss() {
    if (phase !== "running") return;
    setMisses((m) => m + 1);
  }

  function requestExit(event: React.MouseEvent<HTMLButtonElement>) {
    exitTriggerRef.current = event.currentTarget;
    if (phase === "running") {
      // Pause first so timing and movement stop the instant the player
      // starts to leave, whether they confirm or change their mind. This
      // pause was caused only by opening the dialog, so canceling resumes
      // the round automatically.
      wasAlreadyPausedRef.current = false;
      pauseStartRef.current = performance.now();
      setPhase("paused");
      setShowExitConfirm(true);
    } else if (phase === "paused") {
      // Already paused by the player before opening the dialog — canceling
      // should leave it paused, not force it to resume.
      wasAlreadyPausedRef.current = true;
      setShowExitConfirm(true);
    } else {
      onExitToOverview();
    }
  }

  function confirmExit() {
    setShowExitConfirm(false);
    onExitToOverview();
  }

  function cancelExit() {
    setShowExitConfirm(false);
    if (!wasAlreadyPausedRef.current) {
      if (pauseStartRef.current !== null) {
        pausedAccumRef.current += performance.now() - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      setPhase("running");
    }
    exitTriggerRef.current?.focus();
  }

  const isPaused = phase === "paused";

  return (
    <div className="stack">
      <LiveRegion message={message} />

      {showExitConfirm && (
        <ConfirmExitDialog onExitRound={confirmExit} onKeepPlaying={cancelExit} />
      )}

      <div className="btn-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <button type="button" className="btn-tertiary" onClick={requestExit}>
          ← Back to game menu
        </button>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
          <h1 style={{ margin: 0, fontSize: "1.15rem" }}>{mode.title}</h1>
          <InfoButton label={mode.title} text={mode.aboutText} />
        </div>
      </div>

      {phase === "briefing" && (
        <div className="card stack-sm">
          <p style={{ margin: 0, fontWeight: 600, fontSize: "1.05rem" }}>{mode.instructions}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={startRound}>
              Start round
            </button>
            <button type="button" className="btn btn-secondary" onClick={onSkipMode}>
              Skip this mode
            </button>
          </div>
        </div>
      )}

      {(phase === "running" || phase === "paused") && (
        <div className="stack">
          {/* Not role="status": this redraws every 100ms while the round is
              running, and a live region that busy would announce
              constantly. Deliberate events (round start, target N of 8,
              paused/resumed, finished) go through the LiveRegion above
              instead. */}
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
            <Stat label="Round" value={`${Math.min(targetNumber, TOTAL_TARGETS)}/${TOTAL_TARGETS}`} />
            <Stat label="Time" value={`${(elapsedMs / 1000).toFixed(1)}s`} />
            <Stat label="Misses" value={String(misses)} />
          </div>

          <p style={{ margin: 0, fontWeight: 600 }}>{mode.instructions}</p>

          <div
            ref={arenaRef}
            className={mechanics.isSwitch ? "game-arena game-arena--switch" : "game-arena"}
            style={{ filter: mechanics.arenaFilter, opacity: isPaused ? 0.6 : 1 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onMiss();
            }}
          >
            {isPaused && (
              <div className="game-arena__paused-label" aria-hidden="true">
                Paused
              </div>
            )}

            {mechanics.isSwitch
              ? // A flex-wrap row instead of fixed left offsets: five 56px
                // boxes at fixed 70px steps overflowed the arena (and were
                // clipped by its overflow:hidden, so unreachable by click
                // or visible at all) below roughly 370px of arena width —
                // this happens routinely at 320px viewports and 200%+ zoom.
                // Wrapping keeps every box on-screen and reachable at any
                // width, only ever spilling onto a second row.
                <div className="game-arena__switch-row">
                  {switchBoxes.map((box, i) => (
                    <button
                      key={box.id}
                      ref={(el) => {
                        boxRefs.current[i] = el;
                      }}
                      type="button"
                      className="game-arena__switchbox"
                      disabled={isPaused}
                      onClick={() => (box.isSelect ? onHit(true) : onMiss())}
                      aria-label={box.isSelect ? "Select" : "Not the select target"}
                    >
                      {box.isSelect ? "Select" : ""}
                    </button>
                  ))}
                </div>
              : [
                  ...decoys.map((d, i) => (
                    <button
                      key={`decoy-${i}`}
                      type="button"
                      className="game-arena__decoy"
                      disabled={isPaused}
                      style={{
                        left: d.x,
                        top: d.y,
                        width: mechanics.targetSize,
                        height: mechanics.targetSize,
                        background: mechanics.decoyColor,
                      }}
                      onClick={() => onMiss()}
                      aria-label="Not the target"
                    />
                  )),
                  <button
                    key="target"
                    type="button"
                    className="game-arena__target"
                    disabled={isPaused}
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: mechanics.targetSize,
                      height: mechanics.targetSize,
                      background: mechanics.targetColor,
                      border: mechanics.lowContrast ? "1px solid #d8d6cc" : undefined,
                    }}
                    onClick={() => onHit(false)}
                    aria-label="Target"
                  />,
                ]}
          </div>

          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={togglePause}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={restart}>
              Restart
            </button>
            <button type="button" className="btn btn-secondary" onClick={requestExit}>
              Exit game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 700 }}>{value}</div>
      <div className="text-muted" style={{ fontSize: "0.72rem" }}>
        {label}
      </div>
    </div>
  );
}
