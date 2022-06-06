module.exports = {
  extends: ["next/core-web-vitals", "plugin:import/recommended"],
  rules: {
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "import/order": [
      1,
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "index",
          "sibling",
        ],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
};
