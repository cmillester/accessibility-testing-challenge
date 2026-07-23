import React, { useEffect, useId, useRef, useState } from "react";

interface InfoButtonProps {
  /** Used to build the accessible name, e.g. "Reduced Visual Clarity" → "About Reduced Visual Clarity". */
  label: string;
  text: string;
}

const NARROW_QUERY = "(max-width: 480px)";

function useIsNarrowViewport(): boolean {
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(NARROW_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(NARROW_QUERY);
    function handleChange() {
      setIsNarrow(mql.matches);
    }
    handleChange();
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
    // Older API fallback — still supported by some engines.
    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, []);

  return isNarrow;
}

/**
 * A small, accessible disclosure control for supplementary context — click
 * or keyboard to open, Escape or outside-click to close, focus always
 * returns to this button. Hover can additionally preview the same content
 * on desktop, but hover is never the only way to reach it.
 *
 * At narrow widths (where a fixed-width popover anchored to the trigger's
 * left edge could run past the right edge of the viewport), the same panel
 * is instead presented as a small centered, viewport-clamped dialog with a
 * backdrop — same content, same close/Escape/focus-return behavior, just
 * positioned so it can never overflow the screen.
 */
export function InfoButton({ label, text }: InfoButtonProps) {
  const [open, setOpen] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isNarrow = useIsNarrowViewport();

  function close(returnFocus: boolean) {
    setOpen(false);
    setLockedOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function handleTriggerClick() {
    if (open && lockedOpen) {
      close(true);
    } else {
      setOpen(true);
      setLockedOpen(true);
    }
  }

  // Escape and click-outside only need to be observed while open.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close(true);
      }
    }
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // At narrow widths the panel behaves as a real modal dialog: focus moves
  // in on open, and Tab/Shift+Tab stay trapped inside it until it closes.
  useEffect(() => {
    if (!open || !isNarrow) return;
    const closeButton = panelRef.current?.querySelector<HTMLElement>("[data-info-close]");
    closeButton?.focus();
  }, [open, isNarrow]);

  function handlePanelKeyDown(event: React.KeyboardEvent) {
    if (!isNarrow || event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button, [href], [tabindex]");
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <span className="info-button-wrap">
      <button
        ref={triggerRef}
        type="button"
        className="info-button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`About ${label}`}
        onClick={handleTriggerClick}
        onMouseEnter={() => {
          if (!open) setOpen(true);
        }}
        onMouseLeave={() => {
          if (open && !lockedOpen) setOpen(false);
        }}
      >
        <span aria-hidden="true">ⓘ</span>
      </button>
      {open && isNarrow && <div className="info-popover-backdrop" onClick={() => close(true)} />}
      {open && (
        <div
          id={panelId}
          ref={panelRef}
          role={isNarrow ? "dialog" : "group"}
          aria-modal={isNarrow ? true : undefined}
          aria-label={`About ${label}`}
          className={isNarrow ? "info-popover info-popover--sheet" : "info-popover"}
          onKeyDown={handlePanelKeyDown}
        >
          <p style={{ margin: 0 }}>{text}</p>
          <button type="button" className="btn-tertiary" data-info-close onClick={() => close(true)}>
            Close
          </button>
        </div>
      )}
    </span>
  );
}
