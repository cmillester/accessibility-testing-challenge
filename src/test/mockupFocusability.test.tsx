import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { BUG_MOCKUPS } from "../components/Game/SpotTheBug/bugMockups";
import { BugScenarioCard } from "../components/Game/SpotTheBug/BugScenarioCard";
import { BUG_SCENARIOS } from "../data/bugScenarios";
import { renderWithProviders } from "./testUtils";

// aria-hidden="true" removes an element from the accessibility tree, but it
// does NOT remove it from the keyboard tab order — a native <button> or
// <input> marked aria-hidden is still reachable by Tab, just silently, with
// nothing announced. That combination (previously present in the
// unlabeled-icon and single-volume-slider mockups) is exactly what these
// tests guard against.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), audio[controls], video[controls]';

function focusableDescendants(root: ParentNode): Element[] {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR));
}

describe("Spot the Bug mockups never trap keyboard focus inside aria-hidden content", () => {
  Object.entries(BUG_MOCKUPS).forEach(([mockupId, Mockup]) => {
    it(`${mockupId}: no focusable element is or contains an aria-hidden="true" subtree`, () => {
      const { container } = renderWithProviders(<Mockup paused={false} />);

      const hiddenRoots = Array.from(
        container.querySelectorAll('[aria-hidden="true"]')
      ) as HTMLElement[];

      hiddenRoots.forEach((hiddenRoot) => {
        expect(hiddenRoot.matches(FOCUSABLE_SELECTOR)).toBe(false);
        expect(focusableDescendants(hiddenRoot)).toHaveLength(0);
      });
    });
  });

  it("the unlabeled-icon mockup contains no natively focusable element at all (it's a visual only)", () => {
    const Mockup = BUG_MOCKUPS["unlabeled-icon"];
    const { container } = renderWithProviders(<Mockup paused={false} />);
    expect(focusableDescendants(container)).toHaveLength(0);
  });

  it("the single-volume-slider mockup contains no natively focusable element at all (it's a visual only, not a working slider)", () => {
    const Mockup = BUG_MOCKUPS["single-volume-slider"];
    const { container } = renderWithProviders(<Mockup paused={false} />);
    expect(focusableDescendants(container)).toHaveLength(0);
  });
});

describe("Keyboard tab order skips over illustrative mockup content", () => {
  it.each(["unlabeled-icon", "single-volume-slider"])(
    "tabbing through the %s scenario only ever focuses a real answer/skip control",
    async (scenarioId) => {
      const scenario = BUG_SCENARIOS.find((s) => s.id === scenarioId)!;
      const user = userEvent.setup();
      renderWithProviders(
        <BugScenarioCard scenario={scenario} onAnswered={() => {}} onNext={() => {}} onSkip={() => {}} />
      );

      const expectedStops = screen.getAllByRole("button");
      expect(expectedStops.length).toBeGreaterThan(0);

      // Tab all the way through (with a couple of extra presses past the
      // last real control) and confirm focus only ever lands on one of the
      // real, expected controls — never silently on decorative mockup
      // markup that was supposed to be inert.
      for (let i = 0; i < expectedStops.length + 2; i++) {
        await user.tab();
        if (document.activeElement && document.activeElement !== document.body) {
          expect(expectedStops).toContain(document.activeElement);
        }
      }
    }
  );
});
