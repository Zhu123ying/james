/* eslint-disable */
import { Icon, Notification } from 'ultraui'
import request, { extend } from 'umi-request';

const prefix = '/api/'

if (process.env.NODE_ENV === 'development') {
    // 模拟加入sessionId
    const set = function (name, value, day = 30) {
        const exp = new Date()
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
        document.cookie = `${name}=${encodeURI(value)};expires=${exp.toGMTString()}; path=/`
    }
    set('sessionId', 'identity:login.session:9de0a582-0f01-4a19-b9a5-d9a6452295c3_10.51.60.105_16ee15a3-55f5-4b8f-939f-286191378828')
}

// request拦截器
request.interceptors.request.use((url, options) => {
    return {
        url: `${prefix}${url}`, // request拦截器为入参api字符串添加前缀
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
// 普通接口请求
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
            const { data, message } = response || {}
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

// 含有上传的接口
export const HuayunUploadRequest = (api, params, callback = {}) => {
    let formData = new FormData()
    Object.keys(params).forEach(key => {
        formData.append(key, params[key])
    })
    let responseStatus
    return fetch(`${prefix}${api}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    }).then(res => {
        responseStatus = res.status
        return res.json()
    }).then(function (response) {
        if (responseStatus === 200) {
            callback.success && callback.success(response)
        } else {
            if (callback.fail) {
                callback.fail(response)
            } else {
                const language = window.LanguageData[window.LangCode]
                const { data, message } = response || {}
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
        }
        callback.complete && callback.complete(response)
    })
}
export default HuayunRequest