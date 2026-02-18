import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const googleConfig = compat.extends("google");
for (const config of googleConfig) {
    if (config.rules) {
        delete config.rules["valid-jsdoc"];
        delete config.rules["require-jsdoc"];
    }
}

export default defineConfig([
    ...googleConfig,
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
            },

            ecmaVersion: "latest",
            sourceType: "script",
        },

        rules: {},
    }
]);