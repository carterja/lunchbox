const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'logo.svg', to: 'logo.svg' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'favicon.svg', to: 'favicon.svg' },
        { from: 'favicon-96x96.png', to: 'favicon-96x96.png' },
        { from: 'apple-touch-icon.png', to: 'apple-touch-icon.png' },
        { from: 'web-app-manifest-192x192.png', to: 'web-app-manifest-192x192.png' },
        { from: 'web-app-manifest-512x512.png', to: 'web-app-manifest-512x512.png' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
