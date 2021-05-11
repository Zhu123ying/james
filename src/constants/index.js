
export const DEFAULT_EMPTY_LABEL = '-'
export const DEFULT_PAGE_SIZE = 20 // 默认列表分页大小
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
    NORMAL: '健康',
    ABNORMAL: '异常'
}
export const ApplicationSecondStatuColor = {
    NORMAL: 'bg-success',
    ABNORMAL: 'bg-danger'
}
