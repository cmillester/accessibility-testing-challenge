import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { BugOutcome, BugRunResult, ChallengeModeId, ModeResult, RoundCompletionDetail } from "../types";

const CHALLENGE_STORAGE_KEY = "atl_challenge_progress_v3";

const EMPTY_MODE_RESULT: ModeResult = {
  completed: false,
  bestTimeMs: null,
  bestMisclicks: null,
  lastTimeMs: null,
  lastMisclicks: null,
};

export interface ChallengeProgressState {
  /** Optional — the visitor's own name, used only to label their local
   * results. Never sent anywhere; nothing is shared with other visitors. */
  playerName: string;
  modeResults: Record<ChallengeModeId, ModeResult>;
  /** Lifetime, unique — every Spot the Bug scenario ever viewed. */
  scenariosExploredIds: string[];
  /** Lifetime, unique — every scenario ever answered correctly. */
  scenariosIdentifiedIds: string[];
  /** This visitor's best completed Spot the Bug run (most correct, then
   * fastest time) — a personal best, not a shared leaderboard. */
  bestBugRun: BugRunResult | null;
}

const DEFAULT_CHALLENGE_STATE: ChallengeProgressState = {
  playerName: "",
  modeResults: {
    standard: { ...EMPTY_MODE_RESULT },
    "reduced-clarity": { ...EMPTY_MODE_RESULT },
    "color-dependent": { ...EMPTY_MODE_RESULT },
    "pointer-stability": { ...EMPTY_MODE_RESULT },
    "switch-navigation": { ...EMPTY_MODE_RESULT },
  },
  scenariosExploredIds: [],
  scenariosIdentifiedIds: [],
  bestBugRun: null,
};

function addUnique(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id];
}

function isBetterBugRun(candidate: BugRunResult, current: BugRunResult | null): boolean {
  if (!current) return true;
  if (candidate.correctCount !== current.correctCount) {
    return candidate.correctCount > current.correctCount;
  }
  return candidate.timeMs < current.timeMs;
}

const KNOWN_MODE_IDS: ChallengeModeId[] = [
  "standard",
  "reduced-clarity",
  "color-dependent",
  "pointer-stability",
  "switch-navigation",
];

function isValidModeResult(value: unknown): value is ModeResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ModeResult>;
  return (
    typeof v.completed === "boolean" &&
    (v.bestTimeMs === null || typeof v.bestTimeMs === "number") &&
    (v.bestMisclicks === null || typeof v.bestMisclicks === "number") &&
    (v.lastTimeMs === null || typeof v.lastTimeMs === "number") &&
    (v.lastMisclicks === null || typeof v.lastMisclicks === "number")
  );
}

function isValidBugRun(value: unknown): value is BugRunResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<BugRunResult>;
  return (
    typeof v.correctCount === "number" &&
    typeof v.totalCount === "number" &&
    typeof v.timeMs === "number"
  );
}

/** Repairs whatever was loaded from storage into a value this app can
 * safely trust — never throws, and any field that doesn't match the
 * expected shape (old schema, hand-edited, corrupted) is quietly replaced
 * with its default instead of being allowed to crash a component later. */
function sanitizeChallengeState(value: ChallengeProgressState): ChallengeProgressState {
  const modeResults = {} as Record<ChallengeModeId, ModeResult>;
  for (const id of KNOWN_MODE_IDS) {
    const candidate = value.modeResults?.[id];
    modeResults[id] = isValidModeResult(candidate) ? candidate : { ...EMPTY_MODE_RESULT };
  }

  return {
    playerName: typeof value.playerName === "string" ? value.playerName : "",
    modeResults,
    scenariosExploredIds: Array.isArray(value.scenariosExploredIds)
      ? value.scenariosExploredIds.filter((id) => typeof id === "string")
      : [],
    scenariosIdentifiedIds: Array.isArray(value.scenariosIdentifiedIds)
      ? value.scenariosIdentifiedIds.filter((id) => typeof id === "string")
      : [],
    bestBugRun: isValidBugRun(value.bestBugRun) ? value.bestBugRun : null,
  };
}

