import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.tsx"],
    framework: "@storybook/react-vite",
    viteFinal: (viteConfig) => ({
        ...viteConfig,
        css: {
            ...viteConfig.css,
            preprocessorOptions: {
                scss: { loadPaths: [path.resolve(import.meta.dirname, "../src/styles")] },
            },
        },
    }),
};

export default config;
