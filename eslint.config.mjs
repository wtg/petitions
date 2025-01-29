import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: {
        plugins: ["@typescript-eslint"],
    },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
const eslintConfig = compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
    rules: {
        "semi": ["error", "always"],
        "no-irregular-whitespace": "error",
        "no-undef": "error",
        "curly": "error",
        "semi": "error",
        "no-trailing-spaces": "error",
        "indent": ["error", 4],
        "space-before-blocks": "error"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.*.json", "./postcss.config.mjs"],
        tsconfigRootDir: __dirname
    },
    globals: {
        "React": true
    }
});

export default eslintConfig;
