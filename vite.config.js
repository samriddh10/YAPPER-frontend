import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:5001",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
