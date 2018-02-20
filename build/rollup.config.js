import * as path from "path";
import typescript from "rollup-plugin-typescript2";

const isProduction = process.env.NODE_ENV === `production`;
const kebab_name = "http";
const pascal_name = "Http";

export default {
  input: path.resolve(__dirname, "../src/index.ts"),
  plugins: [typescript()],
  external: ["safe-types"],
  output: [
    {
      format: "es",
      file: `./lib/${kebab_name}.esm.js`,
      sourcemap: true,
    },
  ],
};
