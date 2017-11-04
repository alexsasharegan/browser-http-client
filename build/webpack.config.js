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
    plugins: [new webpack.optimize.ModuleConcatenationPlugin(), new webpack.DefinePlugin(Env)]
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
      ext: "esm",
      output: {
        libraryTarget: "commonjs2"
      }
    },
    opts
  )

const browser = (opts = {}) =>
  Object.assign(
    {},
    {
      minify: false,
      ext: "browser",
      output: {
        library: "Http",
        libraryTarget: "window",
        libraryExport: "default"
      }
    },
    opts
  )

module.exports = [
  conf(esm()),
  conf(
    esm({
      minify: true,
      ext: "esm.min"
    })
  ),
  conf(browser()),
  conf(
    browser({
      minify: true,
      ext: "browser.min"
    })
  )
]
