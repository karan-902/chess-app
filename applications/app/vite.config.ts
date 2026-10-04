import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const common = path.resolve(__dirname, "../common/src");

// Resolve the monorepo packages by name (e.g. "@gopvp/common/src/...")
const alias = {
 "@gopvp/app": path.resolve(__dirname, "."),
 "@gopvp/chess": path.resolve(__dirname, "../chess"),
 "@gopvp/common": path.resolve(__dirname, "../common"),
};

export default defineConfig({
 plugins: [react()],

 resolve: { alias },

 css: {
  preprocessorOptions: {
   scss: { loadPaths: [path.join(common, "styles")] },
  },
 },

 assetsInclude: ["**/*.svg", "**/*.csv"],

 server: {
  host: true,
  allowedHosts: true,
  port: 5173,
  strictPort: true,
  open: "/chess",
 },
});
