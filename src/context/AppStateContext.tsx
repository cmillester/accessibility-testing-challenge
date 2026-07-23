import React, { createContext, useCallback, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const PROGRESS_STORAGE_KEY = "atl_progress_v1";

// Earlier iterations of this project stored Interaction Lab activity
// progress, a Spot the Barrier quiz result, principles-encountered
// tracking, and a local/seeded leaderboard here too. None of those systems
// are part of the shipped app any more — the only thing this context still
// needs to hold is the single reduced-motion preference the active games
// actually read.
interface AppProgressState {
  reducedMotionOverride: boolean;
}

const DEFAULT_PROGRESS: AppProgressState = {
  reducedMotionOverride: false,
};

interface AppStateValue {
  progress: AppProgressState;
  toggleReducedMotionOverride: () => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useLocalStorageState<AppProgressState>(
    PROGRESS_STORAGE_KEY,
    DEFAULT_PROGRESS
  );

  const toggleReducedMotionOverride = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      reducedMotionOverride: !prev.reducedMotionOverride,
    }));
  }, [setProgress]);

  const value: AppStateValue = { progress, toggleReducedMotionOverride };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
