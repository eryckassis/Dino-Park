import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";

export default [
  // 🔧 Configuração recomendada do ESLint
  js.configs.recommended,

  // 📁 Configuração para arquivos de código
  {
    files: ["src/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "comma-dangle": ["error", "never"],
      "space-before-function-paren": ["error", "never"],
      eqeqeq: ["error", "always"],
      indent: ["error", 2],
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "space-before-blocks": ["error", "always"],
      "space-infix-ops": "error",
    },
  },

  // 🧪 Configuração específica para testes Jest
  {
    files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js", "unit/**/*.js"],

    plugins: {
      jest: jestPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Adiciona globals do Jest
      },
    },

    rules: {
      ...jestPlugin.configs.recommended.rules,
      "jest/expect-expect": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/valid-expect": "error",
    },
  },

  // 🚫 Arquivos para IGNORAR
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.log",
      ".env",
      ".env.*",
      "logs/**",
    ],
  },
];
