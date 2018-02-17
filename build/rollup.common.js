const path = require("path");
const typescript = require("rollup-plugin-typescript2");

const isProduction = process.env.NODE_ENV === `production`;
const kebab_name = "http";
const pascal_name = "Http";

exports.new_conf = () => ({
  input: path.resolve(__dirname, "../src/index.ts"),
  plugins: [typescript()],
  output: [
    {
      format: "es",
      file: `./lib/${kebab_name}.esm.js`,
      sourcemap: true,
    },
    {
      format: "umd",
      name: pascal_name,
      file: `./lib/${kebab_name}.js`,
      sourcemap: true,
    },
  ],
});
