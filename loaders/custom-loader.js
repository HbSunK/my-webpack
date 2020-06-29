let loaderUtils = require('loader-utils')   // loader的一些集合方法

function loader (source) {
    // console.log('==================================================')
    // loader中的this：指当前loader的执行上下文
    // console.log(Object.keys(this))

    // 取到当前loader的options选项，也就是当前loader的配置
    console.log(loaderUtils.getOptions(this))

    // console.log(source)

    return source
}

module.exports = loader