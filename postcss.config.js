/*
 * @Date: 2020-06-05 15:44:31
 * @LastEditors: sk
 * @LastEditTime: 2020-06-05 15:57:20
 */ 
module.exports = {
    plugins: [
        // 这种写法也可以，但是npm会提示你需要在package.json里添加browserslist这个key的配置，或者新建个.browserslistrc的文件，用这样的方式代替autoprefixer的browsers配置项。算是优化项，不这样搞也不会报错。
        // require('autoprefixer')({
        //     browsers: ['Android >= 4.0', 'iOS >= 7']
        // })
        require('autoprefixer')
    ]
}