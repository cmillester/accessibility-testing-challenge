import React from "react";
import { render } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { ChallengeStateProvider } from "../context/ChallengeStateContext";

/** Renders a component wrapped in the same providers the real app uses,
 * so hooks like useAppState/useChallengeState work in tests exactly as
 * they do at runtime. */
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AppStateProvider>
      <ChallengeStateProvider>{ui}</ChallengeStateProvider>
    </AppStateProvider>
  );
}

/** Stubs clientWidth/clientHeight on every element to a fixed size, since
 * jsdom never performs real layout. Lets tests simulate a specific
 * viewport/arena size (e.g. a 320px-wide phone). */
export function stubElementSize(width: number, height: number) {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    value: height,
  });
}
