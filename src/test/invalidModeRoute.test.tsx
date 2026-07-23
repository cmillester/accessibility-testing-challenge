import { describe, it, expect, vi } from "vitest";
import { ModePage } from "../components/Game/TargetChallenge/ModePage";
import { renderWithProviders } from "./testUtils";

describe("Invalid challenge-mode route", () => {
  it("redirects to the mode menu instead of rendering an empty screen", () => {
    const onReturnToOverview = vi.fn();

    const { container } = renderWithProviders(
      <ModePage
        modeId="not-a-real-mode"
        onReturnToOverview={onReturnToOverview}
        onPlaySpotTheBug={vi.fn()}
      />
    );

    expect(onReturnToOverview).toHaveBeenCalledTimes(1);
    expect(container).toBeEmptyDOMElement();
  });
});
