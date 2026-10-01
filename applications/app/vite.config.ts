import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const common = path.resolve(__dirname, "../common/src");

export default defineConfig({
 plugins: [react()],

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
