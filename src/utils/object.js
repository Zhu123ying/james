/**
 * 对象数组或数组的深拷贝
 *
 * @param {array}|{object} source
 * @returns
 */
export const objDeepCopy = function (source) {
    let sourceCopy = source instanceof Array ? [] : {}
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' && source[item] !== null ? objDeepCopy(source[item]) : source[item]
    }
    return sourceCopy
}

// --------------common----------------
// 遍历对象
export const indexBy = function (object, key) {
    return Object.keys(object)
        .reduce((result, k) => {
            const value = object[k]
            result[value[key]] = value
            return result
        }, {})
}

// 递归去除对象中属性值为null的项
export const clearNull = (oldObj) => {
    if (typeof oldObj !== 'object' || oldObj === null) {
        return oldObj
    }
    const newObj = {}
    for (let key in oldObj) {
        if (Object.prototype.toString.call(oldObj[key]) === '[object Object]') {
            newObj[key] = clearNull(oldObj[key])
        } else if (oldObj[key] !== null) {
            newObj[key] = oldObj[key]
        }
    }
    return newObj
}

// 去除对象中值为[null, undefined]的项 不递归
export const deleteNullParam = (obj) => {
    return Object.entries(obj).filter(([key, val]) => {
        return val !== null && val !== undefined
    }).reduce((prev, [key, val]) => ({
        ...prev,
        [key]: val
    }), {})
}

// 去除对象中值为[null, undefined，'']的项 不递归
export const clearEmpty = (obj) => {
    return Object.entries(obj).filter(([key, val]) => {
        return val !== null && val !== undefined && val !== ''
    }).reduce((prev, [key, val]) => ({
        ...prev,
        [key]: val
    }), {})
}
