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
        "./app/bootstrap": "./src/app/bootstrap.ts",
      },
      shared: ["vue"],
    }),
  ],
  build: {
    target: "esnext",
    modulePreload: false, // обязательно для federation!
    cssCodeSplit: false, // часто рекомендуют, чтобы стили remote корректно подгружались
    minify: false,
  },
});
