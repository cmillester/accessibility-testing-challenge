import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { SpotTheBugFlow } from "../components/Game/SpotTheBug/SpotTheBugFlow";
import { renderWithProviders } from "./testUtils";

// Pin the scenario pool to a single item — the rapid-flash one — so this
// integration test (SpotTheBugFlow -> BugScenarioCard -> RapidFlashMockup)
// doesn't depend on predicting what the Fisher-Yates shuffle in
// SpotTheBugFlow happens to pick. A one-item pool always shows that item.
vi.mock("../data/bugScenarios", () => ({
  BUG_SCENARIOS: [
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
  ],
}));

function getFlashSquare(container: HTMLElement) {
  // Not a plain [aria-hidden="true"] selector: the InfoButton icon in the
  // header above is also aria-hidden and would match first.
  return container.querySelector(".rapid-flash-indicator") as HTMLElement;
}

describe("RapidFlashMockup gating through the real Spot the Bug flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("animates normally before an answer is given", () => {
    const { container } = renderWithProviders(
      <SpotTheBugFlow onExit={vi.fn()} onPlayChallenge={vi.fn()} onReplayMissed={vi.fn()} />
    );
    const square = getFlashSquare(container);
    const before = square.style.opacity;
    // 500ms, not a clean multiple of the 400ms toggle interval — advancing
    // by exactly one or two full periods would land back on the same
    // opacity by coincidence and give a false pass/fail either way.
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(square.style.opacity).not.toBe(before);
  });

  it("freezes once feedback is displayed for an answered scenario", () => {
    const { container } = renderWithProviders(
      <SpotTheBugFlow onExit={vi.fn()} onPlayChallenge={vi.fn()} onReplayMissed={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /photosensitive/i }));
    expect(screen.getByText("Nice catch.")).toBeInTheDocument(); // feedback panel is up

    const square = getFlashSquare(container);
    const afterAnswerOpacity = square.style.opacity;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(square.style.opacity).toBe(afterAnswerOpacity);
  });

  it("freezes while the Exit-confirmation dialog is open", () => {
    const { container } = renderWithProviders(
      <SpotTheBugFlow onExit={vi.fn()} onPlayChallenge={vi.fn()} onReplayMissed={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /exit game/i }));
    expect(screen.getByText("Exit this round?")).toBeInTheDocument();

    const square = getFlashSquare(container);
    const before = square.style.opacity;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(square.style.opacity).toBe(before);
  });
});
