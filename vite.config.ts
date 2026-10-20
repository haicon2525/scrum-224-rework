import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api-uat.vinhomes.biz.vn",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/hovixi/api/v1"),
        headers: {
          Origin: "https://api-uat.vinhomes.biz.vn",
          Referer: "https://api-uat.vinhomes.biz.vn/",
        },
      },
    },
  },
});
