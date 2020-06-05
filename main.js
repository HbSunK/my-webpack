/*
 * @Date: 2020-06-05 09:28:06
 * @LastEditors: sk
 * @LastEditTime: 2020-06-05 22:00:24
 */ 

// css 文件可以通过 import和require的方式引入
require('./public/index.css')
import "./public/body.scss";
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



let xhr = new XMLHttpRequest();
xhr.open('GET', '/api/user', true)

xhr.onload = function () {
    console.log(xhr.response);
}
xhr.send('request data')
