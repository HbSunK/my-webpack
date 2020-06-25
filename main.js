/*
 * @Date: 2020-06-05 09:28:06
 * @LastEditors: sk
 * @LastEditTime: 2020-06-08 16:04:21
 */ 

// css 文件可以通过 import和require的方式引入

import "./public/body.scss";
require('./public/index')      // 在此处没有写css后缀，因为在webpack.config.js中设置了extensions查找后缀名的相关配置，但是不建议对css这么做，从编码习惯上不带后缀名默认就是js文件，这么写容易导致其他开发者在使用上混淆

// import imgSrc from './public/logo.png'
import imgSrc from './public/img.jpg'

// 引入js兼容文件
require('@babel/polyfill')

// 测试es6
const fn = () => {
    console.log('=>')
}
fn()

new Promise(resolve => {
    setTimeout(() => {
        resolve('resolve is run')
    }, 1000)
})

class A {
    constructor (str) {
        this.a = 1
    }
}

let b = new A('class')

console.log(b)
  
let img = new Image();
img.src = imgSrc
document.body.appendChild(img)

console.log(process.env.NODE_ENV, 123)

let xhr = new XMLHttpRequest();
xhr.open('GET', '/api/user', true)

xhr.onload = function () {
    console.log(xhr.response);
}
xhr.send('request data')

