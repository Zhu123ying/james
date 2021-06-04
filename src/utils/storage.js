/* eslint-disable */
/*
 * @Author: zhangfeng 
 * @Date: 2019-02-12 16:49:06 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-04 09:56:37
 */

import moment from 'moment'
import { STORAGE_KEYS } from '~/constants/storageTypes'

const storage = window.localStorage

const isAuthenticKey = (key) => {
    try {
        if (!key || !Object.values(STORAGE_KEYS).includes(key)) {
            // 抛出一个异常， key不在规定的范围
            throw new Error('this key is not within the specified range !')
        }
        return true
    } catch (error) {
        console.error(error.message)
    }
}
/**
 * set
 * @param millisecond number 保存多长时间(毫秒)
 */
export const set = (key, value = '', millisecond = -1) => {
    if (!isAuthenticKey(key)) {
        return
    }

    const data = {
        value,
        timestamp: millisecond === -1 ? millisecond : moment().valueOf() + millisecond
    }

    storage.setItem(key, JSON.stringify(data))
}

export const get = (key) => {
    if (!isAuthenticKey(key)) {
        return
    }

    const data = JSON.parse(storage.getItem(key))
    // 结束时间戳大于当前时间戳或没有限制
    if (data && (data.timestamp > moment().valueOf() || data.timestamp === -1)) {
        return data.value
    }

    // 结束时间戳小于当前时间移除key返回null
    remove(key)
    return null
}

const one = (key) => {
    let res = JSON.parse(JSON.stringify(get(key)))
    remove(key)
    return res
}

export const remove = (key) => {
    if (!isAuthenticKey(key)) {
        return
    }

    storage.removeItem(key)
}

export const clear = () => {
    Object.values(STORAGE_KEYS).forEach(key => storage.removeItem(key))
}

const setJumpData = (data) => {
    set(STORAGE_KEYS.JUMP_TEMPLE, data)
}

const getJumpData = () => {
    return one(STORAGE_KEYS.JUMP_TEMPLE) || {}
}

const session = (key, value) => {
    if (value === undefined) {
        return JSON.parse(window.sessionStorage.getItem(key))
    } else {
        window.sessionStorage.setItem(key, value)
    }
}

export default {
    STORAGE_KEYS,
    set,
    get,
    remove,
    one,
    clear,
    setJumpData,
    getJumpData,
    session
}
