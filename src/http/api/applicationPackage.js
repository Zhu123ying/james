/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    getApplicationPackageProjectList: `${prefix}getApplicationPackageProjectList`, // 列出应用包项目列表
    getApplicationPackageList: `${prefix}getApplicationPackageList`, // 列出项目的所有应用包
    deleteApplicationPackageVersion: `${prefix}deleteApplicationPackageVersion`, // 删除应用包版本
    getApplicationPackage: `${prefix}getApplicationPackage`, // 查看应用包详情
    createApplicationPackage: `${prefix}createApplicationPackage`, // 创建应用包
    updateApplicationPackage: `${prefix}updateApplicationPackage`, // 更新应用包
    deleteApplicationPackage: `${prefix}deleteApplicationPackage`, // 删除应用包
    getApplicationPackageForApplication: `${prefix}getApplicationPackageForApplication`, // 选择应用包管理的应用包版本创建应用时，应用包及版本的信息
    getApplicationPackageVersionsForApplication: `${prefix}getApplicationPackageVersionsForApplication`, // 创建应用时，根据应用包获取所有可使用的版本
    getApplicationPackageVersionsByPackageId: `${prefix}getApplicationPackageVersionsByPackageId`, // 获取无分页的版本列表；
    createApplicationPackageVersion: `${prefix}createApplicationPackageVersion`, // 创建应用包版本（新建）
    createApplicationPackageVersionByUpload: `${prefix}createApplicationPackageVersionByUpload`, // 创建应用包版本（上传）
    createApplicationPackageVersionByCopy: `${prefix}createApplicationPackageVersionByCopy`, // 创建应用包版本（复制）
    updateApplicationPackageVersionChartCommit: `${prefix}updateApplicationPackageVersionChartCommit`, // 提交chart包内容
    getAllApplicationPackageInfo: `${prefix}getAllApplicationPackageInfo`, // 列出项目的所有应用包
    downApplicationPackageVersionChart: `${prefix}downApplicationPackageVersionChart`, // 下载应用包版本声明包
    getApplicationPackageInfoForShare: `${prefix}getApplicationPackageInfoForShare`, // 应用包分享可供选择的版本
    createApplicationPackageAndVersionByShare: `${prefix}createApplicationPackageAndVersionByShare`, // 分享应用包版本
    queryApplicationPackageVersionGateway: `${prefix}queryApplicationPackageVersionGateway`, // 查询应用包版本的应用入口
    createApplicationPackageVersionGateway: `${prefix}createApplicationPackageVersionGateway`, // 添加应用包版本的应用入口
    updateApplicationPackageVersionGateway: `${prefix}updateApplicationPackageVersionGateway`, // 更新应用包版本的应用入口
    createApplicationPackageVersionGateway: `${prefix}createApplicationPackageVersionGateway`, // 添加应用包版本的应用入口
    getApplicationPackageGatewayResourceList: `${prefix}getApplicationPackageGatewayResourceList`,
    getApplicationPackageVersionChartDirByVersionId: `${prefix}getApplicationPackageVersionChartDirByVersionId`, // 更新应用包版本的应用入口
    getApplicationPackageVersionInfo: `${prefix}getApplicationPackageVersionInfo`, // 应用包详情切换版本信息
    verifyChartContent: `${prefix}verifyChartContent`, // 验证chart包内容
    updateApplicationPackageVersionSaveChartFile: `${prefix}updateApplicationPackageVersionSaveChartFile`, // 保存chart包内容
    getApplicationPackageVersionAlarmConfig: `${prefix}getApplicationPackageVersionAlarmConfig`, // 查看应用包版本告警配置
    getApplicationPackageVersionAlarmTemplates: `${prefix}getApplicationPackageVersionAlarmTemplates`, // 查询应用包版本的告警模板
    getApplicationPackageVersionAlarmUsers: `${prefix}getApplicationPackageVersionAlarmUsers`, // 查询应用包版本可供选择的告警通知人
    confirmApplicationPackageVersionAlarmConfig: `${prefix}confirmApplicationPackageVersionAlarmConfig`, // 配置应用包版本告警
}

export default api