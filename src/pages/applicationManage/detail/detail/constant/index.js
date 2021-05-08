/* eslint-disable */
// 资源类型列表
const resourceTypeList = ['ConfigMap', 'CronJob', 'DaemonSet', 'Deployment', 'Ingress', 'Job', 'PersistentVolumeClaim', 'Pod',
    'ReplicaSet', 'ReplicationController', 'Secret', 'Service', 'StatefulSet', 'LimitRange', 'Resourcequota', 'ServiceAccount', 'Other']

// 如果状态是config或者类型是其他，则取configInfo里的数据，否则取runInfo
const getDataKey = (row) => {
    let runInfo = _.get(row, 'runInfo', {})
    let bool = Object.keys(runInfo).length && resourceTypeList.indexOf(row.type) > -1
    return bool ? "runInfo." : "configInfo."
}

// 资源对象综合状态常量
const compositeStateColor = {
    UNDEPLOYED: 'white',
    NORMAL: '#67C23A',
    END: 'darkgreen',
    PENDING: '#909399',
    FAILEDORUNKNOW: '#F56C6C',
    Bound: '#67C23A',
}

module.exports = {
    getDataKey,
    resourceTypeList,
    compositeStateColor
}