interface ChallengeStateValue {
  challenge: ChallengeProgressState;
  /** False if localStorage isn't available this session (blocked, private
   * mode, etc.) — progress still works, just won't persist past this tab. */
  storageAvailable: boolean;
  setPlayerName: (name: string) => void;
  recordModeResult: (modeId: ChallengeModeId, detail: RoundCompletionDetail) => void;
  recordScenarioExplored: (scenarioId: string) => void;
  recordBugOutcome: (outcome: BugOutcome) => void;
  recordBugRunComplete: (result: BugRunResult) => void;
  clearAllProgress: () => void;
  modesCompletedCount: number;
}

const ChallengeStateContext = createContext<ChallengeStateValue | undefined>(undefined);

export function ChallengeStateProvider({ children }: { children: React.ReactNode }) {
  const [challenge, setChallenge, storageAvailable] = useLocalStorageState<ChallengeProgressState>(
    CHALLENGE_STORAGE_KEY,
    DEFAULT_CHALLENGE_STATE,
    sanitizeChallengeState
  );

  const setPlayerName = useCallback(
    (name: string) => {
      setChallenge((prev) => ({ ...prev, playerName: name }));
    },
    [setChallenge]
  );

  const recordModeResult = useCallback(
    (modeId: ChallengeModeId, detail: RoundCompletionDetail) => {
      setChallenge((prev) => {
        const prevResult = prev.modeResults[modeId] ?? EMPTY_MODE_RESULT;
        const bestTimeMs =
          prevResult.bestTimeMs === null ? detail.timeMs : Math.min(prevResult.bestTimeMs, detail.timeMs);
        const bestMisclicks =
          prevResult.bestMisclicks === null
            ? detail.misclicks
            : Math.min(prevResult.bestMisclicks, detail.misclicks);
        return {
          ...prev,
          modeResults: {
            ...prev.modeResults,
            [modeId]: {
              completed: true,
              bestTimeMs,
              bestMisclicks,
              lastTimeMs: detail.timeMs,
              lastMisclicks: detail.misclicks,
            },
          },
        };
      });
    },
    [setChallenge]
  );

  const recordScenarioExplored = useCallback(
    (scenarioId: string) => {
      setChallenge((prev) => ({
        ...prev,
        scenariosExploredIds: addUnique(prev.scenariosExploredIds, scenarioId),
      }));
    },
    [setChallenge]
  );

  const recordBugOutcome = useCallback(
    (outcome: BugOutcome) => {
      setChallenge((prev) => ({
        ...prev,
        scenariosExploredIds: addUnique(prev.scenariosExploredIds, outcome.scenarioId),
        scenariosIdentifiedIds: outcome.correct
          ? addUnique(prev.scenariosIdentifiedIds, outcome.scenarioId)
          : prev.scenariosIdentifiedIds,
      }));
    },
    [setChallenge]
  );

  const recordBugRunComplete = useCallback(
    (result: BugRunResult) => {
      setChallenge((prev) => ({
        ...prev,
        bestBugRun: isBetterBugRun(result, prev.bestBugRun) ? result : prev.bestBugRun,
      }));
    },
    [setChallenge]
  );

  const clearAllProgress = useCallback(() => {
    setChallenge(() => DEFAULT_CHALLENGE_STATE);
  }, [setChallenge]);

  const modesCompletedCount = useMemo(
    () => Object.values(challenge.modeResults).filter((m) => m.completed).length,
    [challenge.modeResults]
  );

  const value: ChallengeStateValue = {
    challenge,
    storageAvailable,
    setPlayerName,
    recordModeResult,
    recordScenarioExplored,
    recordBugOutcome,
    recordBugRunComplete,
    clearAllProgress,
    modesCompletedCount,
  };

  return (
    <ChallengeStateContext.Provider value={value}>{children}</ChallengeStateContext.Provider>
  );
}

export function useChallengeState(): ChallengeStateValue {
  const ctx = useContext(ChallengeStateContext);
  if (!ctx) {
    throw new Error("useChallengeState must be used within a ChallengeStateProvider");
  }
  return ctx;
}
