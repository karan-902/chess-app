import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const common = path.resolve(__dirname, "../common/src");

const alias = {
 "@gopvp/admin": path.resolve(__dirname, "."),
 "@gopvp/common": path.resolve(__dirname, "../common"),
};

export default defineConfig({
 plugins: [react()],

 resolve: { alias },

 publicDir: path.resolve(__dirname, "../app/public"),

 css: {
  preprocessorOptions: {
   scss: { loadPaths: [path.join(common, "styles")] },
  },
 },

 assetsInclude: ["**/*.svg"],

 server: {
  host: true,
  port: 5174,
  strictPort: true,
  open: "/",
 },
});
