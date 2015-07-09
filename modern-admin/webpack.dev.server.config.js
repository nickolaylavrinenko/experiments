#!/usr/bin/env node

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
    assets: true,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: false
  }
}).listen(parseInt(process.env.PORT || '8000', 10), '0.0.0.0', function (err, result) {
  if (err) console.log(err);
});

// this is an old way of running dev-server form package.json
// "old-dev-server": "BUILD_DEV=1 webpack-dev-server --port 8000 --progress --colors --hot --inline --config webpack.config.dev.js"
