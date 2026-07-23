import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Test-only config, separate from the production build config. Uses
// jsdom so component tests can exercise real DOM behavior (focus,
// keyboard events, localStorage) without a browser.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: false,
  },
});
