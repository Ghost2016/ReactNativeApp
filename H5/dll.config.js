const webpack = require('webpack');
const path = require('path');

const vendors = [
    'react',
    'react-dom',
    'react-router',
    'react-redux',
    'react-router-redux',
    'es6-promise',
    'antd',
    'isomorphic-fetch',
    'immutable',
    // 'jquery',
    // ...其它库
];
module.exports = {
    output: {
        path: path.join(__dirname, 'www/libs'),
        filename: '[name].js',
        library: '[name]_[hash]',
    },
    entry: {
        "dlllib": vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "manifest.json"),
            name: "[name]_[hash]",
            context: __dirname
        })
    ],
};