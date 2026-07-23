import { ChallengeModeMeta } from "../types";

// The five Accessibility Challenge modes. Any mode can be played in any
// order — Standard is a useful first round since it's the easiest, but
// nothing locks the others behind it. Each mode reuses the same 8-target
// engine with a different, fixed interaction condition — the same
// difficulty every round, not a curve.
export const CHALLENGE_MODES: ChallengeModeMeta[] = [
  {
    id: "standard",
    title: "Standard",
    tagline: "Large, clear, predictable targets.",
    instructions:
      "Start with a clear, stable baseline: select each target as it appears, eight in a row.",
    explanation:
      "This is the accessible design already: a large, high-contrast target in a predictable spot.",
    recommendation: "Keep this as the reference point every other mode is measured against.",
    aboutText:
      "This is the clear, stable baseline used to compare how interface barriers affect speed and accuracy.",
  },
  {
    id: "reduced-clarity",
    title: "Low Vision",
    tagline: "Blur, low contrast, and a smaller target.",
    instructions: "This round adds blur, low contrast, and a smaller target.",
    explanation:
      "Low contrast and blur force everyone to work harder to find the target — for some players that extra effort is the difference between finishing and giving up.",
    recommendation: "Provide sufficiently large targets with strong contrast by default, not as an opt-in.",
    aboutText:
      "Low vision includes a wide range of visual experiences. Blur, low contrast, and small targets can make interfaces harder to navigate. This mode isolates those interface barriers for testing.",
  },
  {
    id: "color-dependent",
    title: "Color Vision",
    tagline: "One real target hidden among decoys of a similar hue.",
    instructions:
      "A color-vision filter is applied, and a few decoy shapes in a similar hue appear. Find the real target, not the decoys.",
    explanation:
      "Under a color-vision filter, a target and its decoys can become nearly indistinguishable — pairing color with a shape, icon, or label fixes it.",
    recommendation: "Pair every color-coded meaning with a shape, icon, or text label.",
    aboutText:
      "Color-vision differences can make certain colors difficult or impossible to distinguish. Some rare conditions involve very limited or no color perception. This mode tests what happens when an interface relies on color alone.",
  },
  {
    id: "pointer-stability",
    title: "Motor Tremor",
    tagline: "The target drifts and jitters on its own.",
    instructions: "This round adds unpredictable target movement.",
    explanation:
      "Constant, unpredictable movement is difficult to track and click for anyone with limited fine motor control — letting a target settle removes the barrier.",
    recommendation: "Use larger, generously spaced, stable targets instead of small or moving ones.",
    aboutText:
      "Tremors and other involuntary movements can make small or moving targets difficult to select. Larger targets, spacing, and stable controls support more accurate interaction.",
  },
  {
    id: "switch-navigation",
    title: "Switch Access",
    tagline: "No mouse — move focus with Tab, select with Enter or Space.",
    instructions:
      "Press Tab to move between targets. Press Enter or Space when you reach the target labeled Select.",
    explanation:
      "Switch and keyboard access only work when every control can be reached with Tab and activated without a mouse, and focus is always visible.",
    recommendation: "Make every control reachable by keyboard, with a clear, visible focus indicator.",
    aboutText:
      "Switch devices provide an alternative way to control an interface using one or a few inputs. They are often used by people with limited motor access and may be combined with other assistive technologies.",
  },
];

export function getChallengeModeById(id: string): ChallengeModeMeta | undefined {
  return CHALLENGE_MODES.find((m) => m.id === id);
}

// Shown once, near the mode selector — never phrased as a full disability
// simulation.
export const MODE_BARRIER_NOTE =
  "Each mode isolates a specific interface barrier. It does not reproduce the full lived experience of any disability.";

// Shown beside the Spot the Bug entry points (Home card, and its own
// header while playing).
export const SPOT_THE_BUG_ABOUT_TEXT =
  "Accessibility barriers often appear in games that otherwise function as designed. This challenge helps testers recognize issues in game menus, controls, captions, HUDs, audio cues, and gameplay.";
