import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": "{}",
  },
  build: {
    outDir: "public/js",
    // public 디렉터리를 outDir로 복사하지 않도록 설정 (중첩 생성 방지)
    copyPublicDir: false,
    // CSS 등 에셋은 outDir 내부의 assets/ 하위로 분리
    assetsDir: "assets",
    lib: {
      entry: path.resolve(__dirname, "src/gantt-task-react/index.tsx"),
      name: "ReactApp",
      formats: ["iife"],
      fileName: () => "react-app.js",
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  server: {
    port: 5173,
  },
});
