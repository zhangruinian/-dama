/**
 * Created by Administrator on 2016/3/29.
 */
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
var webpack=require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    // 入口文件地址，不需要写完，会自动查找
    entry: {
        app: './src/click/main.js',
        slideApp: './src/slide/main.js',
        navApp: './src/main.js',
        appCheck:'./src/check/main.js',
        appRank:'./src/rank/main.js',
        slideCheck:'./src/slideCheck/main.js',
        vendor: ['vue','es6-promise']
    },
    // 输出
    output: {
        path: path.resolve(__dirname, '../dist'),
        //publicPath: '/dist/',
        filename: '[name].[hash:7].js'
    },
    // 加载器
    module: {
        rules: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options:{
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ],
                    less: ExtractTextPlugin.extract({
                        loader: 'css-loader!less-loader',
                        fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
                    })
                }
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015',"stage-3"],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
        ]
    },
    /*module: {
        // 加载器
        loaders: [
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: 'style!css!autoprefixer'},
            //.scss 文件想要编译，scss就需要这些东西！来编译处理
            //install css-loader style-loader sass-loader node-sass --save-dev
            {
                test: /\.less$/,
                loader: 'style!css!less?sourceMap'},
            // 图片转化，小于8K自动转化为base64的编码

            //html模板编译？
            {test: /\.(html|tpl)$/, loader: 'html-loader'}
        ]
    },*/
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename: 'vendor.js',
            minChunks:Infinity
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-点击样式',
            template:  './src/click/index.html',
            filename: 'click.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks: ['app', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-滑动打码',
            template:  './src/slide/index.html',
            filename: 'slide.html',
            chunks: ['slideApp', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-导航',
            template:  './src/index.html',
            filename: 'index.html',
            chunks: ['navApp', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-检查',
            template:  './src/check/index.html',
            filename: 'check.html',
            chunks: ['appCheck', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-排名',
            template:  './src/rank/index.html',
            filename: 'rank.html',
            chunks: ['appRank', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'Geetest-滑动检查',
            template:  './src/slideCheck/index.html',
            filename: 'slideCheck.html',
            chunks: ['slideCheck', 'vendor'],
            //要把script插入到标签里
            inject: 'body'
        })
    ],
    //vue默认到处运行时构建，将vue转换为独立构建
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue'
        }
    },
    devtool: '#eval-source-map'
};
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin(['dist'], {
            root: 'C:/AmateurProject/blog/'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}