import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite build configuration for GitHub Pages.
 *
 * Relative asset URLs keep the build portable between the repository site and
 * a custom domain. Hash-based routing handles static-host route refreshes.
 */
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
});
