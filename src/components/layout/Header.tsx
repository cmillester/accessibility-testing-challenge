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
      <div className="container site-header__inner">
        <div className="site-header__row">
          <button type="button" className="site-header__title" onClick={() => onNavigate("home")}>
            <span>Accessibility Testing Challenge</span>
          </button>
          <nav aria-label="Primary" className="site-header__nav">
            <ul className="site-header__nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={currentScreen === item.id ? "page" : undefined}
                    className="btn-tertiary site-header__nav-link"
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
