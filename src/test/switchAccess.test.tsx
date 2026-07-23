import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { TargetChallengeEngine } from "../components/Game/TargetChallenge/TargetChallengeEngine";
import { getChallengeModeById } from "../data/challengeModes";
import { renderWithProviders, stubElementSize } from "./testUtils";

const switchMode = getChallengeModeById("switch-navigation")!;

describe("Switch Access hit detection", () => {
  it("only the box labeled Select counts as a hit; every other box is a miss", () => {
    renderWithProviders(
      <TargetChallengeEngine
        mode={switchMode}
        onRoundComplete={vi.fn()}
        onExitToOverview={vi.fn()}
        onSkipMode={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start round/i }));

    // Clicking a non-Select box must register a miss and must NOT advance
    // the round — this is the exact bug reported (every box previously
    // counted as a hit regardless of which one it was).
    const notSelect = screen.getAllByRole("button", { name: /not the select target/i })[0];
    fireEvent.click(notSelect);
    expect(screen.getByText("1/8")).toBeInTheDocument();
    expect(screen.getByText("Misses").previousElementSibling).toHaveTextContent("1");

    // Clicking the box actually labeled Select must register a hit and
    // advance the round.
    const selectBox = screen.getByRole("button", { name: "Select" });
    fireEvent.click(selectBox);
    expect(screen.getByText("2/8")).toBeInTheDocument();
  });

  it("keeps all five boxes present, unpositioned by fixed left offsets, and independently reachable at a 320px arena width", () => {
    stubElementSize(320, 260);

    renderWithProviders(
      <TargetChallengeEngine
        mode={switchMode}
        onRoundComplete={vi.fn()}
        onExitToOverview={vi.fn()}
        onSkipMode={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start round/i }));

    const boxes = [
      ...screen.getAllByRole("button", { name: "Select" }),
      ...screen.getAllByRole("button", { name: /not the select target/i }),
    ];
    expect(boxes).toHaveLength(5);

    // The original bug used fixed `left: 20 + i * 70` offsets on each box —
    // at 5 boxes and 56px width that overflows and gets clipped by the
    // arena's overflow:hidden well before 320px. The fix removes per-box
    // left offsets entirely in favor of a wrapping flex row, so no box
    // should carry an inline left style any more.
    boxes.forEach((box) => {
      expect(box.style.left).toBe("");
    });

    // Every one of the five boxes — not just the first — must be reachable
    // and must correctly register a hit only for Select, a miss otherwise.
    boxes.forEach((box) => {
      const isSelect = box.getAttribute("aria-label") === "Select";
      const roundBefore = screen.getByText(/^\d\/8$/).textContent;
      fireEvent.click(box);
      const roundAfter = screen.getByText(/^\d\/8$/).textContent;
      if (isSelect) {
        expect(roundAfter).not.toBe(roundBefore);
      } else {
        expect(roundAfter).toBe(roundBefore);
      }
    });
  });
});
