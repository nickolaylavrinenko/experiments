
var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin");


// directories
var ROOT_DIR = __dirname,
    STATIC_DIR = path.normalize(path.join(ROOT_DIR, 'static')),
    STATIC_URL = '/static/';


module.exports = {
    entry: ['webpack/hot/dev-server', './src/index.js'],
    output: {
        path: STATIC_DIR,
        publicPath: STATIC_URL,
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    "css?sourceMap!autoprefixer!less?sourceMap"
                ) 
            },
            {
                test: /\.js$/,
                loader: 'babel?experimental',
                exclude: /\bnode_modules\b/ 
            },
            // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            },
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    plugins: [
        new ExtractTextPlugin("bundle.css", {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
};
