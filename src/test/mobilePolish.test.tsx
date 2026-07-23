import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { InfoButton } from "../components/common/InfoButton";
import { RoundStatusBar } from "../components/common/RoundStatusBar";
import { Header } from "../components/layout/Header";

function mockNarrowMatchMedia(matches: boolean) {
  const listeners: Array<() => void> = [];
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: (fn: () => void) => listeners.push(fn),
    removeListener: () => {},
    addEventListener: (_: string, fn: () => void) => listeners.push(fn),
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("mobile polish — scratch verification (not part of shipped suite)", () => {
  afterEach(() => {
    mockNarrowMatchMedia(false);
  });

  it("InfoButton presents a viewport-clamped modal dialog at narrow widths, closes on Escape, and returns focus", () => {
    mockNarrowMatchMedia(true);
    render(<InfoButton label="Standard" text="Some helpful context." />);
    const trigger = screen.getByRole("button", { name: "About Standard" });
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "About Standard" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.className).toContain("info-popover--sheet");
    expect(screen.getByText("Some helpful context.")).toBeInTheDocument();
    // Visible close control present.
    expect(within(dialog).getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("InfoButton closes on backdrop activation at narrow widths and returns focus to the info button", () => {
    mockNarrowMatchMedia(true);
    render(<InfoButton label="Standard" text="Some helpful context." />);
    const trigger = screen.getByRole("button", { name: "About Standard" });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "About Standard" })).toBeInTheDocument();

    const backdrop = document.querySelector(".info-popover-backdrop");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("InfoButton keeps the original non-modal popover at normal widths", () => {
    mockNarrowMatchMedia(false);
    render(<InfoButton label="Standard" text="Some helpful context." />);
    fireEvent.click(screen.getByRole("button", { name: "About Standard" }));
    const group = screen.getByRole("group", { name: "About Standard" });
    expect(group).not.toHaveAttribute("aria-modal");
    expect(group.className).not.toContain("info-popover--sheet");
  });

  it("RoundStatusBar shows the full inline stat row at normal widths (matches pre-existing behavior)", () => {
    mockNarrowMatchMedia(false);
    render(
      <RoundStatusBar
        stageStat={{ label: "Round", value: "3/8" }}
        stageLabel="Round 3 of 8"
        primary={{ label: "Time", value: "4.2s" }}
        secondary={[{ label: "Misses", value: "1" }]}
      />
    );
    expect(screen.getByText("3/8")).toBeInTheDocument();
    expect(screen.getByText("Misses")).toBeInTheDocument();
    expect(screen.queryByText("Round 3 of 8")).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Round details" })).not.toBeInTheDocument();
  });

  it("RoundStatusBar collapses secondary stats into an accessible disclosure at narrow widths, preserving the same values", () => {
    mockNarrowMatchMedia(true);
    render(
      <RoundStatusBar
        stageStat={{ label: "Round", value: "3/8" }}
        stageLabel="Round 3 of 8"
        primary={{ label: "Time", value: "4.2s" }}
        secondary={[{ label: "Misses", value: "1" }]}
      />
    );
    expect(screen.getByText("Round 3 of 8")).toBeInTheDocument();
    expect(screen.getByText("4.2s")).toBeInTheDocument();
    // Secondary stat text exists in the DOM (inside <details>) even before
    // it's expanded — testing-library queries don't filter on the native
    // collapsed state, matching how this was verified for the desktop view.
    const summary = screen.getByText("Round details");
    expect(summary.closest("details")).not.toBeNull();
    expect(screen.getByText("Misses")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("Header nav is keyboard reachable in source order: title, Home, Your Results, About", () => {
    render(<Header onNavigate={() => {}} currentScreen="home" />);
    const buttons = screen.getAllByRole("button");
    const labels = buttons.map((b) => b.textContent);
    expect(labels).toEqual(["Accessibility Testing Challenge", "Home", "Your Results", "About"]);
    // Current page state still visible to assistive tech.
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });
});
