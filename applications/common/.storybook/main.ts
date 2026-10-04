import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
 stories: ["../src/**/*.stories.tsx"],
 framework: "@storybook/react-vite",
 viteFinal: (viteConfig) => ({
  ...viteConfig,
  resolve: {
   ...viteConfig.resolve,
   alias: {
    ...viteConfig.resolve?.alias,
    "@gopvp/app": path.resolve(import.meta.dirname, "../../app"),
    "@gopvp/chess": path.resolve(import.meta.dirname, "../../chess"),
    "@gopvp/common": path.resolve(import.meta.dirname, ".."),
   },
  },
  css: {
   ...viteConfig.css,
   preprocessorOptions: {
    scss: { loadPaths: [path.resolve(import.meta.dirname, "../src/styles")] },
   },
  },
 }),
};

export default config;
