
let HtmlWebpackPlugin = require('html-webpack-plugin')

class CustomPlugin {
    constructor () {
        this.customAttrReg = /<script\s+/g
    }

    jsonToKeyValue (obj) {
        if (obj === null || typeof obj !== 'object') return ''

        return Object.keys(obj).reduce((result, key) => `${result}${key}="${obj[key]}" `, '')        
    }

    apply (compile) {
        console.log('======= custom-plugin-start ======')
        
        compile.hooks.compilation.tap('script-tag-add-attributes', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('script-tag-add-attributes', (data, cb) => {
                data.html = data.html.replace(
                    this.customAttrReg, 
                    `<script ${this.jsonToKeyValue(data.plugin.options.attributes)}`
                )
                cb(null, data)
            })
        })

        // 通过 tapAsync 注册异步钩子
        // 通过 tap 注册同步钩子

        // console.log(compile.hooks)

        // compile.hooks.entryOption.tap('custom-plugin-test', (...arg) => {
        //     console.log('entryOption', ...arg)
        // })

        // compile.hooks.afterPlugins.tap('custom-plugin-test', (...arg) => {
        //     console.log('afterPlugins', ...arg)
        // })

        // compile.hooks.afterResolvers.tap('custom-plugin-test', (...arg) => {
        //     console.log('afterResolvers', ...arg)
        // })

        // compile.hooks.environment.tap('custom-plugin-test', (...arg) => {
        //     console.log('environment', ...arg)
        // })

        // compile.hooks.beforeRun.tap('custom-plugin-test', (...arg) => {
        //     console.log('beforeRun', ...arg)
        // })

        // compile.hooks.run.tapAsync('custom-plugin-test', (...arg) => {
        //     console.log('run', ...arg)
        // })

        // compile.hooks.compile.tap('custom-plugin-test', (...arg) => {
        //     console.log('compile', ...arg)
        // })

        // compile.hooks.done.tap('custom-plugin-test', (...arg) => {
        //     console.log('done', ...arg)
        // })

        // compile.hooks.afterPlugins.tap('custom-plugin-test', (...arg) => {
        //     console.log('afterPlugins', ...arg)
        // })

        // compile.hooks.afterPlugins.tap('custom-plugin-test', (...arg) => {
        //     console.log('afterPlugins', ...arg)
        // })

        // compile.hooks.afterPlugins.tap('custom-plugin-test', (...arg) => {
        //     console.log('afterPlugins', ...arg)
        // })

        console.log('=======custom-plugin-end======\n')
    }
}

module.exports = CustomPlugin