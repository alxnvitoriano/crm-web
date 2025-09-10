// ESLint Flat Config for Next.js + TypeScript
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Ignorar pastas e artefatos
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/out/**",
      "**/*.min.js",
      "public/**",
    ],
  },
  // Config base do projeto
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Regras do preset Core Web Vitals do Next
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
