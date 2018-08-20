const webpack = require("webpack");
const { IgnorePlugin } = require("webpack");
const slsw = require("serverless-webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: "source-map",
  target: "node",
  optimization: {
    //https://github.com/GoogleChrome/puppeteer/issues/2245
    // Disables the built-in UglifyJsPlugin
    minimize: false
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          cacheDirectory: true
        }
      },
      //https://github.com/GoogleChrome/puppeteer/issues/2245
      {
        test: /puppeteer\/lib\/Launcher.js$/,
        loader: "string-replace-loader",
        options: {
          search:
            "const ChromiumRevision = require(path.join(helper.projectRoot(), 'package.json')).puppeteer.chromium_revision;",
          replace:
            "const ChromiumRevision = require('../package.json').puppeteer.chromium_revision;"
        }
      },
      //https://github.com/GoogleChrome/puppeteer/issues/2245
      {
        test: /puppeteer\/node6\/lib\/Launcher.js$/,
        loader: "string-replace-loader",
        options: {
          search:
            "const ChromiumRevision = require(path.join(helper.projectRoot(), 'package.json')).puppeteer.chromium_revision;",
          replace:
            "const ChromiumRevision = require('../../package.json').puppeteer.chromium_revision;"
        }
      }
    ]
  },
  resolve: {
    symlinks: true
  },
  output: {
    libraryTarget: "commonjs",
    path: `${__dirname}/.webpack`,
    filename: "[name].js"
  },
  externals: ["aws-sdk"],
  plugins: [
    // https://github.com/felixge/node-formidable/issues/337
    new webpack.DefinePlugin({ "global.GENTLY": false }),

    //some unneeded puppeteer dependencies causing error in webpack build
    //https://github.com/GoogleChrome/puppeteer/issues/1224
    new IgnorePlugin(/vertx/),
    new IgnorePlugin(/bufferutil/),
    new IgnorePlugin(/utf-8-validate/),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    //https://github.com/GoogleChrome/puppeteer/issues/2245
    new UglifyJsPlugin({
      uglifyOptions: {
        // Necessary for puppeteer, otherwise there will be odd bugs
        keep_fnames: true
      }
    })
  ],
  entry: slsw.lib.entries
};
