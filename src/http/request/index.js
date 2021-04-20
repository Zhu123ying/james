
import request from 'umi-request'

const HuayunRequest = (api, param, callback) => request
    .post(api, { data: param })
    .then(function(response) {
        callback.success && callback.success(response)
    })
    .catch(function(error) {
        callback.fail && callback.fail(error)
    })

// request拦截器
request.interceptors.request.use((url, options) => {
    console.info('request拦截器开始工作')
    return {
      url: `/api/${url}`, // request拦截器为入参api字符串添加前缀
      options: { ...options, interceptors: true }
    }
})

// response拦截器
request.interceptors.response.use(response => {
    console.info('response拦截器开始工作，可以进行一些鉴权操作，在处理页面自定义的处理函数之前进行全局验证')
    return response
})

export default HuayunRequest