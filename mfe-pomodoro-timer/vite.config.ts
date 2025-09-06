import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "pomodoroTimer",
      filename: "remoteEntry.js",
      exposes: {
        "./app/bootstrap": "./app/bootstrap.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        vue: { requiredVersion: "^3.0.0" },
        "solid-js": { requiredVersion: "^1.0.0" },
      },
    }),
  ],
  server: {
    port: 3002,
  },
  build: {
    target: "esnext",
  },
});
