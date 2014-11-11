module.exports = {
    entry: "./src/app.js",
    output: {
        path: __dirname,
        filename: "/static/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.ejs$/, loader: "ejs-compiled" },
            {test: /\.(ttf|woff|woff2|eot|svg|gif|png)(\?.+)?$/, loader: 'file-loader?hash=sha512&size=7&digest=base36'},
        ]
    }
};