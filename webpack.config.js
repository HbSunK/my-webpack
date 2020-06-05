/*
 * @Date: 2020-06-05 09:28:58
 * @LastEditors: sk
 * @LastEditTime: 2020-06-05 20:04:03
 */ 
let webpack = require('webpack')
let path = require('path')

// html模板插件
let HtmlWebpackPlugin = require('html-webpack-plugin')

// 抽离css插件，将css变成通过link标签的方式插入到head中
let miniCssExtractPlugin = require('mini-css-extract-plugin')

// 处理css文件压缩，如果单独使用了压缩css的插件，会导致js文件压缩失败，需要在此结合使用
const UglifyjsWbpackPlugin = require('uglifyjs-webpack-plugin');    // 压缩js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');  // 压缩css

// 删除文件，需要注意引入方式较为特殊
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 复制文件
const CopyWebpackPlugin = require('copy-webpack-plugin')

// webpack打包的整体配置
module.exports = {
    // mode: 'development',    //开发模式，代码不会压缩
    mode: 'production',     //生产模式，代码会压缩

    // 打包总入口
    entry: {
        main: './main.js',
        main2: './main2.js'
    },

    // 打包输出目录及配置
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',               // 页面资源引用的路径或者 CDN 地址
        chunkFilename: '[name].js'      // 代码拆分后的文件名
    },

    // 开启源码映射，便于线上调试、定位问题
    devtool: 'source-map',                  // 单独的map文件，大而全，输出列和行
    // devtool: 'eval-source-map',             // 不会产生单独的map文件，会与打包到依赖的文件中，大而全，输出列和行信息
    // devtool: 'cheap-module-source-map',     // 单独的map文件，输出行信息
    // devtool: 'cheap-module-eval-source-map',// 不会产生单独的map文件，会与打包到依赖的文件中，输出行信息

    // 开启本地服务相关
    devServer: {                // 开启服务后打包的文件，是存储在计算机内存中的
        port: 8001,             // 服务端口号
        contentBase: './dist',  // 开启服务运行的目录
        progress: true,         // 打包是展示进度条
        open: false,            // 服务开启后默认打开浏览器
        compress: true,         // 开启gzip压缩

        // 开启服务器代理，解决跨域问题
        // proxy: {
        //     '/api': 'http://localhost:3001'
        // },

        // 本地mock数据，部分开发情况时会启用，可结合mockjs使用
        before(app) {
            app.get('/api/user', (req, res) => {
                res.json({
                    name: 'sk-mock'
                })
            })
        }
    },  

    // 实时编译，修改代码后自动打包
    // watch: true,
    // watchOptions: {             // watch的监控选项
    //     poll: 1000,             // 每秒检测的频率
    //     aggregateTimeout: 500,      // 防抖，停止保存500毫秒后才会打包，性能上的优化
    //     ignored: /node_modules/ // 忽略对改文件夹内容的监控
    // },

    // 使用loader
    module: {                   
        rules: [{                   
            test: /.(scss|sass|css)$/,
            use: [                  // rules数组中的loader都是按照都是从下到上、从左到右执行这个顺序执行的
                // {                // loader可以是对象的写法，用于在options中传入多样化配置
                //     loader: 'style-loader', 
                //     options: {}
                // },
                //'style-loader',               // 将处理好的css插入到head中
                miniCssExtractPlugin.loader,    // 使用抽离css的loader，以link标签的形式插入到head中
                'css-loader',                   // 主要是处理了@import这种预发

                // 自动添加浏览器前缀，这种写法需要在根目录下新建名为：postcss.comfig.js中添加配置
                //'postcss-loader',       
                      
                {
                    // 使用 postcss 为 css 加上浏览器前缀
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                },
                'sass-loader'                   // 将sass转成css           
            ]
        }, {
            test: /.js$/,
            exclude: /node_modules/,            // 忽略依赖插件目录的识别
            use: [{                     
                loader: 'babel-loader',         // es6转es5

                // 配置项可以写在这里，也可以在根目录下创建名为.babelrc的文件，将配置写在该文件中
                // options: { 
                //     presets: [
                //         '@babel/preset-env'     
                //     ]
                // }
            }]
        }, {
            test: /\.(jpg|png|gif)$/,
            use: {
                loader: 'url-loader',               // 功能跟file-loader差不多，区别是有转换base64的功能
                options: {
                    name: '[name]_[hash].[ext]',    // ext 是保留源文件后缀
                    outputPath: 'images/',          // dist 目录下的images文件夹
                    publicPath: '',                 // 只对图片链接加前缀

                    // 10kb以下的图片自动转换为base64编码插入到html中，其他正常生成图片
                    limit: 10240          
                }
            }
        }, {
            test: /\.(eot\/ttf\/svg)$/,
            use: {
                loader: 'file-loader'
            }
        }]
    },

    // 使用插件
    plugins: [
        // 使用html模板生成
        new HtmlWebpackPlugin({
            template: './public/index.html',    // 使用的模板路径
            filename: 'index.html',             // 对生成的模板重新命名
            title: '自动生成 HTML',

            // 需要引入的代码块，如果不写此配置，就会把多入口的依赖都引入html中
            // 此处的配置，只会从entry中找到 main 入口的所有依赖，引入到页面中
            chunks: ['main'],

            // 其他配置
            minify: {
                // 压缩 HTML 文件
                removeComments: true,           // 移除 HTML 中的注释
                collapseWhitespace: true,       // 删除空白符与换行符
                minifyCSS: true                 // 压缩内联 css
            },
        }),

        // 多页面打包时，有几个页面就需要 new 几次 HtmlWebpackPlugin 这个插件
        new HtmlWebpackPlugin({
            template: './public/index.html',    // 使用的模板路径
            filename: 'main.html',              // 对生成的模板重新命名
            title: '自动生成 HTML',
            chunks: ['main2'],             
            minify: {
                // 压缩 HTML 文件
                removeComments: true,           // 移除 HTML 中的注释
                collapseWhitespace: true,       // 删除空白符与换行符
                minifyCSS: true                 // 压缩内联 css
            },
        }),

        // 抽离css，此插件会将所有css变成一个css文件，由link标签引入
        new miniCssExtractPlugin({
            filename: 'css/main.[hash:8].css'   // 可以在此加输出的目录路径、hash
        }),

        // 复制文件
        new CopyWebpackPlugin({
            patterns: [{
                from: './doc',
                to: './'
            }]
        })
    ],

    // 优化项，webpack相关的优化基本都会要在整理
    // 该优化项中的配置，只会在生产模式（mode为production）生效
    optimization: {
        minimizer: [
            new CleanWebpackPlugin(), // 先清空目录
            new UglifyjsWbpackPlugin({
                cache: true,        // 是否使用缓存，如果文件没有修改，则不会打包未修改的文件
                parallel: true,     // 是否并发打包
                sourceMap: true     // 开启源码映射，用于线上调试
            }), 
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}
