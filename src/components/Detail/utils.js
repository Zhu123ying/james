export const DOT = {
    PRIMARY: 'primary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
}

export const EDITABLE = {
    NAME: 'NAME',
    DESC: 'DESC'
}

export const getStatusDot = (status) => {
    let staticType = DOT.PRIMARY
    switch (status) {
        case '等待中':
            staticType = DOT.PRIMARY
            break
        case '已挂载':
        case '已启用':
        case '运行中':
        case 'START':
        case '正常':
        case '已共享':
            staticType = DOT.SUCCESS
            break
        case '创建中':
            staticType = DOT.WARNING
            break
        case '待挂载':
        case '已禁用':
        case '不共享':
        case '未知':
            staticType = DOT.DANGER
            break
    }
    return staticType
}

// 裸机异常状态列表
export const BareStatusException = [
    'ESTABLISH_EXCEPTION',
    'ESTABLISH_FAILED',
    'ESTABLISH_TIMEOUT',
    'ESTABLISH_TRACK_TIMEOUT',
    'RELEASE_FAILED',
    'RELEASE_TIMEOUT',
    'RELEASE_EXCEPTION',
    'RELEASE_TRACK_TIMEOUT',
    'RELEASE_WITH_INTERFACE_DELETE_ERROR'
]
// 裸机状态，返回{状态值，状态值的国际化key, 状态值的颜色标记}
export const BareStatus = (key) => {
    key = key.toUpperCase() || 'Unknown'
    let intl = key
    let type = 'primary'
    if (BareStatusException.includes(key)) {
        intl = 'MISC_Bare Exception' // 异常
        type = 'danger'
    } else {
        switch (key) {
            case 'ESTABLISH_NOT':
                intl = 'MISC_Bare Enable' // 可用
                type = 'success'
                break
            case 'ESTABLISH_DONE':
                intl = 'MISC_Bare Running' // 运行中
                type = 'success'
                break
            case 'RELEASE_PENDING':
            case 'RELEASE_DOING':
                intl = 'MISC_Bare Release Doing' // 释放中
                type = 'warning'
                break
            case 'ESTABLISH_PENDING':
            case 'ESTABLISH_DOING':
                intl = 'MISC_Bare Doing' // 部署中
                type = 'warning'
                break
            case 'DISCOVERY_DOING':
            case 'DISCOVERY_PENDING':
                intl = 'MISC_Bare Discovery Doing' // 发现中--未使用裸机列表
                type = 'warning'
                break
            case 'DISCOVERY_FAILED':
            case 'DISCOVERY_TIMEOUT':
            case 'DISCOVERY_EXCEPTION':
            case 'DISCOVERY_TRACK_TIMEOUT':
                intl = 'MISC_Bare Discovery Failed' // 发现异常--未使用裸机列表
                type = 'danger'
                break
            case 'ENABLE':
                intl = 'Enable' // 启用--未使用裸机列表
                type = 'success'
                break
            case 'DISABLE':
                intl = 'Disable' // 禁用--未使用裸机列表
                type = 'danger'
                break
            default:
                intl = 'StateUnknown'
                type = 'primary'
        }
    }
    return {
        title: key,
        intlKey: intl,
        type
    }
}
// 裸机电源异常状态表
const BarePowerStatusException = [
    'TURN_ON_FAILED',
    'TURN_ON_TIMEOUT',
    'TURN_ON_TRACK_TIMEOUT',
    'TURN_ON_EXCEPTION',
    'TURN_OFF_FAILED',
    'TURN_OFF_TIMEOUT',
    'TURN_OFF_TRACK_TIMEOUT',
    'TURN_OFF_EXCEPTION',
    'REBOOT_FAILED',
    'REBOOT_TIMEOUT',
    'REBOOT_TRACK_TIMEOUT',
    'REBOOT_EXCEPTION'
]
// 裸机电源状态，返回{状态值，状态值的国际化key, 状态值的颜色标记}
export const BarePowerStatus = (key) => {
    key = key.toUpperCase() || 'Unknown'
    let intl = key
    let type = 'primary'
    if (BarePowerStatusException.includes(key)) {
        intl = 'MISC_Bare Exception' // 异常
        type = 'danger'
    } else {
        switch (key) {
            case 'TURN_ON_DONE':
                intl = 'MISC_Bare Open' // 开启
                type = 'success'
                break
            case 'TURN_OFF_DONE':
                intl = 'MISC_Bare Close' // 关闭
                type = 'primary'
                break
            case 'TURN_ON_PENDING':
            case 'TURN_ON_DOING':
                intl = 'MISC_Bare Turn On' // 开机中
                type = 'warning'
                break
            case 'TURN_OFF_PENDING':
            case 'TURN_OFF_DOING':
                intl = 'MISC_Bare Turn Off' // 关机中
                type = 'warning'
                break
            case 'REBOOT_PENDING':
            case 'REBOOT_DOING':
                intl = 'MISC_Bare Reboot' // 重启中
                type = 'warning'
                break
            default:
                intl = 'StateUnknown'
                type = 'primary'
        }
    }
    return {
        title: key,
        intlKey: intl,
        type
    }
}
