import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    origin: "https://shun-quiver-populate.ngrok-free.dev",
    allowedHosts: "all",
    hmr: {
      protocol: "wss",
      host: "shun-quiver-populate.ngrok-free.dev",
      clientPort: 443,
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});