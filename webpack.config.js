/*
 * @Date: 2020-06-05 09:28:58
 * @LastEditors: sk
 * @LastEditTime: 2020-06-08 16:05:53
 */ 
let webpack = require('webpack')
let path = require('path')

// html模板插件
let HtmlWebpackPlugin = require('html-webpack-plugin')

// 抽离css插件，将css变成通过link标签的方式插入到head中
let miniCssExtractPlugin = require('mini-css-extract-plugin')

// 处理css文件压缩，如果单独使用了压缩css的插件，会导致js文件压缩失败，需要在此结合使用
const TerserWebpackPlugin = require('terser-webpack-plugin');    // 压缩js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');  // 压缩css

// 删除文件，需要注意引入方式较为特殊
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 复制文件
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 多线程打包
const Happypack = require('happypack')

// webpack打包分析工具，可视化性能指标展示，用于性能优化
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
        publicPath: './',                   // 页面资源引用的路径或者 CDN 地址
        chunkFilename: '[name].js',         // 代码拆分后的文件名
        crossOriginLoading: 'anonymous',    // 配置这个异步插入的标签的 crossorigin 值
        library: 'outputName'               // 对打包后的文件赋予全局变量，之前打包后的文件是一个闭包，现在会把这个闭包的返回值付给定义的全局变量，在此是outputName
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

        // 本地mock数据，部分开发情况时会启用，可结合mockjs使用，提升开发效率
        before(app) {

            //app代表node中的express的中间层
            app.get('/api/user', (req, res) => {
                res.json({
                    name: 'sk-mock'
                })
            })
        }
    },  

    // 解析第三方依赖
    resolve: {
        modules: [
            path.resolve('node_modules'),   // 当前配置的是只解析node_modules下的依赖，可向数组中追加
        ],

        // 自动查找文件后缀，否则如果 import 这种方式引入的而文件默认都是找js、css文件
        // 指定后缀之后，会按照数组的顺序依次查找，减少写后缀的过程
        extensions: ['.js', '.css'],

        // 设置优先查找每个插件的主入口，提升查找效率，默认为main文件
        mainFields: ['main'],

        // 规定主入口文件的名字，默认为index.js
        mainFiles: ['index.js'],

        // 别名，用较短的标识去表示路径，写起来更便捷
        alias: {
            '@': './src'
        }
    },

    // 实时编译，修改代码后自动打包
    // watch: true,
    // watchOptions: {             // watch的监控选项
    //     poll: 1000,             // 每秒检测的频率
    //     aggregateTimeout: 500,      // 防抖，停止保存500毫秒后才会打包，性能上的优化
    //     ignored: /node_modules/ // 忽略对改文件夹内容的监控
    // },

    // 自定义loader的使用路径，在此例子中的含义是，先从node_modules中查找，如果node_modules未找到就从loader文件夹中查找
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    },

    // 使用loader
    module: {    
        // 不去解析某些依赖，此处例子为：遇到jquery时不分析其依赖，提升打包速度
        noParse: /jquery/,

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
                'sass-loader',                  // 将sass转成css

                // 引入自定义loader
                {
                    loader: 'custom-loader',
                    options: {
                        aaa: [123, 345]
                    }
                }
            ]
        }, {
            test: /.js$/,
            exclude: /node_modules/,            // 忽略依赖插件目录的识别，提升打包速度，不分析该文件夹下的依赖
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

        // webpack打包分析工具，可视化性能指标展示，用于性能优化
        // new BundleAnalyzerPlugin({
        //     //  可以是`server`，`static`或`disabled`。
        //     //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //     //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //     //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        //     analyzerMode: 'server',
        //     //  将在“服务器”模式下使用的主机启动HTTP服务器。
        //     analyzerHost: '127.0.0.1',
        //     //  将在“服务器”模式下使用的端口启动HTTP服务器。
        //     analyzerPort: 8002,
        //     //  路径捆绑，将在`static`模式下生成的报告文件。
        //     //  相对于捆绑输出目录。
        //     reportFilename: 'report.html',
        //     //  模块大小默认显示在报告中。
        //     //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //     //  有关更多信息，请参见“定义”一节。
        //     defaultSizes: 'parsed',
        //     //  在默认浏览器中自动打开报告
        //     openAnalyzer: true,
        //     //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        //     generateStatsFile: false,
        //     //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //     //  相对于捆绑输出目录。
        //     statsFilename: 'stats.json',
        //     //  stats.toJson（）方法的选项。
        //     //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //     //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        //     statsOptions: null,
        //     logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        // }),

        // 添加动态链接库，提升打包速度
        // 用法是：先打包第三方依赖，这些依赖很少改动，所以不需要每次改动都要参与打包，将第三方依赖标识出来，如果第三方包已经打包过一次，就直接引入打包好的文件
        new webpack.DllReferencePlugin({
            manifest: require('./dist/vendor-manifest.json')
        }),

        // 自定定义环境变量，可以在所有模块中使用
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'dev'"
        }),

        // 使用html模板生成
        new HtmlWebpackPlugin({
            template: './public/index.html',    // 使用的模板路径
            filename: 'index.html',             // 对生成的模板重新命名
            title: '自动生成 HTML',

            // 需要引入的代码块，如果不写此配置，就会把多入口的依赖都引入html中
            // 此处的配置，只会从entry中找到 main 入口的所有依赖，引入到页面中
            chunks: ['main'],

            // 处理 html 注入 js 添加跨域标识
            attributes: {
                crossorigin: 'anonymous'
            },

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
            attributes: {
                crossorigin: 'anonymous'
            },           
            minify: {
                // 压缩 HTML 文件
                removeComments: true,           // 移除 HTML 中的注释
                collapseWhitespace: true,       // 删除空白符与换行符
                minifyCSS: true                 // 压缩内联 css
            },
        }),
        // TODO: 添加js 标签中的 crossorigin 属性
        
        // 抽离css，此插件会将所有css变成一个css文件，由link标签引入
        new miniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',// 可以在此加输出的目录路径、hash
            chunkFilename: '[id].css'
        }),

        // 打印热更新的模块路径
        new webpack.NamedModulesPlugin(),

        // 热更新插件，需要单独配置才能实现不刷新页面 只刷新局部的效果
        new webpack.HotModuleReplacementPlugin(),

        // 复制文件
        new CopyWebpackPlugin({
            patterns: [{
                from: './static',
                to: './'
            }]
        })
    ],

    // 优化项，webpack相关的优化基本都会要在整理
    // 该优化项中的配置，只会在生产模式（mode为production）生效
    optimization: {
        minimizer: [
            new CleanWebpackPlugin(), // 先清空目录
            new TerserWebpackPlugin({
                cache: true,        // 是否使用缓存，如果文件没有修改，则不会打包未修改的文件
                parallel: true,     // 是否并发打包
                sourceMap: true     // 开启源码映射，用于线上调试
            }), 
            new OptimizeCSSAssetsPlugin({})
        ],

        // 代码分割，提出公共部分代码
        splitChunks: {
            // vendor: {                   // 对引入的第三方依赖包进行优化，多次引入的情况就单独打包出来
            //     test: /node_modules/,
            //     priority: 10            // 添加权重，值越大越优先执行
            // },
            cacheGroups: {              // 缓存组
                comm: {                 // 此处的comm为 抽离公共代码后的文件名
                    minSize: 0,         // 文件超过0kb就会被打包
                    chunks: 'initial',
                    minChunks: 2        // 文件的引入大于等于2次就会被打包
                }
            }
        }
    }
}
