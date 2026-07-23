import React from "react";
import { ScreenId } from "../../types";

interface HeaderProps {
  onNavigate: (screen: ScreenId) => void;
  currentScreen: ScreenId;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "your-results", label: "Your Results" },
  { id: "about", label: "About" },
];

export function Header({ onNavigate, currentScreen }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container" style={{ paddingBlock: "var(--space-4)" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate("home")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              minHeight: "auto",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "var(--color-text)",
              }}
            >
              Accessibility Testing Challenge
            </span>
          </button>
          <nav aria-label="Primary">
            <ul
              style={{
                display: "flex",
                gap: "var(--space-5)",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.id} style={{ margin: 0 }}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={currentScreen === item.id ? "page" : undefined}
                    className="btn-tertiary"
                    style={{
                      fontWeight: currentScreen === item.id ? 700 : 500,
                      textDecoration: currentScreen === item.id ? "underline" : "none",
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
