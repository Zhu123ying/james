/* eslint-disable */
import { Icon, Notification } from 'ultraui'
import request, { extend } from 'umi-request';

if (process.env.NODE_ENV === 'development') {
    // 模拟加入sessionId
    const set = function (name, value, day = 30) {
        const exp = new Date()
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
        document.cookie = `${name}=${encodeURI(value)};expires=${exp.toGMTString()}; path=/`
    }
    set('sessionId', 'identity:login.session:9de0a582-0f01-4a19-b9a5-d9a6452295c3_10.51.60.87_f794776c-1108-4479-bc9f-7f44369cd83d')
}

// request拦截器
request.interceptors.request.use((url, options) => {
    return {
        url: `/api/${url}`, // request拦截器为入参api字符串添加前缀
        options: { ...options, interceptors: true }
    }
})

// response拦截器
request.interceptors.response.use(response => {
    return response
})

const http = extend({
    errorHandler: (error) => {
        return Promise.reject(error.data);
    }
})

const notification = Notification.newInstance()

const HuayunRequest = (api, param, callback = {}) => http
    .post(api, {
        data: param,
    }).then(function (response) {
        callback.success && callback.success(response)
        callback.complete && callback.complete(response)
    }).catch(function (response) {
        if (callback.fail) {
            callback.fail(response)
        } else {
            const language = window.LanguageData[window.LangCode]
            const { data, message } = response
            notification.notice({
                id: new Date(),
                type: 'danger',
                title: '错误提示',
                content: data && data.errorCode ? language[data.errorCode] : message,
                iconNode: 'icon-error-o',
                duration: 5,
                closable: true
            })
        }
        callback.complete && callback.complete(response)
    })

export default HuayunRequest