import React, { useMemo, useState } from "react";
import { BugScenario } from "../../../types";
import { BUG_MOCKUPS } from "./bugMockups";
import { LiveRegion } from "../../common/LiveRegion";
import { useAnnouncer } from "../../../hooks/useAnnouncer";

function shuffleOptions(scenario: BugScenario): { options: string[]; correctIndex: number } {
  const order = [0, 1, 2];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    options: order.map((i) => scenario.options[i]),
    correctIndex: order.indexOf(scenario.correctIndex),
  };
}

interface BugScenarioCardProps {
  scenario: BugScenario;
  paused?: boolean;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function BugScenarioCard({
  scenario,
  paused = false,
  onAnswered,
  onNext,
  onSkip,
}: BugScenarioCardProps) {
  const shuffled = useMemo(() => shuffleOptions(scenario), [scenario]);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const { message, announce } = useAnnouncer();

  const Mockup = BUG_MOCKUPS[scenario.mockupId];
  const answered = pickedIndex !== null;
  const correct = answered && pickedIndex === shuffled.correctIndex;

  function handlePick(index: number) {
    if (answered || paused) return;
    setPickedIndex(index);
    const wasCorrect = index === shuffled.correctIndex;
    onAnswered(wasCorrect);
    announce(wasCorrect ? "Correct." : "Not quite.");
  }

  return (
    <div className="stack" style={{ opacity: paused ? 0.6 : 1 }}>
      <LiveRegion message={message} />
      <p className="text-muted" style={{ margin: 0 }}>{scenario.category}</p>
      <p style={{ margin: 0, fontWeight: 600 }}>What's the accessibility issue with this screen?</p>

      {/* The mockup must stay static once feedback is showing, not just
          while the round itself is paused — answered covers that case. */}
      <div className="card">{Mockup ? <Mockup paused={paused || answered} /> : null}</div>

      {!answered && (
        <div className="stack-sm" role="group" aria-label="Answer choices">
          {shuffled.options.map((option, index) => (
            <button
              key={option}
              type="button"
              className="choice-button"
              disabled={paused}
              onClick={() => handlePick(index)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <div className="stack-sm" role="group" aria-label="Answer choices">
          {shuffled.options.map((option, index) => (
            <button
              key={option}
              type="button"
              disabled
              className={`choice-button ${
                index === shuffled.correctIndex
                  ? "is-correct"
                  : index === pickedIndex
                  ? "is-incorrect"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <div className="stack">
          <div
            className="feedback-panel stack-sm"
            style={{ borderColor: correct ? "var(--color-success)" : "var(--color-danger)" }}
          >
            <p style={{ margin: 0, fontWeight: 700 }}>{correct ? "Nice catch." : "Not quite."}</p>
            <p style={{ margin: 0 }}>{scenario.explain}</p>
          </div>
          <div>
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Next scenario
            </button>
          </div>
        </div>
      )}

      {!answered && (
        <div>
          <button type="button" className="btn-tertiary" onClick={onSkip} disabled={paused}>
            Skip this scenario
          </button>
        </div>
      )}
    </div>
  );
}
