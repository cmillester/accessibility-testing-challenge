import React, { useEffect, useId, useRef, useState } from "react";

interface InfoButtonProps {
  /** Used to build the accessible name, e.g. "Reduced Visual Clarity" → "About Reduced Visual Clarity". */
  label: string;
  text: string;
}

/**
 * A small, accessible disclosure control for supplementary context — click
 * or keyboard to open, Escape or outside-click to close, focus always
 * returns to this button. Hover can additionally preview the same content
 * on desktop, but hover is never the only way to reach it.
 */
export function InfoButton({ label, text }: InfoButtonProps) {
  const [open, setOpen] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      {open && (
        <div
          id={panelId}
          ref={panelRef}
          role="group"
          aria-label={`About ${label}`}
          className="info-popover"
        >
          <p style={{ margin: 0 }}>{text}</p>
          <button type="button" className="btn-tertiary" onClick={() => close(true)}>
            Close
          </button>
        </div>
      )}
    </span>
  );
}
