import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const pwaPlugin = VitePWA({
  registerType: "autoUpdate",
  outDir: path.resolve(import.meta.dirname, "dist"),
  injectRegister: "auto",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,json}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
    skipWaiting: true,
    clientsClaim: true,
  },
  manifest: {
    name: "Math Genius by Faras | عبقري الرياضيات",
    short_name: "MathGenius",
    description: "An interactive math learning game for kids from Kindergarten to Grade 3, by Faras Academy.",
    theme_color: "#FBBF24",
    background_color: "#FEF9C3",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["education", "games", "kids"],
    screenshots: [],
  },
  devOptions: {
    enabled: false,
    type: "module",
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), pwaPlugin],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
