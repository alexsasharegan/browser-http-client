const path = require("path")
const pkg = require("../package.json")
const MinifyPlugin = require("babel-minify-webpack-plugin")
const webpack = require("webpack")

const PROD = process.env.NODE_ENV === "production"
const Env = {
  VERSION: JSON.stringify(pkg.version),
  PRODUCTION: JSON.stringify(PROD),
  NAME: JSON.stringify(pkg.name)
}

const conf = opts => {
  const $conf = {
    entry: {
      index: "./src"
    },
    output: {
      ...opts.output,
      library: "Http",
      path: path.resolve(__dirname, "../dist"),
      filename: `http.${opts.ext}.js`
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }]
    },
    plugins: [new webpack.optimize.ModuleConcatenationPlugin(), new webpack.DefinePlugin(Env)],
    devtool: "source-map"
  }

  if (opts.minify) {
    $conf.plugins.push(
      new MinifyPlugin({
        removeConsole: true,
        removeDebugger: true
      })
    )
  }

  return $conf
}

const esm = (opts = {}) =>
  Object.assign(
    {},
    {
      minify: false,
      ext: "esm" + (opts.minify ? ".min" : ""),
      output: {
        libraryTarget: "commonjs2"
      }
    },
    opts
  )

const umd = (opts = {}) =>
  Object.assign(
    {},
    {
      minify: false,
      ext: "umd" + (opts.minify ? ".min" : ""),
      output: {
        libraryTarget: "umd"
      }
    },
    opts
  )

const browser = (opts = {}) =>
  Object.assign(
    {},
    {
      minify: false,
      ext: "browser" + (opts.minify ? ".min" : ""),
      output: {
        libraryTarget: "window",
        libraryExport: "default"
      }
    },
    opts
  )

module.exports = [
  conf(esm()),
  conf(esm({ minify: true })),
  conf(umd()),
  conf(umd({ minify: true })),
  conf(browser()),
  conf(browser({ minify: true }))
]
