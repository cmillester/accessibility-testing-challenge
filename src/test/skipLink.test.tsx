import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("Skip Link vs. the hash router", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("moves focus to #main-content without changing the current route", () => {
    render(<App />);

    // Leave Home for an in-game screen first — this is where the original
    // bug mattered: activating the skip link from anywhere but Home used to
    // set location.hash to "#main-content", which the router read as an
    // unknown route and resolved to Home, silently ejecting the player from
    // whatever they were doing.
    fireEvent.click(screen.getByRole("button", { name: /choose a mode/i }));
    expect(screen.getByRole("heading", { name: "Accessibility Challenge" })).toBeInTheDocument();

    const hashBeforeSkip = window.location.hash;

    fireEvent.click(screen.getByText("Skip to main content"));

    // Still on the Challenge hub, and the hash — the router's source of
    // truth — is unchanged.
    expect(screen.getByRole("heading", { name: "Accessibility Challenge" })).toBeInTheDocument();
    expect(window.location.hash).toBe(hashBeforeSkip);
    expect(document.activeElement).toBe(document.getElementById("main-content"));
  });
});
