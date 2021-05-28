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
}

export default api