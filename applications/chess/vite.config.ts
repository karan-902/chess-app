import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
    return {
        name: "figma-asset-resolver",
        resolveId(id: any) {
            if (id.startsWith("figma:asset/")) {
                const filename = id.replace("figma:asset/", "");
                return path.resolve(__dirname, "src/assets", filename);
            }
        },
    };
}

const common = path.resolve(__dirname, "../common/src");

export default defineConfig({
    plugins: [figmaAssetResolver(), react()],

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
