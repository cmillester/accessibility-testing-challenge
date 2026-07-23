import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { SpotTheBugFlow } from "../components/Game/SpotTheBug/SpotTheBugFlow";
import { renderWithProviders } from "./testUtils";

describe("Spot the Bug active-investigation timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("freezes the displayed time immediately after an answer is chosen", () => {
    const { container } = renderWithProviders(
      <SpotTheBugFlow onExit={vi.fn()} onPlayChallenge={vi.fn()} onReplayMissed={vi.fn()} />
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    const timeBeforeAnswer = screen.getByText(/^\d+\.\d+s$/).textContent;
    expect(timeBeforeAnswer).not.toBe("0.0s");

    const firstChoice = container.querySelector(".choice-button") as HTMLElement;
    expect(firstChoice).toBeTruthy();
    fireEvent.click(firstChoice);

    const timeAfterAnswer = screen.getByText(/^\d+\.\d+s$/).textContent;

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const timeWhileReadingFeedback = screen.getByText(/^\d+\.\d+s$/).textContent;

    expect(timeWhileReadingFeedback).toBe(timeAfterAnswer);
  });
});
