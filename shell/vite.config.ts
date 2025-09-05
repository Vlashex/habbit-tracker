import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        habitTracker: "http://localhost:3001/assets/remoteEntry.js",
        pomodoroTimer: "http://localhost:3002/assets/remoteEntry.js",
        todoLists: "http://localhost:3003/assets/remoteEntry.js",
        analyticsReports: "http://localhost:3004/assets/remoteEntry.js",
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
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
