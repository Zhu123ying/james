/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    list: `${prefix}listApplication`, // 获取App列表；
    delete: `${prefix}deleteApplication`, // 删除App
    create: `${prefix}createApplication`, // 创建App
    update: `${prefix}updateApplication`, // 更新App
    detail: `${prefix}getApplicationDetail`, // 获取App详情
    deploy: `${prefix}deployApplication`, // 上线应用
    undeploy: `${prefix}undeployApplication`, // 下线应用
    resourceInfor: `${prefix}queryApplicationResourceInfo`, // 资源详情（图表数据）
    statementInfor: `${prefix}queryApplicationDeclarative`, // 声明信息
    clusterResourceInfor: `${prefix}listClusterResourceInfo`, // 集群资源
    upgrade: `${prefix}upgrade`, // 更新
    rollBack: `${prefix}rollBack`, // 回滚
    queryRollBackVersion: `${prefix}queryRollBackVersion`, // 可以回滚的版本记录
    queryApplicationVersionHistory: `${prefix}queryApplicationVersionHistory`, // 历史版本记录
    readCommandExecuteLog: `${prefix}readCommandExecuteLog`, // 日志
    getDetailByAppStoreId: `${prefix}getApplicationPackageStoresForApplication`, // 从appStore进入到创建应用页面获取初始值
    createStoreApplication: `${prefix}createStoreApplication`, // 从应用商店进去创建应用提交
    outputLog: `${prefix}queryCommandExecuteLog`, // 输出历史
    getAvailableQuota: `${prefix}queryProjectQuota`, // 获取剩余可用配额 
    updateApplicationQuota: `${prefix}updateApplicationQuota`, // 更新应用配额
    queryApplicationGateway: `${prefix}queryApplicationGateway`, // 获取应用入口
    deleteApplicationGateway: `${prefix}deleteApplicationGateway`, // 删除应用入口
    createApplicationGateway: `${prefix}createApplicationGateway`, // 创建应用入口
    updateApplicationGateway: `${prefix}updateApplicationGateway`, // 编辑应用入口
    queryApplicationGatewaySeletc: `${prefix}queryApplicationGatewaySeletc`, // 查询应用入口的入口对象
    queryPodResourceInfo: `${prefix}queryPodResourceInfo`, // 查询pod的资源监控图表的数据
    queryPodInfo: `${prefix}queryPodInfo`, // 查询pod的资源描述
    getPodLogs: `${prefix}getPodLogs`, // pod的日志
    getIsolationState: `${prefix}getIsolationState`, // 获取是否允许项目外部访问
    openIsolation: `${prefix}openIsolation`, // 允许项目外部访问
    closeIsolation: `${prefix}closeIsolation`, // 不允许项目外部访问
    updateNamespaceLabels: `${prefix}updateNamespaceLabels`, // namespace标签编辑
    deletePvc: `${prefix}deletePvc`, // 删除历史pvc
    listProject: `identity/listProject`, // 获取项目列表
}

export default api