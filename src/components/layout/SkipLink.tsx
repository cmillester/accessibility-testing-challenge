import React from "react";

// A plain href="#main-content" would set window.location.hash, and this
// app's router treats any hash change as a navigation — so activating the
// skip link would have been indistinguishable from typing an unknown route
// and would have bounced the player Home instead of just moving focus.
// Handling the activation in JS and moving focus directly avoids touching
// the hash (and therefore the current game route) at all.
export function SkipLink() {
  function handleActivate(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById("main-content");
    if (target) {
      target.focus();
      target.scrollIntoView({ block: "start" });
    }
  }

  return (
    <a href="#main-content" className="skip-link" onClick={handleActivate}>
      Skip to main content
    </a>
  );
}
