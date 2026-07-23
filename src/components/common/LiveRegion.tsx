import React from "react";

/**
 * A visually-hidden polite live region for announcing dynamic changes
 * (timers completing, scores updating, feedback appearing) to screen
 * reader users without moving visual focus.
 */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="visually-hidden">
      {message}
    </div>
  );
}
