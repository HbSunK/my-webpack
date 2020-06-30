const babel = require('@babel/core')
const t = require('@babel/types')
const code = 'const a = () => {return 123}'

const es5Code = babel.transform(code, {
    // presets: [
    //     './my-webpack/my-webpack/node_modules/@babel/preset-env'
    // ],
    plugins: ['./my-webpack/my-webpack/node_modules/@babel/plugin-transform-arrow-functions'],
})

// const pluginsArr = es5Code.options.plugins.map(item => item.key)
// console.log(pluginsArr)
// console.log(es5Code.code)

const arrowPlugin = {
    // 访问者模式
    visitor: {
        // 当访问到某个路径的时候进行匹配
        ArrowFunctionExpression (path) {
            // 拿到节点
            const node = path.node
            console.log('ArrowFunctionExpression -> node', node)

            path.arrowFunctionToExpression({
                allowInsertArrow: false,
                specCompliant: false
            })
        }
    }
}

const r = babel.transform(code, {
    plugins: [arrowPlugin],
})
console.log(r)