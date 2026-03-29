const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-main",
  entry: "./src/electron/main.ts",
  output: {
    path: path.resolve(__dirname, "dist/main"),
    filename: "main.js",
    clean: true,
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