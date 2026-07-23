import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView or matchMedia — both are used by
// this app (focus/scroll management, reduced-motion checks) and need a
// harmless stand-in so component tests can render without throwing.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
