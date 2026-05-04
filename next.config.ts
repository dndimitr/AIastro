import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@swisseph/node", "@swisseph/core"],
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

// @ducanh2912/next-pwa registers a `webpack` hook even when PWA is disabled in dev.
// Next.js 16 defaults `next dev` to Turbopack and errors if any webpack config exists.
// Bolt often runs `npx next dev` (no --webpack): export bare config for dev/start so Turbopack works.
// Apply PWA only during `next build` (see npm run build → next build --webpack).
const isNextBuild =
  process.argv.includes("build") ||
  process.env.npm_lifecycle_event === "build";

export default isNextBuild ? withPWA(nextConfig) : nextConfig;
