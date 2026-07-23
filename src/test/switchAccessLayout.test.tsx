import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { screen, fireEvent } from "@testing-library/react";
import { TargetChallengeEngine } from "../components/Game/TargetChallenge/TargetChallengeEngine";
import { getChallengeModeById } from "../data/challengeModes";
import { renderWithProviders, stubElementSize } from "./testUtils";

// Vitest's test.css:false setting (this project disables CSS processing
// for component tests, since jsdom has no layout engine to make it
// meaningful) also short-circuits ?raw CSS imports to an empty string, so
// the "stylesheet no longer clips wrapped rows" tests below read the file
// directly from disk with Node's fs instead.

const switchMode = getChallengeModeById("switch-navigation")!;

// jsdom doesn't run a real layout engine, so "does this actually stay
// visible at 80px" can't be measured directly. Instead this test asserts
// the two things that concretely reproduce or prevent the clipping bug:
// (1) the component never applies a fixed inline height that would fight
// the CSS fix, at any of the three required widths, and all five controls
// stay mounted and reachable regardless of width; (2) the stylesheet
// itself no longer pins Switch Access to a fixed height + overflow:hidden
// arena, which is the literal mechanism that clipped rows before.
describe("Switch Access layout does not clip controls at narrow widths", () => {
  it.each([320, 128, 80])(
    "keeps all five controls mounted, reachable, and free of any fixed inline height at a %ipx-wide arena",
    (width) => {
      stubElementSize(width, 260);

      const { container } = renderWithProviders(
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
      boxes.forEach((box) => {
        expect(box).toBeVisible();
        // No inline height/left is ever set on a box — sizing and wrapping
        // are entirely the stylesheet's job, so a narrow width can't be
        // fought with a leftover fixed pixel value from the component.
        expect(box.style.height).toBe("");
        expect(box.style.left).toBe("");
      });

      // The arena that hosts Switch Access must opt into the variant that
      // sizes to its wrapped content — the plain, fixed-260px/overflow:
      // hidden arena every other mode uses is exactly what clipped rows
      // beyond the fourth or fifth control.
      const arena = container.querySelector(".game-arena--switch");
      expect(arena).not.toBeNull();
      expect(arena?.getAttribute("style")).not.toMatch(/height/);

      const row = container.querySelector(".game-arena__switch-row");
      expect(row).not.toBeNull();
      expect(row?.getAttribute("style")).toBeNull();
    }
  );
});

describe("Switch Access stylesheet no longer clips wrapped rows", () => {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  const css = fs.readFileSync(path.resolve(testDir, "../styles/global.css"), "utf8");

  function ruleBody(selector: string): string {
    const escaped = selector.replace(/[.]/g, "\\.");
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    if (!match) throw new Error(`Rule ${selector} not found in global.css`);
    return match[1];
  }

  it(".game-arena--switch sizes to its content instead of clipping it", () => {
    const body = ruleBody(".game-arena--switch");
    // The bug was a fixed height combined with overflow:hidden. Either one
    // alone would be enough to keep this safe going forward — assert both
    // are actually gone from this variant.
    expect(body).not.toMatch(/overflow:\s*hidden/);
    expect(body).toMatch(/height:\s*auto/);
  });

  it(".game-arena__switch-row is in normal flow, not pinned to the arena's box", () => {
    const body = ruleBody(".game-arena__switch-row");
    // position:absolute + inset:0 pins the row to whatever box the arena
    // already has — which defeats an auto-height arena, since there'd be
    // nothing left in normal flow to make it grow. The row has to be
    // normal-flow content for the auto-height fix to do anything.
    expect(body).not.toMatch(/position:\s*absolute/);
  });

  it("each Switch Access control keeps its original 44px minimum height", () => {
    const body = ruleBody(".game-arena__switchbox");
    expect(body).toMatch(/height:\s*44px/);
  });
});
