import axios from "axios";
import store from '../store/index';


//自定义配置

const instance = axios.create({  //新建一个axious实例， 该对象内为配置项
    timeout: 1000 * 60, //指定请求超时的时间，单位为毫秒
    baseURL:'https://api.trtst.com', //网易云的借口地址
    withCredentials: true, // 表示进行跨域请求时是否携带凭证信息（cookit、HTTP认证及客户端SSL证明等）

    validateStatus: function(states) { //可以自定义抛出的HTTP code 
        return states >= 200 && states < 600 //如果符合该条件 axios 将进行响应处理，如果不满足则抛出一个错误
    }
})

//拦截器:在请求或响应被then或catch处理前拦截
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 未登录，需要重新登录
    if(response.status == 301) //HTTP状态码：永久重定向 
    {
        const accountStore = store.accountInfoStore();

        window.localStorage.removeItem('cookie');
        window.localStorage.removeItem('accountInfo');
        window.localStorage.removeItem('isLogin');
        accountStore.logout();
    }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

  //向接口地址请求的用的方法

const ajaxMethod = ['get', 'post']
const  api = {}

ajaxMethod.forEach((method) => {
    //动态赋予api对象get个post方法
    api[method] = (uri, data, config) => {
        //使用Promise进行一个封装
        return new Promise( (resolve, reject) => {
            //instance实例对象里有get和post两个方法
            instance[method](uri, data, config) //这是一个动态调用的instance对象里的属性和方法，而静态调用则是使用instance.method(uri, data, config)
            //成功
            .then(response => {
                resolve(response)
            })
            //失败
            .catch(error => {
                reject(error)
            })
        })
    } 
})


export default api 