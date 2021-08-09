/* eslint-disable */
import { Icon, Notification } from 'ultraui'
import request, { extend } from 'umi-request';
import { getCurrentUser } from '~/utils/cache'

const prefix = '/api/'
if (process.env.NODE_ENV === 'development') {
    // 模拟加入sessionId
    const set = function (name, value, day = 30) {
        const exp = new Date()
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
        document.cookie = `${name}=${encodeURI(value)};expires=${exp.toGMTString()}; path=/`
    }
    set('sessionId', 'identity:login.session:9de0a582-0f01-4a19-b9a5-d9a6452295c3_10.51.80.99_623adfbe-5186-4762-bfbf-5962905af256')
}

// request拦截器
request.interceptors.request.use((url, options) => {
    const { roleType, roleId } = getCurrentUser()
    return {
        url: `${prefix}${url}`, // request拦截器为入参api字符串添加前缀
        options: {
            ...options,
            interceptors: true,
            headers: roleType === 'Project' ? {
                'X-Role-Id': roleId
            } : {}
        }
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
        console.log(response)
        if (callback.fail) {
            callback.fail(response)
        } else {
            const language = window.LanguageData[window.LangCode]
            const { errorCode, errorMessage } = response || {}
            notification.notice({
                id: new Date(),
                type: 'danger',
                title: language['ErrorPrompt'],
                content: errorCode && language[errorCode] ? language[errorCode] : errorMessage,
                iconNode: 'icon-error-s',
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
                const { errorCode, errorMessage } = response || {}
                notification.notice({
                    id: new Date(),
                    type: 'danger',
                    title: language['ErrorPrompt'],
                    content: errorCode && language[errorCode] ? language[errorCode] : errorMessage,
                    iconNode: 'icon-error-s',
                    duration: 5,
                    closable: true
                })
            }
        }
        callback.complete && callback.complete(response)
    })
}
export default HuayunRequest