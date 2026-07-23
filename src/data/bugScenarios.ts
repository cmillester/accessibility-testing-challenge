import { BugScenario } from "../types";

// Fifteen "Spot the Accessibility Bug" scenarios: twelve restored from the
// original prototype, plus three added later (independent audio controls,
// pause/save behavior, and screen narration of dynamic menu changes). Every
// one is a real game screen the player inspects, with three answer choices,
// immediate right/wrong feedback, and one line of explanation. Eight of
// these fifteen are sampled and shuffled per playthrough — the run length
// and mechanic are unchanged from the original.
export const BUG_SCENARIOS: BugScenario[] = [
  {
    id: "color-only-status",
    category: "Color-only unit status",
    mockupId: "color-only-status",
    options: [
      "Nothing — color makes it obvious",
      "Team is shown by color alone, with no icon or label",
      "The status dots are positioned too close together",
    ],
    correctIndex: 1,
    explain:
      "Color-only identity excludes players who can't reliably tell those colors apart. Pair every color with a shape, icon, or label.",
  },
  {
    id: "crowded-buttons",
    category: "Tiny, crowded buttons",
    mockupId: "crowded-buttons",
    options: [
      "The button labels are hard to read",
      "The buttons are small and tightly packed together",
      "There are too many buttons in the bar",
    ],
    correctIndex: 1,
    explain:
      "Small, closely spaced buttons are easy to mis-tap, especially with limited precision or on a moving touchscreen. Use larger targets with visible spacing.",
  },
  {
    id: "low-contrast-quest",
    category: "Low-contrast quest text",
    mockupId: "low-contrast-quest",
    options: [
      "The text is too long to read quickly",
      "The text's contrast is too low against the background",
      "The text uses an unusual font",
    ],
    correctIndex: 1,
    explain:
      "Low-contrast text disappears against a busy background. Match every text style to the same minimum contrast standard.",
  },
  {
    id: "subtitle-no-scrim",
    category: "Subtitles with no background scrim",
    mockupId: "subtitle-no-scrim",
    options: [
      "The subtitle font is too small",
      "The subtitle has no background scrim, so it's unreadable over a light image",
      "The subtitle stays on screen too long",
    ],
    correctIndex: 1,
    explain:
      "Subtitles need more than a readable background: identify who's speaking, caption meaningful non-dialogue sounds (footsteps, an alarm, a door), and let players adjust size, color, and background to their own needs.",
  },
  {
    id: "rapid-flash",
    category: "Rapid flashing effect",
    mockupId: "rapid-flash",
    options: [
      "The effect plays too rarely to notice",
      "The effect flashes rapidly, which can trigger seizures in photosensitive players",
      "The effect is the wrong color",
    ],
    correctIndex: 1,
    explain:
      "Rapid flashing can trigger seizures in players with photosensitive epilepsy. Use a single, brief, non-flashing highlight instead.",
  },
  {
    id: "missing-focus",
    category: "Missing keyboard focus indicator",
    mockupId: "missing-focus",
    options: [
      "Tab moves through the buttons in the wrong order",
      "None of these buttons show a visible focus indicator while tabbing",
      "The button labels are inconsistent",
    ],
    correctIndex: 1,
    explain:
      "Without a visible focus indicator, a keyboard-only player can't tell which control they're about to activate. Every focusable control needs a visible focus state.",
  },
  {
    id: "unlabeled-icon",
    category: "Unlabeled icon-only button",
    mockupId: "unlabeled-icon",
    options: [
      "The icon is drawn at the wrong size",
      'This icon-only button has no accessible name — a screen reader would only announce "button"',
      "The icon uses a confusing color",
    ],
    correctIndex: 1,
    explain:
      "An icon-only control with no accessible name is unusable through a screen reader. Give every icon a text alternative.",
  },
  {
    id: "qte-no-pause",
    category: "Quick-time event with no pause",
    mockupId: "qte-no-pause",
    options: [
      "The countdown number is too small to read",
      "There's no way to pause or extend a fast countdown before it expires",
      "The countdown starts before the prompt appears",
    ],
    correctIndex: 1,
    explain:
      "A fixed, unpausable countdown excludes anyone who needs more time to see, read, or physically react. Offer a way to pause or extend it.",
  },
  {
    id: "audio-only-footsteps",
    category: "Audio-only warning cue",
    mockupId: "audio-only-footsteps",
    options: [
      "The sound effect is too quiet",
      "This warning is conveyed only through sound, with no visible cue",
      "The footsteps sound unrealistic",
    ],
    correctIndex: 1,
    explain:
      "A cue that only plays as sound is invisible to anyone who can't rely on audio in the moment. Pair every audio cue with a visible one.",
  },
  {
    id: "clipped-inventory-text",
    category: "Text clipped at larger sizes",
    mockupId: "clipped-inventory-text",
    options: [
      "The font choice is inconsistent with the rest of the game",
      "The text is clipped and cut off instead of reflowing at a larger size",
      "The container is the wrong color",
    ],
    correctIndex: 1,
    explain:
      "Fixed-size text containers clip or cut off enlarged text right when it's meant to help. Let text reflow instead of clipping.",
  },
  {
    id: "camera-shake-no-toggle",
    category: "Camera shake with no setting",
    mockupId: "camera-shake-no-toggle",
    options: [
      "The resolution options are limited",
      "There's no setting to reduce or disable camera shake",
      "The field-of-view range is too narrow",
    ],
    correctIndex: 1,
    explain:
      "Constant camera shake can cause discomfort for players with vestibular disorders or migraines. Add a setting to reduce or disable it.",
  },
  {
    id: "unremappable-controls",
    category: "Unremappable controls",
    mockupId: "unremappable-controls",
    options: [
      "The default key bindings are unintuitive",
      "Controls are fixed, with no way to remap them to a different input",
      "There are too few actions listed",
    ],
    correctIndex: 1,
    explain:
      "A fixed control scheme excludes anyone who can't comfortably use that exact input. Let every action be remapped.",
  },
  {
    id: "single-volume-slider",
    category: "Audio settings with only a master volume control",
    mockupId: "single-volume-slider",
    options: [
      "The slider doesn't show a numeric value",
      "There's only one master volume control — no separate dialogue, music, or effects sliders",
      "The menu has too many settings on one screen",
    ],
    correctIndex: 1,
    explain:
      "A single master slider forces an all-or-nothing tradeoff. Independent dialogue, music, and effects controls let a player boost speech over music, or lower effects that mask important cues.",
  },
  {
    id: "no-manual-save",
    category: "Autosave-only progress",
    mockupId: "no-manual-save",
    options: [
      "The save icon is too small to notice",
      "There's no manual save — players can't choose a safe stopping point or protect their progress",
      "The autosave happens too frequently",
    ],
    correctIndex: 1,
    explain:
      "Players may need to stop unexpectedly — for a break, a medical need, or simply to end a session. Reliable manual saving, alongside clear, predictable autosave behavior, lets them choose a safe stopping point instead of leaving it to chance.",
  },
  {
    id: "unannounced-menu-changes",
    category: "Menu changes not announced to screen readers",
    mockupId: "unannounced-menu-changes",
    options: [
      "The menu items are in an unexpected order",
      "The selected option, a changing value, or a new status message isn't announced to screen readers",
      "The menu takes too many button presses to navigate",
    ],
    correctIndex: 1,
    explain:
      "A screen reader user can't see a highlighted item, a value changing, or an error appear — dynamic interface changes like these need to be communicated through screen narration, not shown visually alone.",
  },
];

export function getBugScenarioById(id: string) {
  return BUG_SCENARIOS.find((s) => s.id === id);
}
