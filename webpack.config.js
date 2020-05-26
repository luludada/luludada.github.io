const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

const DIST = path.join(__dirname, 'dist');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: DIST,
    filename: 'index.[chunkhash:5].js'
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ]
    }, {
      test: /\.(png|jpg|gif)$/,
        use: [ 'file-loader' ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [DIST]
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:5].css',
    }),
    /**
     * Workbox Webpack Plugin
     */
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',

      // （预加载）忽略某些文件
      exclude: [
        /index\.html$/,
      ],
      // 动态更新缓存
      // runtimeCaching: [{
      //   urlPattern: /index\.html/,
      //   handler: 'networkFirst',
      // }, {
      //   urlPattern: /\.(js|css|png|jpg|gif)/,
      //   handler: 'staleWhileRevalidate',
      // }]
    
    })
  ]
};