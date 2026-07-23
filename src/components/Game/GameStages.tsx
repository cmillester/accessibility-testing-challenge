import React from "react";
import { Route } from "../../routing";
import { ModeSelectHub } from "./TargetChallenge/ModeSelectHub";
import { ModePage } from "./TargetChallenge/ModePage";
import { SpotTheBugFlow } from "./SpotTheBug/SpotTheBugFlow";

type GameRoute = Extract<Route, { screen: "challenge" | "challenge-mode" | "spot-the-bug" }>;

interface GameStagesProps {
  route: GameRoute;
  onNavigate: (route: Route) => void;
  onBackHome: () => void;
}

/**
 * The two optional games: the Accessibility Challenge (a free-choice mode
 * hub over the 8-target engine) and Spot the Accessibility Bug. Either can
 * be played in any order, skipped, or replayed.
 */
export function GameStages({ route, onNavigate, onBackHome }: GameStagesProps) {
  if (route.screen === "challenge") {
    return (
      <ModeSelectHub
        onOpenMode={(modeId) => onNavigate({ screen: "challenge-mode", modeId })}
        onPlaySpotTheBug={() => onNavigate({ screen: "spot-the-bug" })}
        onBackHome={onBackHome}
      />
    );
  }

  if (route.screen === "challenge-mode") {
    return (
      <ModePage
        modeId={route.modeId}
        onReturnToOverview={() => onNavigate({ screen: "challenge" })}
        onPlaySpotTheBug={() => onNavigate({ screen: "spot-the-bug" })}
      />
    );
  }

  if (route.screen === "spot-the-bug") {
    return (
      <SpotTheBugFlow
        key={route.onlyMissed ? "missed" : "all"}
        onlyMissed={route.onlyMissed}
        onExit={onBackHome}
        onPlayChallenge={() => onNavigate({ screen: "challenge" })}
        onReplayMissed={() => onNavigate({ screen: "spot-the-bug", onlyMissed: true })}
      />
    );
  }

  return null;
}
