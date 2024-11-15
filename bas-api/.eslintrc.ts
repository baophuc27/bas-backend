module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  rules: {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn",
    "object-curly-spacing": ["error", "always"],
    "no-var": "error",
    quotes: ["error", "single"],
    "comma-spacing": ["error", { before: false, after: true }],
  },
};
