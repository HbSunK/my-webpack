/*
 * @Date: 2020-06-05 09:28:06
 * @LastEditors: sk
 * @LastEditTime: 2020-06-05 18:34:15
 */ 

// css 文件可以通过 import和require的方式引入
require('./public/index.css')
import "./public/body.scss";
// import imgSrc from './public/logo.png'
import imgSrc from './public/img.jpg'

const fn = () => {
    console.log('=>')
}
fn()

new Promise(resolve => {
    setTimeout(() => {
        console.log(resolve('resolve is run'));
    }, 1000)
})

class A {
    constructor (str) {
        this.a = 1
    }
}

let b = new A('class')

console.log(1, 2, b)
  
let img = new Image();
img.src = imgSrc
document.body.appendChild(img)
