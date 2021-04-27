
export const DEFAULT_EMPTY_LABEL = '-'
export const API_Prefix = 'application/v1/'
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
export const ApplicationSecondStatuList = {
    NORMAL: 'NORMAL',
    ABNORMAL: 'ABNORMAL'
}
export const ApplicationSecondStatuColor = {
    NORMAL: 'bg-success',
    ABNORMAL: 'bg-danger'
}
