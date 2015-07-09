
var
  path = require('path'),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  webpack = require('webpack');

// directories
var
  rootDir = __dirname,
  clientDir = path.join(rootDir, 'client/src'),
  serverDir = path.join(rootDir, 'server/src'),
  sharedDir = path.join(rootDir, 'shared/src'),
  outputDir = path.join(rootDir, 'build');


module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    './client/src/index.js'
  ],
  output: {
    path: outputDir,
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'client': clientDir,
      'shared': sharedDir,
      'server': serverDir
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'react-hot!babel?stage=0',
        include: clientDir
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    }),
    new HtmlWebpackPlugin({
      template: './pages/index.html',
      filename: 'index.html'
    }),
    new webpack.NoErrorsPlugin()
  ]
};
