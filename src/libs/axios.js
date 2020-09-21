import Axios from 'axios'
import router from '../router'
import { MessageBox } from 'element-ui'

// 接口地址
const hostname = localStorage.getItem('hostname') || 'http://localhost'  // https://sjs.aylsonclub.com
const port = localStorage.getItem('port') || '8080'
const baseURL = `${hostname}:${port}` //开发环境

localStorage.setItem('hostname', hostname)
localStorage.setItem('port', port)

// 封装请求
const axios = Axios.create({
    baseURL,
    withCredentials: true
})
// 登陆过期
let hasShowMessageBox = false
function loginPast () {
    // if (!hasShowMessageBox) {
    //     hasShowMessageBox = true
    //     MessageBox.confirm('登陆过期，请重新登录','提示',{
    //         confirmButtonText: '确定',
    //         showCancelButton: false,
    //         closeOnClickModal: false
    //     }).then(()=>{
    //         hasShowMessageBox = false
    //         router.push({ path: '#/login' })
    //     }).catch(()=>{
    //         hasShowMessageBox = false
    //     })
    // }
}

axios.interceptors.response.use(config => {
    const response = config.data
    switch(response.code) {
        case -401:
            console.log(response.msg)
            return
    }
    if (typeof response === 'String') {
        this.loginPast()
    }

    return response
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break;
            case 401:
                error.message = '未授权，请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                break;
            case 405:
                error.message = '请求方法未允许'
                break;
            case 408:
                error.message = '请求超时'
                break;
            case 500:
                error.message = '服务器端出错'
                break;
            case 501:
                error.message = '网络未实现'
                break;
            case 502:
                error.message = '网络错误'
                break;
            case 503:
                error.message = '服务不可用'
                break;
            case 504:
                error.message = '网络超时'
                break;
            case 505:
                error.message = 'http版本不支持该请求'
                break;
            default:
                error.message = `连接错误${error.response.status}`
        }
    } else {
        error.message = "连接到服务器失败"
    }
    return Promise.reject(error.message)
})

export {
    baseURL,
    axios,
}
