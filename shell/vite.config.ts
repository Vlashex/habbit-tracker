// shell/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    vue(),
    federation({
      name: "shell", // имя хоста
      remotes: {
        // важно: remoteEntry.js всегда в корне preview-сервера
        habitTracker: "http://localhost:3001/assets/remoteEntry.js",
        pomodoroTimer: "http://localhost:3002/remoteEntry.js",
        todoLists: "http://localhost:3003/remoteEntry.js",
        analyticsReports: "http://localhost:3004/remoteEntry.js",
      },
      shared: {
        react: {
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          requiredVersion: "^18.0.0",
        },
        vue: {
          requiredVersion: "^3.0.0",
        },
        "solid-js": {
          requiredVersion: "^1.0.0",
        },
      },
    }),
  ],
  server: {
    port: 3000, // Shell на 3000
  },
  build: {
    target: "esnext",
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
