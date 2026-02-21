const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
  devServer: {
    port: 8080,
    liveReload: true,
    hot: true,
    open: true,
    static: { directory: path.join(__dirname), publicPath: '/', serveIndex: false },
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
});
