/*
 * @Date: 2020-06-06 22:48:58
 * @LastEditors: sk
 * @LastEditTime: 2020-06-06 23:00:07
 */ 
// 匹配script标签
const scripts = /<script[^>]*>/gm
// 匹配script标签上所有的属性
const attrs = /(([^=\s>]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?|>)/mg

class AddAttrsToScript {
    constructor(options = {}) {
        this.options = options
    }

    apply(compiler) {
        // 监听compilation事件
        compiler.plugin('compilation', (compilation) => {
            // 监听 html-webpack-plugin-before-html-processing 事件
            // 这是一个异步插件
            compilation.plugin('html-webpack-plugin-before-html-processing', (data, cb) => {
                // 通过 data.html 取出内存中的html数据，并匹配所有的script标签
                const scriptMatch = data.html.match(scripts);
                if (scriptMatch) {
                    scriptMatch.forEach(script => {
                        // 匹配出所有的属性
                        const scriptSections = script.match(attrs)
                        Object.keys(this.options).forEach(attr => {
                            if (this.options[attr] === true) {
                                scriptSections.splice(scriptSections.length - 1, null, attr)
                            } else {
                                scriptSections.splice(scriptSections.length - 1, null, `${attr}="${this.options[attr]}"`)
                            }
                        })
                        // replace html 中对用的script标签
                        data.html = data.html.replace(script, Array.from(new Set(scriptSections)).join(' '))
                    })
                }
                cb(null, data)
            })
        })
    }
}

module.exports = AddAttrsToScript