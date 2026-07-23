import { describe, it, expect } from "vitest";
import { hashToRoute, routeToHash } from "../routing";

describe("hashToRoute malformed-input safety", () => {
  it("falls back to Home instead of throwing on a malformed percent-encoded hash", () => {
    // A stray "%" (or any incomplete percent-escape) makes decodeURIComponent
    // throw a URIError. Before the fix, that decode ran outside the
    // function's try/catch, so a hand-edited or corrupted hash like this
    // crashed routing instead of safely falling back to Home.
    expect(() => hashToRoute("#/challenge/mode/%")).not.toThrow();
    expect(hashToRoute("#/challenge/mode/%")).toEqual({ screen: "home" });
  });

  it("falls back to Home for another malformed escape shape", () => {
    expect(() => hashToRoute("#/%E0%A4%A")).not.toThrow();
    expect(hashToRoute("#/%E0%A4%A")).toEqual({ screen: "home" });
  });

  it("still parses well-formed, validly-encoded routes normally", () => {
    expect(hashToRoute("#/challenge/mode/reduced-clarity")).toEqual({
      screen: "challenge-mode",
      modeId: "reduced-clarity",
    });
    expect(hashToRoute("#/spot-the-bug")).toEqual({ screen: "spot-the-bug", onlyMissed: false });
    expect(hashToRoute("")).toEqual({ screen: "home" });
  });

  it("round-trips routeToHash back through hashToRoute", () => {
    const route = { screen: "challenge-mode" as const, modeId: "color-dependent" };
    expect(hashToRoute(routeToHash(route))).toEqual(route);
  });
});
