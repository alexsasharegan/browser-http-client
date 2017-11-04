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

const conf = {
  entry: {
    app: "./src"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js"
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }]
  },
  plugins: []
}

if (PROD) {
  conf.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
  conf.plugins.push(
    new MinifyPlugin({
      removeConsole: true,
      removeDebugger: true
    })
  )
}

conf.plugins.push(new webpack.DefinePlugin(Env))

module.exports = [conf]
