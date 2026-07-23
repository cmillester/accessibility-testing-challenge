import React, { useEffect, useState } from "react";
import { useAppState } from "../../../context/AppStateContext";

export interface BugMockupProps {
  /** True whenever this scenario shouldn't be actively animating: the
   * Spot the Bug flow is paused, or the browser tab isn't visible. */
  paused?: boolean;
}

// Static, non-interactive mockups for each Spot the Bug scenario, ported
// from the original prototype's twelve scenario screens. The interaction
// itself — three answer choices, feedback, one line of explanation — lives
// in BugScenarioCard; these components only render the screen the player
// is meant to inspect.

export function ColorOnlyStatusMockup() {
  return (
    <div className="card--sunken card stack-sm" aria-label="Battle status display">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Battle status
      </p>
      <div style={{ display: "flex", gap: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{ width: 20, height: 20, borderRadius: "50%", background: "#b23b2c", display: "inline-block" }}
          />
          <span>Unit A</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{ width: 20, height: 20, borderRadius: "50%", background: "#3f8a5c", display: "inline-block" }}
          />
          <span>Unit B</span>
        </div>
      </div>
    </div>
  );
}

export function CrowdedButtonsMockup() {
  return (
    <div className="card--sunken card stack-sm">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Ability bar
      </p>
      <div style={{ display: "flex", gap: 2 }} aria-hidden="true">
        {["A", "B", "C", "D"].map((label) => (
          <span
            key={label}
            style={{
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-bg-raised)",
              border: "1px solid var(--color-border-strong)",
              fontSize: "0.65rem",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LowContrastQuestMockup() {
  return (
    <div className="card--sunken card">
      <p style={{ margin: 0, color: "#d9d4c6", fontSize: "0.95rem" }}>
        New quest available: The Sunken Archive
      </p>
    </div>
  );
}

export function SubtitleNoScrimMockup() {
  return (
    <div
      className="card stack-sm"
      style={{ background: "linear-gradient(180deg, #cfe0e8, #e9e2c9)", padding: "var(--space-5)" }}
    >
      <p style={{ margin: 0, color: "#fff", fontWeight: 700 }}>"We need to move — now."</p>
    </div>
  );
}

export function RapidFlashMockup({ paused }: BugMockupProps) {
  // The original prototype toggles opacity every 150ms (about 3.3 flashes
  // per second) — right at the commonly-cited photosensitive-seizure
  // threshold. This is the one deliberate deviation from the source
  // prototype: the rate is slowed to about 2.5 flashes per second, safely
  // under that threshold, while keeping the same scenario and interaction.
  const [on, setOn] = useState(true);
  const [tabHidden, setTabHidden] = useState(() =>
    typeof document !== "undefined" ? document.hidden : false
  );
  const { progress } = useAppState();

  useEffect(() => {
    function handleVisibility() {
      setTabHidden(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Stays static — no flashing at all — whenever the game is paused, the
  // tab isn't visible, the in-app reduced-motion setting is on, or the
  // browser/OS requests reduced motion.
  const shouldAnimate = !paused && !tabHidden && !progress.reducedMotionOverride && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = window.setInterval(() => setOn((v) => !v), 400);
    return () => window.clearInterval(id);
  }, [shouldAnimate]);

  return (
    <div className="card--sunken card stack-sm">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Critical-hit effect
      </p>
      <div
        aria-hidden="true"
        className="rapid-flash-indicator"
        style={{
          width: 80,
          height: 80,
          background: "#fff",
          opacity: on ? 1 : 0.15,
          border: "1px solid var(--color-border-strong)",
        }}
      />
    </div>
  );
}

export function MissingFocusIndicatorMockup() {
  return (
    <div className="card--sunken card stack-sm">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Pause menu — Tab through these buttons
      </p>
      <div className="btn-row">
        {["Play", "Settings", "Quit"].map((label) => (
          <button
            key={label}
            type="button"
            style={{
              padding: "8px 14px",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-bg-raised)",
              outline: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function UnlabeledIconButtonMockup() {
  // This is an illustrative visual only — not a real interactive control.
  // It was previously a real <button> marked aria-hidden="true": aria-hidden
  // hides an element from assistive tech but does not remove it from the
  // keyboard tab order, so a keyboard user could still tab onto a control
  // that screen readers were told to ignore — a silent, confusing stop.
  // Rendered as a <span> instead, it can never receive focus in the first
  // place. The visible "HUD control" text above it (not aria-hidden) is
  // this mockup's accessible description.
  return (
    <div className="card--sunken card stack-sm" aria-label="HUD control mockup">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        HUD control
      </p>
      <span className="btn btn-secondary" aria-hidden="true" style={{ display: "inline-flex" }}>
        ⚙
      </span>
    </div>
  );
}

export function QteNoPauseMockup() {
  return (
    <div className="card--sunken card stack-sm">
      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.4rem" }}>3…</p>
      <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
        Press the button before the countdown ends.
      </p>
    </div>
  );
}

export function AudioOnlyFootstepsMockup() {
  return (
    <div className="card--sunken card">
      <p className="text-muted" style={{ margin: 0, fontStyle: "italic" }}>
        (Footsteps approaching from behind — sound only, nothing shown on screen.)
      </p>
    </div>
  );
}

export function ClippedInventoryTextMockup() {
  return (
    <div className="card--sunken card">
      <div
        style={{
          width: 140,
          height: 26,
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: "1.3rem",
          border: "1px solid var(--color-border-strong)",
          padding: "2px 6px",
        }}
      >
        Inventory screen
      </div>
    </div>
  );
}

export function CameraShakeNoToggleMockup() {
  return (
    <div className="card--sunken card">
      <p className="text-muted" style={{ margin: 0 }}>
        Graphics settings: brightness, resolution, field of view. (No camera-shake setting listed.)
      </p>
    </div>
  );
}

export function UnremappableControlsMockup() {
  return (
    <div className="card--sunken card">
      <p className="text-muted" style={{ margin: 0 }}>
        Controls: Jump = Space, Attack = Left click, Block = Right click. (Fixed — no remap option.)
      </p>
    </div>
  );
}

export function SingleVolumeSliderMockup() {
  // A real <input type="range"> was here, but the readOnly attribute
  // doesn't do anything on a range input — browsers still let arrow keys
  // move it once tabbed to, so what was meant as a static illustration was
  // actually a live, unintentionally interactive control. This renders the
  // same look with plain, non-focusable divs instead: nothing to tab to,
  // nothing that changes. The visible "Master Volume" label (not
  // aria-hidden) is this mockup's accessible description.
  return (
    <div className="card--sunken card stack-sm" aria-label="Audio settings mockup">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Audio settings
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.85rem" }}>Master Volume</span>
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: "var(--color-border-strong)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "70%",
              height: 4,
              borderRadius: 2,
              background: "var(--color-teal-dark)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "70%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "var(--color-teal-dark)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function NoManualSaveMockup() {
  return (
    <div className="card--sunken card stack-sm">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Pause menu
      </p>
      <div className="btn-row" aria-hidden="true">
        {["Resume", "Save (autosave only)", "Quit"].map((label) => (
          <span
            key={label}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-bg-raised)",
              opacity: label.startsWith("Save") ? 0.5 : 1,
              fontSize: "0.85rem",
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>
        Last autosave: 2 minutes ago
      </p>
    </div>
  );
}

export function UnannouncedMenuChangesMockup() {
  return (
    <div className="card--sunken card stack-sm">
      <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
        Difficulty menu — Tab through these options (visual highlight only)
      </p>
      <div className="btn-row" aria-hidden="true">
        {["Easy", "Normal", "Hard"].map((label, i) => (
          <span
            key={label}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--color-border-strong)",
              background: i === 1 ? "var(--color-teal-dark)" : "var(--color-bg-raised)",
              color: i === 1 ? "#fff" : undefined,
              fontSize: "0.85rem",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export const BUG_MOCKUPS: Record<string, React.FC<BugMockupProps>> = {
  "color-only-status": ColorOnlyStatusMockup,
  "crowded-buttons": CrowdedButtonsMockup,
  "low-contrast-quest": LowContrastQuestMockup,
  "subtitle-no-scrim": SubtitleNoScrimMockup,
  "rapid-flash": RapidFlashMockup,
  "missing-focus": MissingFocusIndicatorMockup,
  "unlabeled-icon": UnlabeledIconButtonMockup,
  "qte-no-pause": QteNoPauseMockup,
  "audio-only-footsteps": AudioOnlyFootstepsMockup,
  "clipped-inventory-text": ClippedInventoryTextMockup,
  "camera-shake-no-toggle": CameraShakeNoToggleMockup,
  "unremappable-controls": UnremappableControlsMockup,
  "single-volume-slider": SingleVolumeSliderMockup,
  "no-manual-save": NoManualSaveMockup,
  "unannounced-menu-changes": UnannouncedMenuChangesMockup,
};
