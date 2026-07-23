import React from "react";
import { CHALLENGE_MODES, MODE_BARRIER_NOTE, SPOT_THE_BUG_ABOUT_TEXT } from "../../../data/challengeModes";
import { useChallengeState } from "../../../context/ChallengeStateContext";
import { InfoButton } from "../../common/InfoButton";

interface ModeSelectHubProps {
  onOpenMode: (modeId: string) => void;
  onPlaySpotTheBug: () => void;
  onBackHome: () => void;
}

export function ModeSelectHub({ onOpenMode, onPlaySpotTheBug, onBackHome }: ModeSelectHubProps) {
  const { challenge, modesCompletedCount } = useChallengeState();
  const triedCount = modesCompletedCount + (challenge.bestBugRun ? 1 : 0);
  const totalToTry = CHALLENGE_MODES.length + 1;

  return (
    <div className="stack">
      <div>
        <button type="button" className="btn-tertiary" onClick={onBackHome}>
          ← Back to Home
        </button>
      </div>

      <div className="stack-sm">
        <h1 style={{ margin: 0 }}>Accessibility Challenge</h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Choose a challenge mode. {triedCount} of {totalToTry} tried — play any mode, in any order.
        </p>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
          {MODE_BARRIER_NOTE}
        </p>
      </div>

      <div className="grid grid--2">
        {CHALLENGE_MODES.map((mode) => {
          const result = challenge.modeResults[mode.id];
          return (
            <div key={mode.id} className="card stack-sm">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <h3 style={{ margin: 0 }}>{mode.title}</h3>
                <InfoButton label={mode.title} text={mode.aboutText} />
              </div>
              <p className="text-muted" style={{ margin: 0 }}>{mode.tagline}</p>
              {result?.completed && (
                <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                  Best: {((result.bestTimeMs ?? 0) / 1000).toFixed(1)}s ·{" "}
                  {result.bestMisclicks} miss{result.bestMisclicks === 1 ? "" : "es"}
                </p>
              )}
              <div>
                <button type="button" className="btn btn-primary" onClick={() => onOpenMode(mode.id)}>
                  {result?.completed ? "Play again" : "Play"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <button type="button" className="btn btn-secondary" onClick={onPlaySpotTheBug}>
          Play Spot the Bug
        </button>
        <InfoButton label="Spot the Bug" text={SPOT_THE_BUG_ABOUT_TEXT} />
      </div>
    </div>
  );
}
