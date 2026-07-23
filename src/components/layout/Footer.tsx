import React from "react";

interface FooterProps {
  onNavigateHome: () => void;
}

export function Footer({ onNavigateHome }: FooterProps) {
  return (
    <footer className="site-footer">
      <div
        className="container"
        style={{
          paddingBlock: "var(--space-6)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="text-muted" style={{ margin: 0 }}>
          Created by C. Lin
        </p>
        <nav aria-label="Footer">
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-5)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li style={{ margin: 0 }}>
              <button type="button" onClick={onNavigateHome} className="btn-tertiary">
                Return to Home
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
