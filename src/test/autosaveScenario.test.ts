import { describe, it, expect } from "vitest";
import { BUG_SCENARIOS } from "../data/bugScenarios";

describe("Autosave-only progress scenario is internally consistent", () => {
  const scenario = BUG_SCENARIOS.find((s) => s.id === "no-manual-save")!;

  it("exists and is framed as autosave-only progress", () => {
    expect(scenario).toBeDefined();
    expect(scenario.category).toBe("Autosave-only progress");
  });

  it("the correct answer says manual saving doesn't exist, not that autosave overwrites it", () => {
    const correctOption = scenario.options[scenario.correctIndex];
    // The bug this fixes: the old copy claimed in the same breath that
    // manual saving "isn't available" AND that autosave "can overwrite a
    // manual save" — those can't both be true. The correct option should
    // describe the absence of manual saving, not an overwrite of something
    // that (by its own wording) doesn't exist.
    expect(correctOption.toLowerCase()).toContain("no manual save");
    expect(correctOption.toLowerCase()).not.toContain("overwrite");
  });

  it("the feedback explains the need for manual saving and predictable autosave, without the old contradiction", () => {
    const explainLower = scenario.explain.toLowerCase();
    expect(explainLower).toContain("stop unexpectedly");
    expect(explainLower).toContain("manual saving");
    expect(explainLower).toContain("autosave");
    expect(explainLower).not.toContain("overwrite");
  });
});
