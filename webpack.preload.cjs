const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-preload",
  entry: "./src/electron/preload.ts",
  output: {
    path: path.resolve(__dirname, "dist/main"),
    filename: "preload.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};