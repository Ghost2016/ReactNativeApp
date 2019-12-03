const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const Glob = require('glob');
const srcDir = path.resolve(process.cwd(), 'src');
const devMode = process.env.NODE_ENV !== 'production'
const devModeName = 'production' //'development'; // 'production'
// 入口 js
let entryJs = (function () {
    var entryJsFiles = Glob.sync(srcDir + '/view/*.js');
    var entryJsMap = {};

    entryJsFiles.forEach(function (filePath) {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        entryJsMap[filename] = filePath;
    });

    return entryJsMap
})();

// 多文件html封装打包
var Htmlplugins = (function () {
    var entryHtml = Glob.sync(srcDir + '/*.html');
    var r = [];

    entryHtml.forEach(function (filePath) {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));

        var conf = {
            filename: filename + '.html',       // 生成的 html 存放路径，相对于 path
            inject: 'body',
            template: __dirname + '/src/' + filename + '.html',
            minify: {                           // 压缩 HTML 文件
                removeComments: true,           // 移除 HTML 中的注释
                collapseWhitespace: false       // 删除空白符与换行符
            },
            chunks: ['common', filename],
        };
        r.push(new HtmlWebpackPlugin(conf));
    });
    //console.warn("HtmlWebpackPlugin", r)
    return r;
})();

/* for (const k in entryJs) {
    entryJs[k] = [entryJs[k], 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=5000']
    //,'./client.js'
} */
entryJs.vendor = ['moment','antd']
//console.warn("entryJs", entryJs)
module.exports = {
    mode: devModeName,
    entry: entryJs,
    output: {
        // path: path.resolve(__dirname, 'dist'),
        // filename: './vendor.js',
        filename: '[name].js',
        path: path.resolve(__dirname, 'www'),
        // publicPath: '',
        chunkFilename: '[name].js'
    },
    externals: {
        // jquery: 'jQuery.noConflict()',   //或者jquery:'jQuery' // 当使用了<script>引入jquery时候需要手动打开这句注释
        // layer: 'layer',
    },
    resolve: {
        // extensions: ['', '.js', '.json'],
        extensions: ['.js', '.json'],
        alias: {
            component: __dirname + '/src/component',
            config: __dirname + '/src/config',
            containers: __dirname + '/src/containers',
            mock: __dirname + '/src/mock',
            router: __dirname + '/src/router',
            action: __dirname + '/src/redux/action',
            reducer: __dirname + '/src/redux/reducer',
            store: __dirname + '/src/redux/store',
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                //enforce: "pre",
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'es2017', 'react', 'stage-0', 'stage-1', 'stage-2']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css|less$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                  ],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                enforce: "pre",
                // loader: 'file-loader?limit=8192&name=/images/[name].[ext]'
                loader: 'url-loader?limit=8192',
            },
            /* {
                test: /\.json$/,
                enforce: "pre",
                // loader: 'file-loader?limit=8192&name=/images/[name].[ext]'
                loader: 'json-loader',
            }, */
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                enforce: "pre",
                loader: 'file-loader?limit=10000&name=/fonts/[name].[ext]'
            }
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                cache: true,
                uglifyOptions: {
                    output: {
                        comments: /@license/i
                    }
                },
                extractComments: true,
            })
        ],
        namedModules: true, // NamedModulesPlugin()
        /* splitChunks: { // CommonsChunkPlugin()
            name: 'vendor',
            minChunks: 2
        }, */
        splitChunks: {
            cacheGroups: {
              commons: {
                name: 'vendor',
                chunks: 'initial',
                minChunks: 2
              }
            }
          },
        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: true //ModuleConcatenationPlugin
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
            cache: true,
          }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(devModeName)
            },
            PRODUCTION: JSON.stringify(true),
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./manifest.json'),
        // }),

        // new OpenBrowserPlugin({
        //     url: 'http://localhost:30001'
        // }),
        // // 分析代码
        //new BundleAnalyzerPlugin({ analyzerPort: 30010, }),
        /* new webpack.DllReferencePlugin({
            context: __dirname,
            scope: "xyz",
            manifest: require("./manifest.json"),
            sourceType: "commonsjs2",
        }), */
        new CopyWebpackPlugin([
            {
                from: __dirname + "/src/component/images", to: __dirname + '/www/images'
            },
            {
                from: __dirname + "/src/libs", to: __dirname + '/www/libs'
            }
        ])
    ].concat(Htmlplugins),
    devtool: '#source-map',
    devServer: {
        contentBase: __dirname + './www',
        compress: true,
        port: 30005,
        inline: false,
        host: '192.168.0.226', //'192.168.100.7',
        historyApiFallback: true
    }
};