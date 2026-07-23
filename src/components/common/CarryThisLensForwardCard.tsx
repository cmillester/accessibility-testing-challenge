import React from "react";

// A short, always-visible takeaway — not a required stage, not a gate on
// anything. Shown after either game finishes a run and on Your Results, so
// it's immediately visible without an extra click, and reachable the same
// way as everything else on the page: by heading navigation. Deeper
// material (the full Minimum Bar requirements, testing tools, and a
// finding-reporting process) belongs in the portfolio case study or a
// linked public testing checklist, not here.
const LENS_TEXT =
  "Accessibility testing means looking at every interaction and asking whether people can perceive it, understand it, reach it, and complete it using the controls and settings that work for them. Clear focus, readable text, flexible timing, and alternatives to color, sound, or motion can determine whether someone can play. Test these choices early, revisit them throughout development, and include disabled players and accessibility specialists in the process.";

export function CarryThisLensForwardCard() {
  return (
    <div className="card stack-sm" style={{ borderColor: "var(--color-teal-dark)" }}>
      <h2 style={{ margin: 0, fontSize: "1rem" }}>Carry this lens forward</h2>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>{LENS_TEXT}</p>
    </div>
  );
}
