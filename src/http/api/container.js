/* eslint-disable */
const api = {
    list: `listPlatformContainers`, // 获取容器组列表；
    detail: `getPlatformContainer`, // 获取容器组详情
    create: `createPlatformContainer`, // 容器组创建
    update: `updatePlatformContainer`, // 容器组更新
    delete: `deletePlatformContainer`, // 删除容器组
    startPlatformContainer: `startPlatformContainer`, // 容器组上线
    stopPlatformContainer: `stopPlatformContainer`, // 容器组下线
    abortPlatformContainer: `abortPlatformContainer`, // 容器组终止
    listAlertUsers: `listAlertUsers`, // 告警联系人
    listAlertTemplates: `listAlertTemplates`, // 告警模板
    listStorageClasses: `listStorageClasses`, // 存储类型-创建容器时用到
    getEvents: `getEvents`, // 获取容器事件
    getMessages: `getMessages`, // 获取容器事件
    getCSNetworks: `getCSNetworks`, // 获取外部网络列表
}

export default api