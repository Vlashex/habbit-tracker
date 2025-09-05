import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "habitTracker",
      filename: "remoteEntry.js",
      exposes: {
        "./app/bootstrap": "./app/main.ts",
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
    port: 3001,
  },
  build: {
    target: "esnext",
  },
});
