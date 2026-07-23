import React from "react";
import { InfoButton } from "../common/InfoButton";
import { SPOT_THE_BUG_ABOUT_TEXT } from "../../data/challengeModes";

interface HomeScreenProps {
  onPlayChallenge: () => void;
  onPlaySpotTheBug: () => void;
  onViewYourResults: () => void;
  onViewAbout: () => void;
}

// Shown in "What you'll practice" — three compact, scannable items rather
// than a long paragraph.
const PRACTICE_ITEMS: { title: string; detail: string }[] = [
  {
    title: "Recognize barriers",
    detail: "Explore issues involving vision, color, motion, audio, timing, navigation, and controls.",
  },
  {
    title: "Understand player impact",
    detail: "Experience how interface and interaction decisions affect different ways of playing.",
  },
  {
    title: "Apply practical improvements",
    detail: "Learn questions and considerations you can carry into future testing and product work.",
  },
];

const SCOPE_ITEMS = [
  "5 interaction modes",
  "15 accessibility scenarios",
  "Keyboard accessible",
  "Reduced-motion support",
  "Responsive design",
];

// Purely decorative previews — abstract shapes only (no text, no imitation
// of any real interface) so they can never resemble a copyrighted game
// screen. Static: no animation, no motion of any kind.
function ChallengeCardPreview() {
  return (
    <svg
      className="card-preview"
      viewBox="0 0 180 100"
      width="180"
      height="100"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="178"
        height="98"
        rx="12"
        fill="var(--color-bg-sunken)"
        stroke="var(--color-border)"
      />
      <circle cx="34" cy="30" r="8" fill="var(--color-border-strong)" />
      <circle cx="146" cy="26" r="7" fill="var(--color-border-strong)" />
      <circle cx="150" cy="72" r="8" fill="var(--color-border-strong)" />
      <circle cx="30" cy="74" r="7" fill="var(--color-border-strong)" />
      <circle cx="90" cy="50" r="9" fill="var(--color-teal-dark)" />
      <circle
        cx="90"
        cy="50"
        r="16"
        fill="none"
        stroke="var(--color-teal-dark)"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
}

function SpotBugCardPreview() {
  return (
    <svg
      className="card-preview"
      viewBox="0 0 180 100"
      width="180"
      height="100"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="178"
        height="98"
        rx="12"
        fill="var(--color-bg-sunken)"
        stroke="var(--color-border)"
      />
      <rect x="14" y="14" width="60" height="8" rx="4" fill="var(--color-border-strong)" />
      <rect x="14" y="30" width="100" height="6" rx="3" fill="var(--color-border-strong)" opacity="0.7" />
      <rect x="14" y="42" width="80" height="6" rx="3" fill="var(--color-border-strong)" opacity="0.7" />
      <rect
        x="14"
        y="62"
        width="40"
        height="16"
        rx="4"
        fill="var(--color-bg-raised)"
        stroke="var(--color-border-strong)"
      />
      <rect
        x="62"
        y="62"
        width="40"
        height="16"
        rx="4"
        fill="var(--color-bg-raised)"
        stroke="var(--color-border-strong)"
      />
      {/* The one flagged barrier: a dashed warm-accent outline, no label. */}
      <rect
        x="124"
        y="60"
        width="40"
        height="20"
        rx="4"
        fill="var(--color-bg-raised)"
        stroke="var(--color-accent-warm)"
        strokeWidth="2"
        strokeDasharray="3 2"
      />
      <circle cx="144" cy="70" r="4" fill="var(--color-accent-warm)" />
    </svg>
  );
}

export function HomeScreen({
  onPlayChallenge,
  onPlaySpotTheBug,
  onViewYourResults,
  onViewAbout,
}: HomeScreenProps) {
  return (
    <div className="stack">
      {/* 1. Hero */}
      <section className="stack-sm prose">
        <span className="tag">AN INTERACTIVE ACCESSIBILITY QA GAME</span>
        <h1>Test the game. Find the barriers. Build your accessibility lens.</h1>
        <p style={{ fontSize: "1.05rem", margin: 0 }}>
          Accessibility barriers can hide inside experiences that technically work. Experience
          different interaction conditions, investigate realistic game screens, and learn to
          recognize issues traditional functional testing can miss.
        </p>
      </section>

      {/* 2. Two game choices */}
      <section aria-label="Choose a game" className="grid grid--2">
        <div className="card game-card">
          <ChallengeCardPreview />
          <div className="game-card__body stack-sm">
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Accessibility Challenge</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              Experience how different interaction conditions can affect a target-selection game.
            </p>
          </div>
          <div className="game-card__cta">
            <button type="button" className="btn btn-primary" onClick={onPlayChallenge}>
              Choose a mode
            </button>
          </div>
        </div>

        <div className="card game-card">
          <SpotBugCardPreview />
          <div className="game-card__body stack-sm">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Spot the Accessibility Bug</h2>
              <InfoButton label="Spot the Bug" text={SPOT_THE_BUG_ABOUT_TEXT} />
            </div>
            <p className="text-muted" style={{ margin: 0 }}>
              Investigate game interfaces, identify accessibility barriers, and learn why they
              matter.
            </p>
          </div>
          <div className="game-card__cta">
            <button type="button" className="btn btn-primary" onClick={onPlaySpotTheBug}>
              Start spotting bugs
            </button>
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center" }}>
        <button type="button" className="btn-tertiary" onClick={onViewYourResults}>
          View your results
        </button>
      </div>

      {/* 3. Project-scope strip */}
      <ul className="scope-strip" aria-label="Project scope">
        {SCOPE_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* 4. What you'll practice */}
      <section aria-label="What you'll practice" className="stack-sm">
        <h2 style={{ fontSize: "1.1rem" }}>What you'll practice</h2>
        <div className="grid grid--3">
          {PRACTICE_ITEMS.map((item) => (
            <div key={item.title} className="practice-item">
              <h3 style={{ fontSize: "1rem", margin: "0 0 var(--space-2)" }}>{item.title}</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Context about simulations — quiet, visually secondary */}
      <p className="simulation-note">
        This experience introduces an accessibility lens through simplified simulations and game
        scenarios. Simulations cannot represent the full experience of living with a disability,
        and accessibility involves a wide range of permanent, temporary, situational, and changing
        needs.
      </p>

      {/* 6. Compact About this project */}
      <section aria-label="About this project" className="stack-sm">
        <h2 style={{ fontSize: "1.05rem", margin: 0 }}>About this project</h2>
        <p style={{ margin: 0 }}>
          Designed and built by C. Lin as an interactive accessibility education project for QA
          professionals, game developers, designers, and anyone interested in more inclusive
          digital experiences.
        </p>
        <div>
          <button type="button" className="btn btn-secondary" onClick={onViewAbout}>
            Read the project details
          </button>
        </div>
      </section>
    </div>
  );
}
