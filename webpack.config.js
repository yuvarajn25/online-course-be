const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line import/no-extraneous-dependencies
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  mode: "development",
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "env",
                  {
                    targets: {
                      node: "12.16.1",
                    },
                  },
                ],
              ],
              plugins: [],
            },
          },
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
};
