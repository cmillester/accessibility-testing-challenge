import React from "react";

interface AboutScreenProps {
  onBackHome: () => void;
}

export function AboutScreen({ onBackHome }: AboutScreenProps) {
  return (
    <div className="stack prose">
      <div>
        <button type="button" className="btn-tertiary" onClick={onBackHome}>
          ← Back to Home
        </button>
      </div>
      <h1>About This Project</h1>
      <p style={{ fontSize: "1.05rem", color: "var(--color-text-muted)" }}>
        Accessibility Testing Challenge — an interactive accessibility QA game.
      </p>
      <p style={{ margin: 0 }}>
        Designed and built by C. Lin as an interactive accessibility education project for QA
        professionals, game developers, designers, and anyone interested in more inclusive digital
        experiences.
      </p>

      <section className="stack-sm">
        <h2 style={{ fontSize: "1.15rem" }}>Why this exists</h2>
        <p>
          This project was created to help teams move from general
          accessibility awareness to practical testing habits. It's two
          small, optional games — the Accessibility Challenge and Spot the
          Accessibility Bug — that can be played in any order, skipped, or
          replayed.
        </p>
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: "1.15rem" }}>Who it is for</h2>
        <ul>
          <li>QA and software testers</li>
          <li>Designers</li>
          <li>Developers</li>
          <li>Product and program teams</li>
          <li>Anyone learning how to identify digital accessibility barriers</li>
        </ul>
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: "1.15rem" }}>What this is — and isn't</h2>
        <p>
          These activities introduce selected interaction and testing
          concepts through simplified simulations. Simulations cannot
          represent the full range of disability experiences, and
          accessibility involves a wide range of permanent, temporary,
          situational, and changing needs.
        </p>
        <ul>
          <li>Educational experience.</li>
          <li>Does not certify accessibility compliance.</li>
          <li>Does not replace WCAG reviews.</li>
          <li>Does not replace assistive-technology testing.</li>
          <li>Does not replace dedicated accessibility test cases.</li>
          <li>Does not replace research with disabled people.</li>
        </ul>
      </section>
    </div>
  );
}
