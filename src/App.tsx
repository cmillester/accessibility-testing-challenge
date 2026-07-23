import React, { useEffect, useRef, useState } from "react";
import { AppStateProvider, useAppState } from "./context/AppStateContext";
import { ChallengeStateProvider } from "./context/ChallengeStateContext";
import { ScreenId } from "./types";
import { Route, hashToRoute, routeToHash } from "./routing";

import { SkipLink } from "./components/layout/SkipLink";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { RouteErrorBoundary } from "./components/common/RouteErrorBoundary";

import { HomeScreen } from "./components/Home/HomeScreen";
import { YourResultsScreen } from "./components/YourResults/YourResultsScreen";
import { AboutScreen } from "./components/About/AboutScreen";
import { GameStages } from "./components/Game/GameStages";

function routeToScreenId(route: Route): ScreenId {
  if (route.screen === "your-results") return "your-results";
  if (route.screen === "challenge" || route.screen === "challenge-mode" || route.screen === "spot-the-bug") {
    return "quiz";
  }
  return route.screen as ScreenId;
}

function getInitialRoute(): Route {
  if (typeof window === "undefined") return { screen: "home" };
  return hashToRoute(window.location.hash);
}

function AppShell() {
  const { progress, toggleReducedMotionOverride } = useAppState();
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const mainRef = useRef<HTMLDivElement>(null);
  const isApplyingExternalHash = useRef(false);

  // Keep the URL hash in sync with in-app navigation, so any screen can
  // be bookmarked, shared, or reloaded directly.
  useEffect(() => {
    const nextHash = routeToHash(route);
    if (window.location.hash !== nextHash) {
      isApplyingExternalHash.current = true;
      window.location.hash = nextHash;
    }
  }, [route]);

  // Respond to back/forward navigation or a hash typed/pasted directly.
  useEffect(() => {
    function handleHashChange() {
      if (isApplyingExternalHash.current) {
        isApplyingExternalHash.current = false;
        return;
      }
      setRoute(hashToRoute(window.location.hash));
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-reduced-motion",
      progress.reducedMotionOverride ? "true" : "false"
    );
  }, [progress.reducedMotionOverride]);

  useEffect(() => {
    mainRef.current?.focus();
  }, [route.screen]);

  function goHome() {
    setRoute({ screen: "home" });
  }

  // A stable-but-distinct key per route so the error boundary resets
  // whenever navigation actually changes screens.
  const boundaryKey = JSON.stringify(route);

  return (
    <div>
      <SkipLink />
      {/* Used by the Color Vision mode's arena (filter: url(#atl-protanopia)).
          Ported from the original prototype's protanopia simulation matrix. */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <filter id="atl-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567,0.433,0,0,0  0.558,0.442,0,0,0  0,0.242,0.758,0,0  0,0,0,1,0"
          />
        </filter>
      </svg>
      <Header
        onNavigate={(screen) => {
          if (screen === "home") goHome();
          else if (screen === "your-results") setRoute({ screen: "your-results" });
          else if (screen === "about") setRoute({ screen: "about" });
        }}
        currentScreen={routeToScreenId(route)}
      />

      <div className="container" style={{ paddingBlock: "var(--space-4)" }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          <input
            type="checkbox"
            checked={progress.reducedMotionOverride}
            onChange={toggleReducedMotionOverride}
          />
          Reduce motion in this app
        </label>
      </div>

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="container"
        style={{ paddingBlock: "var(--space-6)", minHeight: "40vh", outline: "none" }}
      >
        <RouteErrorBoundary key={boundaryKey} onReturnHome={goHome}>
          {route.screen === "home" && (
            <HomeScreen
              onPlayChallenge={() => setRoute({ screen: "challenge" })}
              onPlaySpotTheBug={() => setRoute({ screen: "spot-the-bug" })}
              onViewYourResults={() => setRoute({ screen: "your-results" })}
              onViewAbout={() => setRoute({ screen: "about" })}
            />
          )}

          {(route.screen === "challenge" ||
            route.screen === "challenge-mode" ||
            route.screen === "spot-the-bug") && (
            <GameStages route={route} onNavigate={setRoute} onBackHome={goHome} />
          )}

          {route.screen === "your-results" && (
            <YourResultsScreen
              onBackHome={goHome}
              onPlayChallenge={() => setRoute({ screen: "challenge" })}
              onPlaySpotTheBug={() => setRoute({ screen: "spot-the-bug" })}
              onReplayMissed={() => setRoute({ screen: "spot-the-bug", onlyMissed: true })}
              onTryMode={(modeId) => setRoute({ screen: "challenge-mode", modeId })}
            />
          )}

          {route.screen === "about" && <AboutScreen onBackHome={goHome} />}
        </RouteErrorBoundary>
      </main>

      <Footer onNavigateHome={goHome} />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <ChallengeStateProvider>
        <AppShell />
      </ChallengeStateProvider>
    </AppStateProvider>
  );
}
