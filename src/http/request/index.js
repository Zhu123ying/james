/* eslint-disable */
import { Icon, Notification } from 'ultraui'
import request, { extend } from 'umi-request';

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

const HuayunRequest = (api, param, callback) => http
    .post(api, {
        data: param,
        headers: {
            "visitorId": '9de0a582-0f01-4a19-b9a5-d9a6452295c3'
        }
    }).then(function (response) {
        callback.success && callback.success(response)
    }).catch(function (response) {
        if (callback.fail) {
            callback.fail(response)
        } else {
            notification.notice({
                id: new Date(),
                type: 'danger',
                title: '错误提示',
                content: res.message,
                iconNode: 'icon-error-o',
                duration: 30,
                closable: true
            })
        }
    })

export default HuayunRequest