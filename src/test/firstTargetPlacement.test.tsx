import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { TargetChallengeEngine } from "../components/Game/TargetChallenge/TargetChallengeEngine";
import { getChallengeModeById } from "../data/challengeModes";
import { renderWithProviders, stubElementSize } from "./testUtils";

const standardMode = getChallengeModeById("standard")!;

describe("First target placement at narrow widths", () => {
  it.each([
    [320, 260],
    [390, 260],
  ])("keeps the first target inside a %ipx-wide arena", (width, height) => {
    stubElementSize(width, height);

    renderWithProviders(
      <TargetChallengeEngine
        mode={standardMode}
        onRoundComplete={vi.fn()}
        onExitToOverview={vi.fn()}
        onSkipMode={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start round/i }));

    const target = screen.getByRole("button", { name: "Target" }) as HTMLElement;
    const left = parseFloat(target.style.left);
    const top = parseFloat(target.style.top);
    const size = 44; // Standard mode's target size

    // Before the fix, an unmounted arena measured 0 and fell back to a
    // guessed 600px width, so the target could land outside a genuinely
    // narrow (320–390px) viewport. It must now always fit the real,
    // measured arena.
    expect(left).toBeGreaterThanOrEqual(0);
    expect(left).toBeLessThanOrEqual(width - size);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThanOrEqual(height - size);
  });
});
