import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";

interface EnvConfig {
  VITE_BASE_URL?: string;
  VITE_PORT?: string;
}

// Resolve the JSON file path
const envPath = path.resolve(__dirname, "env.development.json");

// Read JSON config safely with type
let envConfig: EnvConfig = {};
if (fs.existsSync(envPath)) {
  envConfig = JSON.parse(fs.readFileSync(envPath, "utf-8")) as EnvConfig;
  process.env.VITE_BASE_URL = envConfig.VITE_BASE_URL;
} else {
  console.error("Error: env.development.json not found");
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: parseInt(envConfig.VITE_PORT || "5000", 10),
  },
  plugins: [
    react(),
    tailwindcss(),
    // mode === "development" && componentTagger(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   devOptions: {
    //     enabled: false,
    //   },
    //   manifest: {
    //     name: "NSSM",
    //     short_name: "NSSM",
    //     description: "App for billing system",
    //     theme_color: "#ffffff",
    //     background_color: "#ffffff",
    //     display: "standalone",
    //     scope: "/",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "/icons/android-chrome-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/icons/android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     navigateFallback: "/index.html",
    //     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    //     navigateFallbackAllowlist: [/^\/dashboard/, /^\/login/],
    //   },
    // }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
}));
