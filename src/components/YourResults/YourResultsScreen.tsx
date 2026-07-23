import React, { useState } from "react";
import { useChallengeState } from "../../context/ChallengeStateContext";
import { CHALLENGE_MODES } from "../../data/challengeModes";
import { CarryThisLensForwardCard } from "../common/CarryThisLensForwardCard";

interface YourResultsScreenProps {
  onBackHome: () => void;
  onPlayChallenge: () => void;
  onPlaySpotTheBug: () => void;
  onReplayMissed: () => void;
  onTryMode: (modeId: string) => void;
}

export function YourResultsScreen({
  onBackHome,
  onPlayChallenge,
  onPlaySpotTheBug,
  onReplayMissed,
  onTryMode,
}: YourResultsScreenProps) {
  const { challenge, modesCompletedCount, storageAvailable, setPlayerName, clearAllProgress } =
    useChallengeState();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [nameDraft, setNameDraft] = useState(challenge.playerName);

  const scenariosExplored = challenge.scenariosExploredIds.length;
  const bugsIdentified = challenge.scenariosIdentifiedIds.length;
  const missedCount = challenge.scenariosExploredIds.filter(
    (id) => !challenge.scenariosIdentifiedIds.includes(id)
  ).length;
  const hasAnyProgress = modesCompletedCount > 0 || scenariosExplored > 0;

  function handleClear() {
    clearAllProgress();
    setConfirmingClear(false);
    setNameDraft("");
  }

  return (
    <div className="stack">
      <div>
        <button type="button" className="btn-tertiary" onClick={onBackHome}>
          ← Back to Home
        </button>
      </div>
      <h1>Your Results</h1>

      {!storageAvailable && (
        <div className="notice-box">
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            Your progress will stay available for this session.
          </p>
        </div>
      )}

      <CarryThisLensForwardCard />

      <div className="field">
        <label htmlFor="player-name">Your name (optional — stays on this device only)</label>
        <input
          id="player-name"
          type="text"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={() => setPlayerName(nameDraft)}
          placeholder="Not set"
        />
      </div>

      {!hasAnyProgress ? (
        <div className="card stack-sm">
          <p style={{ margin: 0 }}>Nothing explored yet — jump into either game whenever you like.</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={onPlayChallenge}>
              Choose a mode
            </button>
            <button type="button" className="btn btn-secondary" onClick={onPlaySpotTheBug}>
              Play Spot the Bug
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="notice-box">
            <p style={{ margin: 0 }}>
              You explored {modesCompletedCount} challenge mode{modesCompletedCount === 1 ? "" : "s"}{" "}
              and found {bugsIdentified} accessibility bug{bugsIdentified === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="grid grid--2">
            <div className="card stack-sm">
              <h3 style={{ margin: 0 }}>Accessibility Challenge</h3>
              <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>
                {modesCompletedCount} / {CHALLENGE_MODES.length}
              </p>
              <p className="text-muted" style={{ margin: 0 }}>modes explored</p>
            </div>
            <div className="card stack-sm">
              <h3 style={{ margin: 0 }}>Spot the Bug</h3>
              <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>
                {bugsIdentified} / {scenariosExplored}
              </p>
              <p className="text-muted" style={{ margin: 0 }}>bugs identified of scenarios explored</p>
              {challenge.bestBugRun && (
                <>
                  <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                    Best full run: {challenge.bestBugRun.correctCount}/{challenge.bestBugRun.totalCount}
                    {" · "}
                    {(challenge.bestBugRun.timeMs / 1000).toFixed(1)}s
                  </p>
                  <p className="text-muted" style={{ margin: 0, fontSize: "0.78rem" }}>
                    Time includes active investigation only. Reading and feedback time are excluded.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="card stack">
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Personal bests by mode</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
              Local to this device only — there's no shared or public leaderboard.
            </p>
            <div className="grid grid--2">
              {CHALLENGE_MODES.map((mode) => {
                const result = challenge.modeResults[mode.id];
                return (
                  <div key={mode.id} className="stack-sm">
                    <h4 style={{ margin: 0 }}>{mode.title}</h4>
                    {result?.completed ? (
                      <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                        Best: {((result.bestTimeMs ?? 0) / 1000).toFixed(1)}s ·{" "}
                        {result.bestMisclicks} miss{result.bestMisclicks === 1 ? "" : "es"}
                      </p>
                    ) : (
                      <div className="stack-sm">
                        <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                          Not yet tried.
                        </p>
                        <button type="button" className="btn-tertiary" onClick={() => onTryMode(mode.id)}>
                          Try this mode
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={onPlayChallenge}>
              Choose a mode
            </button>
            <button type="button" className="btn btn-secondary" onClick={onPlaySpotTheBug}>
              Play Spot the Bug
            </button>
            {missedCount > 0 && (
              <button type="button" className="btn btn-secondary" onClick={onReplayMissed}>
                Replay missed scenarios
              </button>
            )}
          </div>
        </>
      )}

      <div className="card stack-sm">
        {!confirmingClear ? (
          <button type="button" className="btn-tertiary" onClick={() => setConfirmingClear(true)}>
            Clear saved progress
          </button>
        ) : (
          <div className="stack-sm">
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              This clears everything on this page, including your name. It can't be undone.
            </p>
            <div className="btn-row">
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Yes, clear it
              </button>
              <button type="button" className="btn-tertiary" onClick={() => setConfirmingClear(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
