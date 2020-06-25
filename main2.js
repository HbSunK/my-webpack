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

  
let img = new Image();
img.src = imgSrc
document.body.appendChild(img)

import vue from 'vue'
import router from 'vue-router'
const myrouter = new router()
vue.use(myrouter)
console.log(vue)

