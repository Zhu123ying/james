// 分页字段
export const DEFAULT_EMPTY_LABEL = '-'
export const DEFULT_PAGE_SIZE = 20 // 默认列表分页大小
// 接口前缀
export const API_Prefix = 'application/v1/'
// 应用一级状态（部署状态）
export const ApplicationStatuList = {
    deployed: '已上线',
    uninstalling: '下线中',
    pending_deploy: '上线中',
    pending_upgrade: '更新中',
    pending_rollback: '回滚中',
    config: '配置中',
    failed: '执行失败'
}
export const ApplicationStatuDomList = {
    deployed: <i className='iconfont icon-correct-o text-primary' />,
    uninstalling: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    pending_deploy: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    pending_upgrade: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    pending_rollback: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    config: <i className='iconfont icon-circle text-primary' />,
    failed: <i className='iconfont icon-warning-o text-danger' />
}
// 应用二级状态（健康状态）
export const ApplicationSecondStatuList = {
    NORMAL: '健康',
    ABNORMAL: '异常'
}
export const ApplicationSecondStatuColorList = {
    NORMAL: 'bg-success',
    ABNORMAL: 'bg-danger'
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
// 容器组一级状态
export const ContainerGroupStateList = {
    config: '配置中',
    starting: '上线中',
    running: '已上线',
    stopping: '下线中',
    startFailed: '上线失败',
    stopFailed: '下线失败'
}
export const ContainerGroupStateDomList = {
    config: <i className='iconfont icon-circle text-primary' />,
    starting: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    running: <i className='iconfont icon-correct-o text-primary' />,
    stopping: <div className='rotateClass'><i className='iconfont icon-loading text-primary' /></div>,
    startFailed: <i className='iconfont icon-warning-o text-danger' />,
    stopFailed: <i className='iconfont icon-warning-o text-danger' />
}
// 容器组二级状态
export const ContainerGroupSecondStateList = {
    config: '配置中',
    running: '正常',
    error: '异常',
    unknown: '未知',
    working: '执行中'
}
export const ContainerGroupSecondStateColorList = {
    config: 'bg-default',
    running: 'bg-success',
    error: 'bg-danger',
    unknown: 'bg-danger',
    working: 'bg-default'
}
// 容器状态
export const ContainerStateList = {
    config: '配置中',
    running: '正常',
    waiting: '等待',
    terminated: '已结束',
    error: '异常',
    unknown: '未知'
}
