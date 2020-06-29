let loaderUtils = require('loader-utils')   // loader的一些集合方法

function loader (source) {
    // loader中的this：指当前loader的执行上下文
    // console.log(Object.keys(this))

    // 取到当前loader的options选项，也就是当前loader的配置
    console.log('======= custom-loader-start ======')
    console.log(loaderUtils.getOptions(this))
    console.log('======= custom-loader-end ======\n')

    // console.log(source)

    return source
}

module.exports = loader