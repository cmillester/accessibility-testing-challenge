import { useCallback, useState } from "react";

/**
 * Provides a single polite aria-live announcement string plus a setter,
 * for communicating dynamic state changes (timers finishing, scores
 * updating, feedback appearing) to screen reader users.
 */
export function useAnnouncer() {
  const [message, setMessage] = useState("");

  const announce = useCallback((text: string) => {
    // Clear first so identical consecutive messages are still announced.
    setMessage("");
    window.requestAnimationFrame(() => setMessage(text));
  }, []);

  return { message, announce };
}
