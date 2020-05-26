const path = require('path');
const resolve = filePath => path.resolve(__dirname, filePath);
const htmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DIST = path.join(__dirname, './dist');



module.exports = {
  entry: resolve('./src/index.js'),
  output: {
    path: resolve(DIST),
    filename: 'index.[chunkhash:5].js'
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader',
      ]
    }, {
      test: /\.(png|jpg|gif)$/,
        use: [ 'file-loader' ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
    new htmlPlugin({
        filename: 'index.html',
        title: 'Get Started With Workbox For Webpack'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:5].css',
    }),
    
    /**
     * Workbox Webpack Plugin
     */
    new workboxPlugin.GenerateSW({
        swDest: './dist/sw.js',      //outputs the service worker that it generates
        clientsClaim: true,          //the latest service worker to take control of all clients
        skipWaiting: true,           //the latest service worker to activate as soon as it enters the waiting phase
        
        // workbox-sw.js 部署本地服务器
        importWorkboxFrom: 'local',
        
        // （预加载）忽略某些文件
        exclude: [
          /index\.html$/,
        ],

        // 动态更新缓存
        runtimeCaching: [
        {
          urlPattern: /index\.html/,
          handler: 'networkFirst',
        }, 

        {
          urlPattern: /\.(js|css|png|jpg|gif)/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: "markup",
            expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 20
            },
            cacheableResponse: {
                statuses: [0, 200]
            }
          },
        }]
    })
  ]
};