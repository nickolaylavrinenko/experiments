
var
  path = require('path'),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  webpack = require('webpack');

// directories
var
  rootDir = __dirname,
  srcDir = path.join(rootDir, 'src'),
  outputDir = path.join(rootDir, 'build');


module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: outputDir,
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'react-hot!babel?stage=0',
        include: srcDir
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/index.html',
      filename: 'index.html'
    }),
    new webpack.NoErrorsPlugin()
  ]
};
