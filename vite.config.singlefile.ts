import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Produces a single, fully self-contained index.html (JS + CSS inlined).
// This is only for convenient offline/local preview and review — it is not
// used for the normal static hosting build (see vite.config.ts), which
// keeps separate cacheable JS/CSS assets.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: {
    outDir: "dist-preview",
    sourcemap: false,
  },
});
