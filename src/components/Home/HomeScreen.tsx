import React from "react";
import { InfoButton } from "../common/InfoButton";
import { SPOT_THE_BUG_ABOUT_TEXT } from "../../data/challengeModes";

interface HomeScreenProps {
  onPlayChallenge: () => void;
  onPlaySpotTheBug: () => void;
  onViewYourResults: () => void;
  onViewAbout: () => void;
}

export function HomeScreen({
  onPlayChallenge,
  onPlaySpotTheBug,
  onViewYourResults,
  onViewAbout,
}: HomeScreenProps) {
  return (
    <div className="stack">
      <section className="stack prose">
        <span className="tag">An interactive accessibility QA game</span>
        <h1>Accessibility Testing Challenge</h1>
      </section>

      <section aria-label="Choose a game" className="grid grid--2">
        <div className="card stack-sm" style={{ borderColor: "var(--color-teal-dark)" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Accessibility Challenge</h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Select targets under different interaction conditions. Try the standard round first
            or choose any mode.
          </p>
          <div>
            <button type="button" className="btn btn-primary" onClick={onPlayChallenge}>
              Choose a mode
            </button>
          </div>
        </div>

        <div className="card stack-sm" style={{ borderColor: "var(--color-teal-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Spot the Accessibility Bug</h2>
            <InfoButton label="Spot the Bug" text={SPOT_THE_BUG_ABOUT_TEXT} />
          </div>
          <p className="text-muted" style={{ margin: 0 }}>
            Investigate game screens, find accessibility issues, and learn why they matter.
          </p>
          <div>
            <button type="button" className="btn btn-primary" onClick={onPlaySpotTheBug}>
              Play Spot the Bug
            </button>
          </div>
        </div>
      </section>

      <p className="text-muted" style={{ margin: 0 }}>
        Play in any order. Skip or stop whenever you want.
      </p>

      <section aria-label="More options" className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={onViewYourResults}>
          View Your Results
        </button>
        <button type="button" className="btn btn-secondary" onClick={onViewAbout}>
          About This Project
        </button>
      </section>
    </div>
  );
}
