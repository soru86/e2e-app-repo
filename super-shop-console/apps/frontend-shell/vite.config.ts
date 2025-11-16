import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "frontend_shell",
      remotes: {
        mfe_customer: {
          type: "module",
          name: "mfe_customer",
          entry: "http://localhost:4174/remoteEntry.js",
        },
        mfe_admin: {
          type: "module",
          name: "mfe_admin",
          entry: "http://localhost:4175/remoteEntry.js",
        },
      },
      shared: {
        react: { singleton: true, import: "react" },
        "react-dom": { singleton: true, import: "react-dom" },
        "react-router-dom": { singleton: true, import: "react-router-dom" },
        "@super-shop/theme": { singleton: true },
        "@super-shop/ui": { singleton: true },
      },
    }),
  ],
  server: {
    port: 4173,
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


