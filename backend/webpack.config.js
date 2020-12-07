const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: {
        app: './app.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: '/',
        filename: '[name].js',
    },
    target: 'node',
    optimization: {
        minimize: true,
    },
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false, // if you don't put this is, __dirname
        __filename: false, // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: './.env',
        }),
        new JavaScriptObfuscator({
            rotateUnicodeArray: true,
        }),
    ],
};
