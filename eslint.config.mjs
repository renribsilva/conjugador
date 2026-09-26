import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "max-len": ["error", { code: 80, ignoreUrls: true }],
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "mdx.d.ts"],
  },
];
