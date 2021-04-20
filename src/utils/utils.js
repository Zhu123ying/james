import _ from 'lodash'

let markType = ''
let markReturn = {}
/**
 * 解析type字符串
 * @param  {string} type
 * @return {object}
 */
export const parseType = (type) => {
    if (type !== markType) {
        const s = type.split('_')

        markType = type
        markReturn = {
            app: s[1],
            model: _.slice(s, 2, -1).join('.'),
            method: s[0].toLowerCase(),
            result: _.slice(s, -1)[0]
        }
    }
    return markReturn
}

/**
 * 解析apis url 结构体
 * @param  {string || array} urlStruct
 * @return {object}
 */
export const parseUrlStruct = (urlStruct) => {
    let url
    let method = 'post'
    let initData = {}

    if (_.isString(urlStruct)) {
        url = urlStruct
    } else if (_.isArray(urlStruct)) {
        url = urlStruct[0]
        method = urlStruct[1] || 'get'
        initData = urlStruct[2] || {}
    }
    return {
        url,
        method,
        initData
    }
}

// Binary kilo unit
export const Ki = 1024
// Binary mega unit
export const Mi = 1024 ** 2
// Binary giga unit
export const Gi = 1024 ** 3
// Binary tera unit
export const Ti = 1024 ** 4
// Binary peta unit
export const Pi = 1024 ** 5
// Binary exa unit
// export const Ei = 1024 ** 6
// // Binary zetta unit
// export const Zi = 1024 ** 7
// // Binary yotta unit
// export const Yi = 1024 ** 8

function isInteger(obj) {
    return Math.floor(obj) === obj
}

export function calCore(cpu) {
    let core = Number.parseInt(cpu)
    if (isNaN(core)) {
        return cpu || '-'
    } else {
        // if (core > 1) {
        //     return `${core} cores`
        // } else {
        //     return `${core} core`
        // }
        return `${core}核`
    }
}

export function getCore(cpu) {
    let core = cpu
    if (core === '') {
        return '-'
    } else {
        let arr = core.split('-')
        return `${arr[0]}*${arr[1]}核`
    }
}

// 获取数字以及字符随机码
export function getRandomCode(len) {
    len = len || 32
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

/** ********************格式化桌面的一些render规则**************************/

// 操作系统或镜像规格格式化显示
export function formatImageSystem(property) {
    if (property !== null) {
        if (property.osDistribution && property.osBit) {
            return `${property.osDistribution} ${property.osBit}`
        }
    }
    return '-'
}

/*
 0: 'NO STATE', 无状态
 1: 'RUNNING', 运行中
 2: 'BLOCKED', 故障
 3: 'PAUSED', 暂停
 4: 'SHUTDOWN', 关闭
 5: 'CRASHED', 崩溃
 6: 'SUSPENDED', 挂起
 7: 'FAILED', 失败
 8: 'BUILDING', 创建中
 */
export function getPowerState(instance) {
    /*
    instance:
        参数来源:
        1. /restapi/compute/instances/{instance_id}/
        2. /restapi/compute/instances/
     */
    const status = ['无状态', '运行中', '故障', '暂停', '关闭', '崩溃', '挂起', '失败', '创建中']
    let n = instance['OS-EXT-STS:power_state']
    if (n >= 0 && n < 9) {
        return status[n]
    } else {
        return '-'
    }
}

export function formatMemory(number, numberUnit) {
    let floatNumber = Number.parseFloat(number)
    if (isNaN(floatNumber)) {
        return {
            num: 0,
            unit: 'GB'
        }
    } else {
        let bytes = floatNumber * numberUnit
        if (bytes === 0) {
            return {
                num: 0,
                unit: 'GB'
            }
        } else if (bytes < Ki) {
            let res = Number(bytes.toFixed(2))
            if (res > 1) {
                return {
                    num: res,
                    unit: 'Bytes'
                }
            } else {
                return {
                    num: res,
                    unit: 'Byte'
                }
            }
        } else if (bytes < Mi) {
            return {
                num: isInteger(bytes / Ki) ? (bytes / Ki) : (bytes / Ki).toFixed(2),
                unit: 'KB'
            }
        } else if (bytes < Gi) {
            return {
                num: isInteger(bytes / Mi) ? (bytes / Mi) : (bytes / Mi).toFixed(2),
                unit: 'MB'
            }
        } else if (bytes < Ti) {
            return {
                num: isInteger(bytes / Gi) ? (bytes / Gi) : (bytes / Gi).toFixed(2),
                unit: 'GB'
            }
        } else if (bytes < Pi) {
            return {
                num: isInteger(bytes / Ti) ? (bytes / Ti) : (bytes / Ti).toFixed(2),
                unit: 'TB'
            }
        } else {
            return {
                num: isInteger(bytes / Pi) ? (bytes / Pi) : (bytes / Pi).toFixed(2),
                unit: 'PB'
            }
        }
    }
}

export function donottellyou(originalString) {
    let Buffer = require('safe-buffer').Buffer
    let newString = Buffer.from(originalString).toString('base64')
    return newString
}

export function rcFromValidate(form) {
    let valid = false
    form.validateFields((error, values) => {
        valid = !error
    })
    return valid
}

export const getCPUPerSlotByNatural = (cpuNum) => {
    const res = []
    for (let i = 1; i <= cpuNum; i++) {
        if (cpuNum % i === 0) {
            res.push(i)
        }
    }
    return res
}
