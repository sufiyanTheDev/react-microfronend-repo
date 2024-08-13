const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'source-map', // to make file readable
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    open: true,
    port: 3002,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "components",
      filename: "remoteEntry.js",
      exposes: {
        "./MovieCard" : "./src/components/MovieCard/MovieCard.jsx",
        "./BuyButton" : "./src/components/Button/BuyButton/BuyButton.jsx"
      }
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),    
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, "src"),
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimize: false, // Completely disable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: false, // Disable code compression
          mangle: false, // Disable variable name mangling
          format: {
            beautify: true, // Ensure the output is readable
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
    },
  },
};
