import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_admin",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true, import: "react" },
        "react-dom": { singleton: true, import: "react-dom" },
        "react-router-dom": { singleton: true, import: "react-router-dom" },
      },
    }),
  ],
  server: {
    port: 4175,
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});


