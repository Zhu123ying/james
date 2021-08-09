// 分页字段
export const DEFAULT_EMPTY_LABEL = '-'
export const DEFULT_PAGE_SIZE = 20 // 默认列表分页大小
// 接口前缀
export const API_Prefix = 'application/v1/'
// 应用一级状态（部署状态）
export const ApplicationStatuList = {
    deployed: 'Deployed',
    uninstalling: 'Uninstalling',
    pending_deploy: 'Pending_deploy',
    pending_upgrade: 'Pending_upgrade',
    pending_rollback: 'Pending_rollback',
    config: 'InConfiguration',
    failed: 'ExecutFailed'
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
    NORMAL: 'NORMAL',
    ABNORMAL: 'ABNORMAL',
    executing: 'Executing'
}
export const ApplicationSecondStatuColorList = {
    NORMAL: 'bg-success',
    ABNORMAL: 'bg-danger',
    executing: 'bg-primary'
}
// 应用发布任务状态
export const ApplicationPublishTaskStatuList = {
    config: 'InConfiguration',
    releasing: 'Releasing',
    released: 'ReleaseFinished',
    fail: 'ReleaseFailed',
    rollbacked: 'RollbackFinished',
    rollbackfail: 'RollbackFailed',
    cancel: 'Cancel',
    success: 'Success'
}
// 容器组一级状态
export const ContainerGroupStateList = {
    config: 'InConfiguration',
    starting: 'Pending_deploy',
    running: 'Deployed',
    stopping: 'Uninstalling',
    startFailed: 'OnlineFailed',
    stopFailed: 'OfflineFailed'
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
    config: 'InConfiguration',
    running: 'Normal',
    error: 'ABNORMAL',
    unknown: 'Unknow',
    working: 'Executing'
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
    config: 'InConfiguration',
    running: 'Normal',
    waiting: 'Waiting',
    terminated: 'Finished',
    error: 'ABNORMAL',
    unknown: 'Unknow'
}
