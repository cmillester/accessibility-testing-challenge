// Shared type definitions for the Accessibility Testing Challenge.
// This is an original, standalone project. All content herein is generic
// and fictional — no real products, companies, or people are represented.
//
// Only types actually used by the two active games (the Accessibility
// Challenge and Spot the Bug) and the surrounding shell live here. Earlier
// iterations of this project also had an Interaction Lab, a Spot the
// Barrier quiz, a leaderboard, and a broader "activity" system — none of
// those are part of the shipped app any more, and their types have been
// removed rather than kept around unused.

export type ScreenId = "home" | "quiz" | "your-results" | "about";

// ============================================================================
// Accessibility Challenge: five modes sharing one 8-target engine.
// ============================================================================

export type ChallengeModeId =
  | "standard"
  | "reduced-clarity"
  | "color-dependent"
  | "pointer-stability"
  | "switch-navigation";

export interface ChallengeModeMeta {
  id: ChallengeModeId;
  title: string;
  tagline: string;
  /** One or two sentences, shown before the round starts. */
  instructions: string;
  /** One short explanation shown after the round completes. */
  explanation: string;
  /** One practical design recommendation, shown in the results summary. */
  recommendation: string;
  /** Short, respectful context shown in this mode's info popover. */
  aboutText: string;
}

export interface ModeResult {
  completed: boolean;
  bestTimeMs: number | null;
  bestMisclicks: number | null;
  lastTimeMs: number | null;
  lastMisclicks: number | null;
}

export interface RoundCompletionDetail {
  timeMs: number;
  misclicks: number;
  usedKeyboard: boolean;
}

// ============================================================================
// Spot the Accessibility Bug: realistic game-screen scenarios.
// A simple three-choice quiz per scenario — click one of three options,
// see whether it was correct, read one line of explanation, move on.
// ============================================================================

export interface BugScenario {
  id: string;
  category: string;
  /** Key into the mockup component registry. */
  mockupId: string;
  /** Exactly three answer choices. */
  options: string[];
  correctIndex: number;
  /** One or two sentences of explanation shown after answering. */
  explain: string;
}

export interface BugOutcome {
  scenarioId: string;
  correct: boolean;
}

export interface BugRunResult {
  correctCount: number;
  totalCount: number;
  timeMs: number;
}
