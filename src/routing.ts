// Simple hash-based routing. This app is a single static HTML file with
// no server-side routing support, so real URL paths would 404 on refresh
// with most static hosts. Hash fragments always resolve to the same
// index.html, so directly loading or refreshing any nested URL renders
// the right screen instead of silently falling back to Home.

export type Route =
  | { screen: "home" }
  | { screen: "challenge" }
  | { screen: "challenge-mode"; modeId: string }
  | { screen: "spot-the-bug"; onlyMissed?: boolean }
  | { screen: "your-results" }
  | { screen: "about" };

export function routeToHash(route: Route): string {
  switch (route.screen) {
    case "home":
      return "#/";
    case "challenge":
      return "#/challenge";
    case "challenge-mode":
      return `#/challenge/mode/${encodeURIComponent(route.modeId)}`;
    case "spot-the-bug":
      return route.onlyMissed ? "#/spot-the-bug/missed" : "#/spot-the-bug";
    case "your-results":
      return "#/your-results";
    case "about":
      return "#/about";
    default:
      return "#/";
  }
}

/** Parses a location.hash string back into a Route. Unknown or malformed
 * hashes fall back to Home rather than throwing or showing a blank page. */
export function hashToRoute(hash: string): Route {
  try {
    const clean = hash.replace(/^#\/?/, "");
    // decodeURIComponent throws on a malformed percent-encoded sequence
    // (e.g. a stray "%" or an incomplete escape) — that decode has to
    // happen inside this try/catch, or a bad hash throws before routing
    // ever gets a chance to fall back to Home.
    const parts = clean.split("/").filter(Boolean).map((p) => decodeURIComponent(p));

    if (parts.length === 0) return { screen: "home" };
    if (parts[0] === "your-results") return { screen: "your-results" };
    if (parts[0] === "about") return { screen: "about" };

    if (parts[0] === "spot-the-bug") {
      return { screen: "spot-the-bug", onlyMissed: parts[1] === "missed" };
    }

    if (parts[0] === "challenge") {
      if (parts.length === 1) return { screen: "challenge" };
      if (parts[1] === "mode" && parts[2]) return { screen: "challenge-mode", modeId: parts[2] };
      return { screen: "challenge" };
    }

    return { screen: "home" };
  } catch {
    return { screen: "home" };
  }
}
