import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default defineConfig([
 {
  ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/public/**"],
 },
 {
  files: ["applications/**/*.{ts,tsx}"],
  extends: [js.configs.recommended, tseslint.configs.recommended],
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
  plugins: { "react-hooks": reactHooks },
  rules: {
   "react-hooks/rules-of-hooks": "error",
   "react-hooks/exhaustive-deps": "warn",
   "no-console": ["warn", { allow: ["error"] }],
  },
 },
]);
