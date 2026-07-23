import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

describe("useLocalStorageState safety", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("falls back to in-memory state, with no throw, when localStorage is blocked", () => {
    vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() => {
      const { result } = renderHook(() => useLocalStorageState("test-key", { count: 0 }));
      const [state, , storageAvailable] = result.current;
      expect(state).toEqual({ count: 0 });
      expect(storageAvailable).toBe(false);
    }).not.toThrow();
  });

  it("ignores malformed saved JSON and falls back to the default, with no throw", () => {
    window.localStorage.setItem("test-key-2", "not valid json {{{");

    expect(() => {
      const { result } = renderHook(() => useLocalStorageState("test-key-2", { count: 0 }));
      const [state] = result.current;
      expect(state).toEqual({ count: 0 });
    }).not.toThrow();
  });

  it("ignores a saved value that isn't a plain object and falls back to the default", () => {
    window.localStorage.setItem("test-key-3", JSON.stringify("just a string"));

    const { result } = renderHook(() => useLocalStorageState("test-key-3", { count: 0 }));
    const [state] = result.current;
    expect(state).toEqual({ count: 0 });
  });

  it("repairs a malformed shape via the sanitize callback instead of trusting it as-is", () => {
    window.localStorage.setItem("test-key-4", JSON.stringify({ count: "not-a-number" }));

    const sanitize = (value: { count: number }) => ({
      count: typeof value.count === "number" ? value.count : 0,
    });

    const { result } = renderHook(() => useLocalStorageState("test-key-4", { count: 0 }, sanitize));
    const [state] = result.current;
    expect(state.count).toBe(0);
  });
});
