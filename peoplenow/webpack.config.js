module.exports = {
    entry: "./src/app.js",
    output: {
        path: __dirname,
        filename: "/static/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.ejs$/, loader: "ejs" }
        ]
    }
};