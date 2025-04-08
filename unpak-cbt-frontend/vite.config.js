import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "UNIVERSITAS PAKUAN COMPUTER BASED TEST",
        short_name: "UNPAK CBT",
        start_url: "/maba", // <- hanya aktif dari /maba
        scope: "/maba/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#42a5f5",
        icons: [
          {
            src: "/assets/images/logo-unpak.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/images/logo-unpak.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/maba"),
            handler: "NetworkFirst",
            options: {
              cacheName: "maba-pages-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@src": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://seb.unpak.ac.id",
        changeOrigin: true,
        secure: false, // Jika API menggunakan HTTPS self-signed
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/uploads": {
        target: "https://seb.unpak.ac.id/api/uploads",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, ""),
      },
      "/select2": {
        target: "https://sipaksi.unpak.ac.id/select2",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/select2/, ""),
      },
    },
  },
});
