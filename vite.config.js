import { defineConfig } from "vite";

// Keep the demo bundle predictable while React's CommonJS graph is rebuilt.
// Vite still minifies the output; revisit module pruning for the functional app.
export default defineConfig({
  server: { proxy: { "/api": "http://127.0.0.1:3001" } },
  build: { rollupOptions: { treeshake: false } },
});
