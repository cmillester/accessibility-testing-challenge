import React, { useEffect, useState } from "react";
import { getChallengeModeById } from "../../../data/challengeModes";
import { RoundCompletionDetail } from "../../../types";
import { TargetChallengeEngine } from "./TargetChallengeEngine";
import { ModeSummary } from "./ModeSummary";
import { useChallengeState } from "../../../context/ChallengeStateContext";

interface ModePageProps {
  modeId: string;
  onReturnToOverview: () => void;
  onPlaySpotTheBug: () => void;
}

export function ModePage({ modeId, onReturnToOverview, onPlaySpotTheBug }: ModePageProps) {
  const mode = getChallengeModeById(modeId);
  const { challenge, recordModeResult } = useChallengeState();
  const [result, setResult] = useState<RoundCompletionDetail | null>(null);
  const [engineKey, setEngineKey] = useState(0);

  // An unknown or stale mode id (a hand-typed URL, an old bookmark, a
  // future mode removed later) should never render an empty screen —
  // send the player back to the mode menu instead.
  useEffect(() => {
    if (!mode) onReturnToOverview();
  }, [mode, onReturnToOverview]);

  if (!mode) return null;

  function handleRoundComplete(detail: RoundCompletionDetail) {
    recordModeResult(mode!.id, detail);
    setResult(detail);
  }

  function playAgain() {
    setResult(null);
    setEngineKey((k) => k + 1);
  }

  if (!result) {
    return (
      <TargetChallengeEngine
        key={engineKey}
        mode={mode}
        onRoundComplete={handleRoundComplete}
        onExitToOverview={onReturnToOverview}
        onSkipMode={onReturnToOverview}
      />
    );
  }

  return (
    <ModeSummary
      mode={mode}
      result={result}
      standardResult={challenge.modeResults.standard}
      onPlayAgain={playAgain}
      onTryAnotherMode={onReturnToOverview}
      onPlaySpotTheBug={onPlaySpotTheBug}
      onReturnToOverview={onReturnToOverview}
    />
  );
}
