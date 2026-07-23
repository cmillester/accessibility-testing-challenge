import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standalone static build: no server, no external services.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
