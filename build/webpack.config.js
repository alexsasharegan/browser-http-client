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

const esm = minify => ({
  minify: !!minify,
  ext: "esm" + (minify ? ".min" : ""),
  output: {
    libraryTarget: "commonjs2"
  }
})

const umd = minify => ({
  minify: !!minify,
  ext: "umd" + (minify ? ".min" : ""),
  output: {
    libraryTarget: "umd"
  }
})

const browser = minify => ({
  minify: !!minify,
  ext: "browser" + (minify ? ".min" : ""),
  output: {
    libraryTarget: "window",
    libraryExport: "default"
  }
})

const exp = []

for (const target of [esm, umd, browser]) {
  exp.push(conf(target()), conf(target(true)))
}

module.exports = exp
