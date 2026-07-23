import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { TargetChallengeEngine } from "../components/Game/TargetChallenge/TargetChallengeEngine";
import { getChallengeModeById } from "../data/challengeModes";
import { renderWithProviders } from "./testUtils";

const standardMode = getChallengeModeById("standard")!;

describe("Exit confirmation", () => {
  it("Keep playing closes the dialog, resumes the round, and returns focus to the button that opened it", () => {
    const onExitToOverview = vi.fn();
    renderWithProviders(
      <TargetChallengeEngine
        mode={standardMode}
        onRoundComplete={vi.fn()}
        onExitToOverview={onExitToOverview}
        onSkipMode={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start round/i }));

    const exitButton = screen.getByRole("button", { name: "Exit game" });
    fireEvent.click(exitButton);

    expect(screen.getByText("Exit this round?")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument(); // paused while the dialog is open

    fireEvent.click(screen.getByRole("button", { name: /keep playing/i }));

    expect(screen.queryByText("Exit this round?")).not.toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument(); // back to running
    expect(document.activeElement).toBe(exitButton);
    expect(onExitToOverview).not.toHaveBeenCalled();
  });

  it("Exit round calls onExitToOverview", () => {
    const onExitToOverview = vi.fn();
    renderWithProviders(
      <TargetChallengeEngine
        mode={standardMode}
        onRoundComplete={vi.fn()}
        onExitToOverview={onExitToOverview}
        onSkipMode={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start round/i }));
    fireEvent.click(screen.getByRole("button", { name: "Exit game" }));
    fireEvent.click(screen.getByRole("button", { name: /^exit round$/i }));

    expect(onExitToOverview).toHaveBeenCalledTimes(1);
  });
});
