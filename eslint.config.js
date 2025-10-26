import js from "@eslint/js";
import globals from "globals";

export default [
  // 🔧 Configuração recomendada do ESLint
  js.configs.recommended,

  // 📁 Configuração principal para arquivos JavaScript
  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    // 📏 Regras personalizadas para seu projeto
    rules: {
      // Obriga ponto e vírgula
      semi: ["error", "always"],

      // Aspas duplas
      quotes: ["error", "double"],

      // Avisa sobre variáveis não usadas (não quebra)
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Permite console.log (útil em desenvolvimento)
      "no-console": "off",

      // Sem vírgula no final de objetos/arrays
      "comma-dangle": ["error", "never"],

      // Sem espaço antes de parênteses em funções
      "space-before-function-paren": ["error", "never"],

      // Força uso de === ao invés de ==
      eqeqeq: ["error", "always"],

      // Identação de 2 espaços
      indent: ["error", 2],

      // No máximo 2 linhas em branco consecutivas
      "no-multiple-empty-lines": ["error", { max: 2 }],

      // Espaço antes de chaves
      "space-before-blocks": ["error", "always"],

      // Espaço ao redor de operadores
      "space-infix-ops": "error",
    },
  },

  // 🚫 Arquivos e pastas para IGNORAR
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
