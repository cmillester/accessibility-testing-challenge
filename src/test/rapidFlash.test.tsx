import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { RapidFlashMockup } from "../components/Game/SpotTheBug/bugMockups";
import { AppStateProvider } from "../context/AppStateContext";

function getFlashSquare(container: HTMLElement) {
  // Not a plain [aria-hidden="true"] selector: the InfoButton icon next to
  // "Spot the Bug" is also aria-hidden and would be matched first, giving a
  // false pass/fail unrelated to the actual flashing element.
  return container.querySelector(".rapid-flash-indicator") as HTMLElement;
}

describe("RapidFlashMockup safety behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays static while paused", () => {
    const { container } = render(
      <AppStateProvider>
        <RapidFlashMockup paused />
      </AppStateProvider>
    );
    const square = getFlashSquare(container);
    const before = square.style.opacity;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(square.style.opacity).toBe(before);
  });

  it("animates when not paused and no reduced-motion setting is active", () => {
    const { container } = render(
      <AppStateProvider>
        <RapidFlashMockup paused={false} />
      </AppStateProvider>
    );
    const square = getFlashSquare(container);
    const before = square.style.opacity;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(square.style.opacity).not.toBe(before);
  });

  it("stays static when the tab is hidden", () => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    const { container } = render(
      <AppStateProvider>
        <RapidFlashMockup paused={false} />
      </AppStateProvider>
    );
    document.dispatchEvent(new Event("visibilitychange"));
    const square = getFlashSquare(container);
    const before = square.style.opacity;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(square.style.opacity).toBe(before);
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
  });
});
