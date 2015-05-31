
// Dev configuration:
// - source maps enabled
// - dev server hot replacement for static files
// - not mnified

var
  path = require('path'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CopyPlugin = require('./src/plugins/webpack-copy-plugin'),
  nib = require('nib'),
  jeet = require('jeet'),
  webpack = require('webpack');

// directories
var
  rootDir = __dirname,
  srcDir = path.normalize(path.join(rootDir, 'src')),
  outputDir = path.normalize(path.join(rootDir, 'build')),
  hotMode = (process.argv[1].indexOf('webpack-dev-server') >= 0 ||
             process.argv[1].indexOf('webpack.dev.server.js') >= 0)
            ? true: false;


module.exports = {
  progress: true,
  entry: './src/index.js',
  output: {
    path: outputDir,
    filename: 'static/js/bundle.js'
  },
  devtool: 'source-map',  // for ExtractTextPlugin and css sourcemaps
  stylus: {
    use: [nib(), jeet()]
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'mocks': path.join(rootDir, 'mocks')
    }
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(
          "css?sourceMap,root=" + srcDir + "!autoprefixer!stylus?sourceMap"
        )
      },
      {
        test: /\.js$/,
        loader: 'babel?stage=0',
        exclude: /\bnode_modules\b/
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      // inline base64 URLs for <=8k files, direct URLs for the rest
      // images
      {
        test: /img\/.+\.(png|jpg|gif|svg)$/,
        loader: 'url-loader?limit=8192'
      },
      // fonts
      {
        test: /fonts\/.+\.(svg|eot|woff|woff2|ttf)(\?.+)?$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
    }),
    new ExtractTextPlugin("static/css/bundle.css", {allChunks: true}),
    new HtmlWebpackPlugin({
      template: './src/pages/index.html',
      filename: 'index.html',
      hotMode: hotMode
    }),
    // copy images as it is to target directory
    new CopyPlugin({
      source: 'assets/gifs',
      target: path.join(outputDir, 'static/gifs')
    })
  ]
};
