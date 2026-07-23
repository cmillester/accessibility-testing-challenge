import React, { useEffect, useRef } from "react";

interface ConfirmExitDialogProps {
  onExitRound: () => void;
  onKeepPlaying: () => void;
}

/**
 * A small, focus-trapped confirmation shown only when leaving would
 * abandon a round already in progress. No guilt-oriented language —
 * exiting is always a safe, available choice.
 */
export function ConfirmExitDialog({ onExitRound, onKeepPlaying }: ConfirmExitDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const keepPlayingRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    keepPlayingRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onKeepPlaying();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
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
    <div className="dialog-overlay">
      <div
        ref={dialogRef}
        className="card stack-sm dialog-panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-exit-heading"
        onKeyDown={handleKeyDown}
      >
        <h2 id="confirm-exit-heading" style={{ margin: 0, fontSize: "1.1rem" }}>
          Exit this round?
        </h2>
        <div className="btn-row">
          <button type="button" className="btn btn-secondary" onClick={onExitRound}>
            Exit round
          </button>
          <button
            ref={keepPlayingRef}
            type="button"
            className="btn btn-primary"
            onClick={onKeepPlaying}
          >
            Keep playing
          </button>
        </div>
      </div>
    </div>
  );
}
