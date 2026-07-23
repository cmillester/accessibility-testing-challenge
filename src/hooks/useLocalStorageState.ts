import { useEffect, useState } from "react";

/**
 * A useState-like hook backed by window.localStorage, with a safe fallback
 * hierarchy: localStorage when available, in-memory-only state when it
 * isn't (blocked, full, or unavailable in some private-browsing modes),
 * and the game keeps working either way — nothing here can stop gameplay
 * or surface a raw error. `storageAvailable` is returned so callers can
 * show a single, honest, one-time note instead of implying a save
 * succeeded when it didn't.
 *
 * An optional `sanitize` validates/repairs whatever was loaded before it's
 * trusted, so a malformed or outdated saved value (edited by hand, left
 * over from an older version, or simply corrupted) can never crash a
 * component downstream with an unexpected shape.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  sanitize?: (value: T) => T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Computed once, lazily — not on every render — since it performs an
  // actual (harmless but real) test write/delete against localStorage.
  const [storageAvailable] = useState<boolean>(() => isStorageAvailable());

  const [state, setState] = useState<T>(() => {
    if (!storageAvailable) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initialValue;
      const parsed: unknown = JSON.parse(raw);

      // Only ever trust a plain, non-array object shape. Anything else
      // (a stray string/number/null, a corrupted value) falls back to
      // the default rather than being trusted as-is.
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        // Schema-migration safety net: a visitor's browser may hold state
        // saved by an earlier version of this app that predates fields
        // added later. Shallow-merging over initialValue guarantees every
        // expected top-level key always exists.
        const merged = { ...(initialValue as object), ...parsed } as T;
        try {
          return sanitize ? sanitize(merged) : merged;
        } catch {
          return initialValue;
        }
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!storageAvailable) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full, blocked mid-session, or otherwise unavailable — the
      // app continues to work in-memory. No error is ever surfaced here.
    }
  }, [key, state, storageAvailable]);

  return [state, setState, storageAvailable];
}

function isStorageAvailable(): boolean {
  try {
    const testKey = "__atl_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
