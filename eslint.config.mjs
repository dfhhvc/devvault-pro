import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow setState in useEffect for initialization patterns
      "react-hooks/set-state-in-effect": "off",
      // Allow setState in render for derived state patterns
      "react-hooks/set-state-in-render": "off",
      // Allow impure functions in render for Date.now() etc
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
