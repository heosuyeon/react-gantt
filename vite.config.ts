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
