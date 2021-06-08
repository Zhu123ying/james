// 分页字段
export const DEFAULT_EMPTY_LABEL = '-'
export const DEFULT_PAGE_SIZE = 20 // 默认列表分页大小
// 接口前缀
export const API_Prefix = 'application/v1/'
// 应用一级状态（部署状态）
export const ApplicationStatuList = {
    unknown: '未知状态',
    deployed: '已部署',
    uninstalled: '已下线',
    uninstalling: '下线中',
    'pending-install': '等待上线',
    'pending-upgrade': '等待更新',
    'pending-rollback': '等待回滚',
    config: '配置中',
    failed: '失败'
}
// 应用二级状态（健康状态）
export const ApplicationSecondStatuList = {
    NORMAL: '健康',
    ABNORMAL: '异常'
}
// 应用发布任务状态
export const ApplicationPublishTaskStatuList = {
    config: '配置中',
    releasing: '发布中',
    released: '发布完成',
    fail: '发布失败',
    rollbacked: '回滚完成',
    rollbackfail: '回滚失败',
    cancel: '取消'
}
// 容器一级状态
export const ContainerStateList = {
    config: '配置中',
    starting: '启动中',
    running: '运行中',
    stopping: '停止中',
    startFailed: '启动失败',
    stopFailed: '停止失败'
}
// 容器二级状态
export const ContainerStatusList = {
    config: '配置中',
    running: '运行中',
    error: '异常'
}
